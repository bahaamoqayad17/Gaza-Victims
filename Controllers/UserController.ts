import User from "@/Models/User";

export const addUser = async (input: any) => {
  const user = await User.create(input);
  return user;
};
export const getAllUsers = async () => {
  const users = await User.find();
  return users;
};
