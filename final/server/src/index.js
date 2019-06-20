const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
if (env === 'development') {
  require('dotenv').config();
  console.log(env);
}

const { ApolloServer } = require('apollo-server');
const isEmail = require('isemail');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { createStore } = require('./utils');

const UserAPI = require('./datasources/user');

const internalEngineDemo = require('./engine-demo');

const store = createStore();

const dataSources = () => ({
  userAPI: new UserAPI({ store }),
});

const context = async ({ req }) => {
  const auth = (req.headers && req.headers.authorization) || '';
  const email = new Buffer(auth, 'base64').toString('ascii');

  if (!isEmail.validate(email)) return { user: null };

  const users = await store.users.findOrCreate({ where: { email } });
  const user = users && users[0] ? users[0] : null;

  return { user: { ...user.dataValues } };
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context,
  engine: {
    apiKey: process.env.ENGINE_API_KEY,
    ...internalEngineDemo,
  },
});

if (process.env.NODE_ENV !== 'test')
  server
    .listen({ port: 4000 })
    .then(({ url }) => console.log(`🚀 app running at ${url}`));

module.exports = {
  dataSources,
  context,
  typeDefs,
  resolvers,
  ApolloServer,
  UserAPI,
  store,
  server,
};
