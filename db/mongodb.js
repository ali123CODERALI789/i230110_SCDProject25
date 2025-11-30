const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/scdvault';
let client = null;
let db = null;

async function connectDB() {
  if (db) return db;
  
  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db('scdvault');
    console.log('Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    throw error;
  }
}

async function getCollection(collectionName) {
  const database = await connectDB();
  return database.collection(collectionName);
}

async function closeDB() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

module.exports = { getCollection, closeDB };
