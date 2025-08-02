import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "@/Models/User";
import Case from "@/Models/Case";

dotenv.config({ path: "./.env" });
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DATABASE_URL!)
  .then(() => console.log("DB connection successful!"));

const cases = JSON.parse(fs.readFileSync(__dirname + "/cases.json", "utf-8"));
const users = JSON.parse(fs.readFileSync(__dirname + "/users.json", "utf-8"));

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Case.create(cases);
    await User.create(users, { validateBeforeSave: false });
    console.log("Data Successfully Inserted !");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Case.deleteMany();
    await User.deleteMany();
    console.log("Data Successfully Deleted !");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--seed") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
