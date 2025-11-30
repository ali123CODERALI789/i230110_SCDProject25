const mongodb = require('./mongodb');
const recordUtils = require('./record');
const vaultEvents = require('../events');

async function addRecord({ name, value }) {
  recordUtils.validateRecord({ name, value });
  const collection = await mongodb.getCollection('records');
  const newRecord = { 
    id: recordUtils.generateId(), 
    name, 
    value, 
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  await collection.insertOne(newRecord);
  vaultEvents.emit('recordAdded', newRecord);
  return newRecord;
}

async function listRecords() {
  const collection = await mongodb.getCollection('records');
  const records = await collection.find().toArray();
  return records || [];
}

async function updateRecord(id, newName, newValue) {
  const collection = await mongodb.getCollection('records');
  const result = await collection.findOneAndUpdate(
    { id: Number(id) },
    { $set: { name: newName, value: newValue } },
    { returnDocument: 'after' }
  );
  
  if (result.value) {
    vaultEvents.emit('recordUpdated', result.value);
    return result.value;
  }
  return null;
}

async function deleteRecord(id) {
  const collection = await mongodb.getCollection('records');
  const record = await collection.findOne({ id: Number(id) });
  if (!record) return null;
  
  await collection.deleteOne({ id: Number(id) });
  vaultEvents.emit('recordDeleted', record);
  return record;
}

// Search functionality
async function searchRecords(searchTerm) {
  const collection = await mongodb.getCollection('records');
  const term = searchTerm.toLowerCase();
  
  const searchId = Number(term);
  if (!isNaN(searchId)) {
    const result = await collection.findOne({ id: searchId });
    return result ? [result] : [];
  } else {
    const results = await collection.find({
      name: { $regex: term, $options: 'i' }
    }).toArray();
    return results || [];
  }
}

// Sort functionality
async function sortRecords(field, order) {
  const collection = await mongodb.getCollection('records');
  const sortOrder = order === 'asc' ? 1 : -1;
  const results = await collection.find().sort({ [field]: sortOrder }).toArray();
  return results || [];
}

// Export to text file
async function exportToFile() {
  const data = await listRecords();
  const fs = require('fs');
  const header = `=== VAULT EXPORT ===
Date: ${new Date().toLocaleString()}
Total Records: ${data.length}
File: export.txt
=================

`;
  
  const recordsText = data.map((record, index) => 
    `${index + 1}. ID: ${record.id} | Name: ${record.name} | Value: ${record.value} | Created: ${record.createdAt}`
  ).join('\n');
  
  fs.writeFileSync('export.txt', header + recordsText);
  return true;
}

// Automatic backup - keep file-based for now
function createBackup() {
  const fileDB = require('./file');
  const data = fileDB.readDB();
  const fs = require('fs');
  const path = require('path');
  
  const backupDir = path.join(__dirname, '..', 'backups');
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('.')[0];
  const backupFile = path.join(backupDir, `backup_${timestamp}.json`);
  
  fs.writeFileSync(backupFile, JSON.stringify(data, null, 2));
  return backupFile;
}

// Statistics
async function getStatistics() {
  const data = await listRecords();
  
  if (data.length === 0) return null;
  
  const validRecords = data.filter(record => record.createdAt);
  if (validRecords.length === 0) return null;
  
  const names = validRecords.map(r => r.name);
  const dates = validRecords.map(r => new Date(r.createdAt)).filter(date => !isNaN(date));
  
  if (dates.length === 0) return null;
  
  return {
    totalRecords: data.length,
    lastModified: new Date().toLocaleString(),
    longestName: names.reduce((a, b) => a.length > b.length ? a : b),
    longestNameLength: Math.max(...names.map(name => name.length)),
    earliestRecord: new Date(Math.min(...dates)).toISOString().split('T')[0],
    latestRecord: new Date(Math.max(...dates)).toISOString().split('T')[0]
  };
}

module.exports = { 
  addRecord, listRecords, updateRecord, deleteRecord, 
  searchRecords, sortRecords, exportToFile, createBackup, getStatistics 
};
