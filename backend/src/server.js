import express from "express";
import admin from "firebase-admin";
import fs from "fs";
import { db, connectToDB } from "./db.js";
import mongoose from "mongoose";

const credentials = JSON.parse(fs.readFileSync("./credentials.json"));

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});
const app = express();
app.use(express.json());

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
    const updatedArticle = await db.collection("articles").findOne({ name });
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

connectToDB(() => {
  console.log("Successfully connected to the database.");
  app.listen(8000, () => {
    console.log("Server is running on port 8000");
  });
});
