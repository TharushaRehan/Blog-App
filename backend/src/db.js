// import { MongoClient, ServerApiVersion } from "mongodb";

// const uri =
//   "mongodb+srv://tharushaperera088:U3osCMCGN9QlP0Re@cluster0.ljrismy.mongodb.net/";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// export const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });
// // Define an async function to connect and export the database object
// export async function connectToDb() {
//   try {
//     // Connect to the MongoDB server
//     await client.connect();

//     // Get a reference to the desired database (replace 'blog-db' with your actual database name)
//     const db = client.db("blog-db");

//     // Validate connection (optional)
//     await db.command({ ping: 1 });
//     console.log("Successfully connected to MongoDB database!");

//     // Return the connected database object for further use
//     return db;
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//     throw error; // Re-throw the error for proper handling
//   } finally {
//     // Ensure client close on exit/error
//     //await client.close();
//   }
// }

// import { MongoClient } from "mongodb";
// let db;

// async function connectToDB(cb) {
//   const client = new MongoClient("mongodb://127.0.0.1:27017");

//   await client.connect();

//   db = client.db("blog-db");
//   cb();
// }

// export { db, connectToDB };

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.ATLAS_URI || "mongodb://localhost:27017/blog-db",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1); // Exit process on failure
  }
};

export default connectDB;
