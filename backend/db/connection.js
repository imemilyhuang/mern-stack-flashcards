// file for connecting to MongoDB database, cite https://github.com/mongodb-developer/mern-stack-example

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { MongoClient, ServerApiVersion } from "mongodb";

import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });


const URI = process.env.MONGODB_URI || "";
const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});



mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


let db = client.db("test"); // name of db in our mongodb atlas project

export default db;