
import FlashcardSet from '../models/FlashcardSet.js'
import express from "express";

import db from '../db/connection.js'
import { ObjectId } from "mongodb";


const router = express.Router();



router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const collection = db.collection("flashcardsets");
    console.log("attempting to fetch flashcard sets for userid: "+userId);
    const results = await collection.find({ userId: new ObjectId(userId) }).toArray();
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching user's flashcard sets:", err);
    res.status(500).json({ error: "Failed to fetch flashcard sets" });
  }
});

// get a single set by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("flashcardsets");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});
router.get("/:id", async (req, res) => {
  try {
    const setId = req.params.id;
    const collection = db.collection("flashcardsets");
    const result = await collection.findOne({ _id: new ObjectId(setId) });

    if (!result) {
      return res.status(404).json({ error: "Flashcard set not found" });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching flashcard set:", err);
    res.status(500).json({ error: "Failed to fetch flashcard set" });
  }
});

// create flashcard set
router.post('/create', async (req, res) => {
  try {
    console.log("attempting to create flash card set");
    console.log(req.body);
    const { userId, title, description, cards } = req.body;
    if (!userId) {
      res.status(500).send('You are not logged in!');
      return;
    }
    const newSet = new FlashcardSet({userId, title, description, cards });
    const collection = await db.collection('flashcardsets');
    const result = await collection.insertOne(newSet);
    res.status(201).json(newSet); // Send back the new created document for the set
    console.log("flashcard set successfully created");
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create flashcard set');
  }
});

// delete flash card set
router.delete("/deleteSet/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("flashcardsets");
    let result = await collection.deleteOne(query);

    console.log("flashcard set deleted");
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting flashcard set");
  }
});

// edit flash card set
router.patch("/editSet/:id", async (req, res) => {
  try {
    const query = {_id: new ObjectId(req.params.id)};
    console.log(`attempting to edit set with id: ${req.params.id}`)
    const collection = db.collection("flashcardsets");
    const updates = {
      $set: {
        title: req.body.title,
        description: req.body.description,
        cards: req.body.cards,
      },
    };
    let result = await collection.updateOne(query, updates);
    console.log("flashcard set edited");
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error editing flashcard set");
  }
})

// routes for editCard, deleteCard deleted because their functions are implemented in editSet

export default router;