import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "@/index";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "@/GraphQL/schema";
import { resolvers } from "@/GraphQL/resolvers";
import AppError from "@/Utils/AppError";

process.on("uncaughtException", (err: Error) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./.env" });
mongoose.set("strictQuery", false);

async function startServer() {
  try {
    await mongoose.connect(process.env.DATABASE_URL!);
    console.log("✅ DB connection successful!");

    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      introspection: true,
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({ app: app as any, path: "/graphql" });

    // Add catch-all route AFTER GraphQL middleware is applied
    app.all("*", (req, res, next) => {
      next(
        new AppError("Can't find " + req.originalUrl + " on this server", 404)
      );
    });

    const port = process.env.PORT || 4000;
    const server = app.listen(port, () => {
      console.log(`🚀 App running on port ${port}...`);
      console.log(
        `🚀 GraphQL ready at http://localhost:${port}${apolloServer.graphqlPath}`
      );
    });

    process.on("unhandledRejection", (err: Error) => {
      console.log("UNHANDLED REJECTION! 💥 Shutting down...");
      console.log(err.name, err.message);
      server.close(() => process.exit(1));
    });

    process.on("SIGTERM", () => {
      console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
      server.close(() => {
        console.log("💥 Process terminated!");
      });
    });
  } catch (err: any) {
    console.error("❌ Error during startup:", err);
    process.exit(1);
  }
}

startServer();
