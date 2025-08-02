import User from "@/Models/User";
import { Resolvers } from "./generated/graphql-types";

export const resolvers: Resolvers = {
  Query: {
    users: async () => await User.find().select("-password"),
    user: async (_: any, args: { id: string }) =>
      await User.findById(args.id).select("-password"),
  },

  Mutation: {
    createUser: async (_: any, args: any) => {
      const user = await User.create(args);
      user.password = ""; // clear sensitive data
      return user;
    },
  },
};
