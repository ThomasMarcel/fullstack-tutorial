const { paginateResults } = require('./utils');

module.exports = {
  Query: {
    me: async (_, __, { dataSources }) =>
      dataSources.userAPI.findOrCreateUser(),
  },
  Mutation: {
    login: async (_, { email, password }, { dataSources }) => {
      const user = await dataSources.userAPI.findUser({ email, password });
      if (user) return new Buffer(email).toString('base64');
    },
    signup: async (_, { email, password }, { dataSources }) => {
      const user = await dataSources.userAPI.findOrCreateUser({ email, password });
      if (user) return user;
    },
  },
  User: {
    role: (user, { role } = { role: 'STANDARD' }) => {
      return role === 'ADMIN'
        ? user.userRoleAdmin
        : user.userRoleStandard;
    },
  },
};
