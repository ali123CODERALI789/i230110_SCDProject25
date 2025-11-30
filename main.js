const readline = require('readline');
const db = require('./db');
require('./events/logger');
require('dotenv').config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function menu() {
  console.log(`
===== NodeVault =====
1. Add Record
2. List Records
3. Update Record
4. Delete Record
5. Search Records
6. Sort Records
7. Export Data
8. View Vault Statistics
9. Exit
=====================
  `);

  rl.question('Choose option: ', async (ans) => {
    try {
      switch (ans.trim()) {
        case '1':
          rl.question('Enter name: ', (name) => {
            rl.question('Enter value: ', async (value) => {
              await db.addRecord({ name, value });
              db.createBackup();
              console.log('Record added successfully! Backup created.');
              menu();
            });
          });
          break;

        case '2':
          const records = await db.listRecords();
          if (records.length === 0) console.log('No records found.');
          else records.forEach(r => console.log(`ID: ${r.id} | Name: ${r.name} | Value: ${r.value} | Created: ${r.createdAt}`));
          menu();
          break;

        case '3':
          rl.question('Enter record ID to update: ', (id) => {
            rl.question('New name: ', (name) => {
              rl.question('New value: ', async (value) => {
                const updated = await db.updateRecord(Number(id), name, value);
                if (updated) db.createBackup();
                console.log(updated ? 'Record updated! Backup created.' : 'Record not found.');
                menu();
              });
            });
          });
          break;

        case '4':
          rl.question('Enter record ID to delete: ', async (id) => {
            const deleted = await db.deleteRecord(Number(id));
            if (deleted) db.createBackup();
            console.log(deleted ? 'Record deleted! Backup created.' : 'Record not found.');
            menu();
          });
          break;

        case '5':
          rl.question('Enter search keyword (name or ID): ', async (term) => {
            const found = await db.searchRecords(term);
            if (found.length === 0) {
              console.log('No records found.');
            } else {
              console.log(`Found ${found.length} matching record(s):`);
              found.forEach((r, index) => console.log(`${index + 1}. ID: ${r.id} | Name: ${r.name} | Value: ${r.value} | Created: ${r.createdAt}`));
            }
            menu();
          });
          break;

        case '6':
          rl.question('Sort by (name/createdAt): ', (field) => {
            rl.question('Order (asc/desc): ', async (order) => {
              if (['name', 'createdAt'].includes(field) && ['asc', 'desc'].includes(order)) {
                const sorted = await db.sortRecords(field, order);
                console.log('Sorted Records:');
                sorted.forEach((r, index) => console.log(`${index + 1}. ID: ${r.id} | Name: ${r.name} | Created: ${r.createdAt}`));
              } else {
                console.log('Invalid field or order.');
              }
              menu();
            });
          });
          break;

        case '7':
          const exported = await db.exportToFile();
          console.log(exported ? 'Data exported successfully to export.txt' : 'Export failed.');
          menu();
          break;

        case '8':
          const stats = await db.getStatistics();
          if (!stats) {
            console.log('No records in vault.');
          } else {
            console.log(`
Vault Statistics:
---
Total Records: ${stats.totalRecords}
Last Modified: ${stats.lastModified}
Longest Name: ${stats.longestName} (${stats.longestNameLength} characters)
Earliest Record: ${stats.earliestRecord}
Latest Record: ${stats.latestRecord}
            `);
          }
          menu();
          break;

        case '9':
          console.log('Exiting NodeVault...');
          const mongodb = require('./db/mongodb');
          await mongodb.closeDB();
          rl.close();
          break;

        default:
          console.log('Invalid option.');
          menu();
      }
    } catch (error) {
      console.log('Error:', error.message);
      menu();
    }
  });
}

menu().catch(console.error);
