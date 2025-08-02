import { index, create, show, update, deleteModel } from "./FactoryHandler";
import Case from "../Models/Case";

export const getAllCases = index(Case);
export const createCase = create(Case);
export const getCase = show(Case);
export const updateCase = update(Case);
export const deleteCase = deleteModel(Case);
