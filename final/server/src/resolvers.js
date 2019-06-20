const { paginateResults } = require('./utils');

module.exports = {
  Query: {
    me: async (_, __, { dataSources }) =>
      dataSources.userAPI.findOrCreateUser(),
  },
  Mutation: {
    login: async (_, { email }, { dataSources }) => {
      const user = await dataSources.userAPI.findOrCreateUser({ email });
      if (user) return new Buffer(email).toString('base64');
    },
  },
  User: {
    role: (user, { type } = { role: 'STANDARD' }) => {
      return size === 'ADMIN'
        ? user.userRoleAdmin
        : user.userRoleStandard;
    },
  },
};
