import { index, create, show, update, deleteModel } from "./FactoryHandler";
import User from "../Models/User";

export const getAllUsers = index(User);
export const createUser = create(User);
export const getUser = show(User);
export const updateUser = update(User);
export const deleteUser = deleteModel(User);
