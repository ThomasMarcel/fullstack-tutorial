const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    me: User
  }

  type Mutation {
    login(email: String, password: String): String # login token
    signup(email: String, password: String): UserUpdateResponse
  }

  type UserUpdateResponse {
    success: Boolean!
    message: String
    user: User
  }

  type UserConnection {
    cursor: String!
    hasMore: Boolean!
    user: User!
  }

  type User {
    id: ID!
    email: String!
    password: String!
    role(role: UserRole): String
  }

  enum UserRole {
    STANDARD
    ADMIN
  }
`;

module.exports = typeDefs;
