import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type User {
    _id: ID!
    name: String!
    email: String!
    role: String!
    passwordChangedAt: String
  }

  type Case {
    _id: ID!
  }

  type Query {
    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    createUser(
      name: String!
      email: String!
      password: String!
      passwordConfirm: String!
    ): User
    login(email: String!, password: String!): String # returns token
  }
`;
