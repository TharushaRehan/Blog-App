import express from "express";
import admin from "firebase-admin";
import { MongoClient } from "mongodb";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = 8000;
const mongoURI = process.env.ATLAS_URI;

const firebaseConfig = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/gm, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_x509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_x509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

// Connect to MongoDB
MongoClient.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((client) => {
    admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
    });

    const db = client.db("blog-db");

    //middleware
    app.use(async (req, res, next) => {
      const { authtoken } = req.headers;

      if (authtoken) {
        try {
          req.user = await admin.auth().verifyIdToken(authtoken);
        } catch (e) {
          return res.sendStatus(400);
        }
      }
      req.user = req.user || {};

      next();
    });

    /*get all the article details from the mongodb database and send it to the frontend */
    app.get("/api/articles/getall", async (req, res) => {
      const allArticles = await db.collection("articles").find().toArray();
      if (allArticles) {
        res.json(allArticles);
      } else {
        res.sendStatus(404);
      }
    });

    /* return the article data to the frontend if that exists */
    app.get("/api/articles/:name", async (req, res) => {
      const { name } = req.params;
      const { uid } = req.user;
      //check if there is a article with the given name
      // if yes check the sign in user can like the article or not
      const article = await db.collection("articles").findOne({ name });
      if (article) {
        const upvoteIds = await db
          .collection("articles")
          .distinct("upvoteIds", { name: name });
        article.canUpvote = upvoteIds.includes(uid);

        res.json(article);
      } else {
        res.sendStatus(404);
      }
    });

    // middleware
    // check if there is signed in user, if yes, the make that other api requests available
    app.use((req, res, next) => {
      if (req.user) {
        next();
      } else {
        res.sendStatus(401);
      }
    });

    /* update likes for the article
first check if the signed in user's id is already in likes array
if not increase the likes by 1 and add the user's uid to the array */
    app.put("/api/articles/:name/upvote", async (req, res) => {
      const { name } = req.params;
      const { uid } = req.user;
      const article = await db.collection("articles").findOne({ name });
      if (article) {
        const upvoteIds = await db
          .collection("articles")
          .distinct("upvoteIds", { name: name });
        const canUpvote = uid && !upvoteIds.includes(uid);
        if (canUpvote) {
          try {
            await db.collection("articles").updateOne(
              { name },
              {
                $inc: { upvotes: 1 },
                $push: { upvoteIds: uid },
              }
            );
          } catch (err) {
            console.log(err);
          }
        }
        const updatedArticle = await db
          .collection("articles")
          .findOne({ name });
        res.json(updatedArticle);
      } else {
        res.send("That article doesn't exist.");
      }
    });

    /* add comments to the article
add the recieved comment to the database with the user's email address */
    app.post("/api/articles/:name/comments", async (req, res) => {
      const { name } = req.params;
      const { text } = req.body;
      const { email } = req.user;

      await db.collection("articles").updateOne(
        { name },
        {
          $push: { comments: { postedBy: email, text } },
        }
      );
      const article = await db.collection("articles").findOne({ name });

      if (article) {
        res.json(article);
      } else {
        res.send("That article doesn't exist.");
      }
    });

    // define article scheme
    const articleSchema = new mongoose.Schema({
      uid: { type: String, default: 0 },
      name: { type: String, required: true },
      title: { type: String, required: true },
      content: { type: String, required: true },
      upvotes: { type: Number, default: 0 },
      comments: { type: Array, default: [] },
      upvoteIds: { type: Array, default: [] },
    });
    const Article = mongoose.model("Article", articleSchema);

    /* add articles to the database
      get the recieved data from the frontend, create new object from the article model with the data
by default likes,comments will be set to default values
then insert to the database*/
    app.post("/api/articles/addarticle", async (req, res) => {
      const { name, title, content } = req.body;
      const { uid } = req.user;

      const newArticle = new Article({
        uid,
        name,
        title,
        content,
      });

      try {
        await db.collection("articles").insertOne(newArticle);
        res.send("Article saved successfully");
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to save article" });
      }
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// import express from "express";
// import admin from "firebase-admin";
// import fs from "fs";
// //import { connectToDb } from "./db.js";
// import db from "./db.js";
// import mongoose from "mongoose";
// import dotenv from "dotenv";

// dotenv.config();

// //const credentials = JSON.parse(fs.readFileSync("./credentials.json"));

// const firebaseConfig = {
//   type: process.env.FIREBASE_TYPE,
//   project_id: process.env.FIREBASE_PROJECT_ID,
//   private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
//   private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/gm, "\n"),
//   client_email: process.env.FIREBASE_CLIENT_EMAIL,
//   client_id: process.env.FIREBASE_CLIENT_ID,
//   auth_uri: process.env.FIREBASE_AUTH_URI,
//   token_uri: process.env.FIREBASE_TOKEN_URI,
//   auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_x509_CERT_URL,
//   client_x509_cert_url: process.env.FIREBASE_CLIENT_x509_CERT_URL,
//   universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
// };

// admin.initializeApp({
//   credential: admin.credential.cert(firebaseConfig),
// });

// const app = express();
// app.use(express.json());

// //const db = await connectToDb();

// //middleware
// app.use(async (req, res, next) => {
//   const { authtoken } = req.headers;

//   if (authtoken) {
//     try {
//       req.user = await admin.auth().verifyIdToken(authtoken);
//     } catch (e) {
//       return res.sendStatus(400);
//     }
//   }
//   req.user = req.user || {};

//   next();
// });

// /*get all the article details from the mongodb database and send it to the frontend */
// app.get("/api/articles/getall", async (req, res) => {
//   const allArticles = await db.collection("articles").find().toArray();
//   if (allArticles) {
//     res.json(allArticles);
//   } else {
//     res.sendStatus(404);
//   }
// });

// /* return the article data to the frontend if that exists */
// app.get("/api/articles/:name", async (req, res) => {
//   const { name } = req.params;
//   const { uid } = req.user;
//   //check if there is a article with the given name
//   // if yes check the sign in user can like the article or not
//   const article = await db.collection("articles").findOne({ name });
//   if (article) {
//     const upvoteIds = await db
//       .collection("articles")
//       .distinct("upvoteIds", { name: name });
//     article.canUpvote = upvoteIds.includes(uid);

//     res.json(article);
//   } else {
//     res.sendStatus(404);
//   }
// });

// // middleware
// // check if there is signed in user, if yes, the make that other api requests available
// app.use((req, res, next) => {
//   if (req.user) {
//     next();
//   } else {
//     res.sendStatus(401);
//   }
// });

// /* update likes for the article
// first check if the signed in user's id is already in likes array
// if not increase the likes by 1 and add the user's uid to the array */
// app.put("/api/articles/:name/upvote", async (req, res) => {
//   const { name } = req.params;
//   const { uid } = req.user;
//   const article = await db.collection("articles").findOne({ name });
//   if (article) {
//     const upvoteIds = await db
//       .collection("articles")
//       .distinct("upvoteIds", { name: name });
//     const canUpvote = uid && !upvoteIds.includes(uid);
//     if (canUpvote) {
//       try {
//         await db.collection("articles").updateOne(
//           { name },
//           {
//             $inc: { upvotes: 1 },
//             $push: { upvoteIds: uid },
//           }
//         );
//       } catch (err) {
//         console.log(err);
//       }
//     }
//     const updatedArticle = await db.collection("articles").findOne({ name });
//     res.json(updatedArticle);
//   } else {
//     res.send("That article doesn't exist.");
//   }
// });

// /* add comments to the article
// add the recieved comment to the database with the user's email address */
// app.post("/api/articles/:name/comments", async (req, res) => {
//   const { name } = req.params;
//   const { text } = req.body;
//   const { email } = req.user;

//   await db.collection("articles").updateOne(
//     { name },
//     {
//       $push: { comments: { postedBy: email, text } },
//     }
//   );
//   const article = await db.collection("articles").findOne({ name });

//   if (article) {
//     res.json(article);
//   } else {
//     res.send("That article doesn't exist.");
//   }
// });

// // define article scheme
// const articleSchema = new mongoose.Schema({
//   uid: { type: String, default: 0 },
//   name: { type: String, required: true },
//   title: { type: String, required: true },
//   content: { type: String, required: true },
//   upvotes: { type: Number, default: 0 },
//   comments: { type: Array, default: [] },
//   upvoteIds: { type: Array, default: [] },
// });
// const Article = mongoose.model("Article", articleSchema);

// /* add articles to the database
// get the recieved data from the frontend, create new object from the article model with the data
// by default likes,comments will be set to default values
// then insert to the database*/
// app.post("/api/articles/addarticle", async (req, res) => {
//   const { name, title, content } = req.body;
//   const { uid } = req.user;

//   const newArticle = new Article({
//     uid,
//     name,
//     title,
//     content,
//   });

//   try {
//     await db.collection("articles").insertOne(newArticle);
//     res.send("Article saved successfully");
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to save article" });
//   }
// });

// // connectToDB(() => {
// //   console.log("Successfully connected to the database.");
// //   app.listen(8000, () => {
// //     console.log("Server is running on port 8000");
// //   });
// // });

// const PORT = 8000;

// app.listen(PORT, () => {
//   console.log("Server is running on port 8000");
// });
