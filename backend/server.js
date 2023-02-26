const fs = require('fs');
const cron = require('node-cron');
const express = require('express');
const waterLevelData = require('./scraping/WaterLevel');
const reservoirData = require('./scraping/Reservoir');

const app = express();
const port = 5000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

cron.schedule('*/15 * * * *', async () => {
  try {
    await waterLevelData();
    await reservoirData();
  } catch (error) {
    console.error(error);
  }
});

Promise.all([waterLevelData(), reservoirData()]).then(() => {
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}).catch(error => {
  console.error(error);
  process.exit(1);
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/api/waterlevel', async (req, res) => {
  try {
    const rawData = fs.readFileSync('./data/waterLevelData.json');
    const data = JSON.parse(rawData);
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.get('/api/reservoir', async (req, res) => {
  try {
    const rawData = fs.readFileSync('./data/reservoirData.json');
    const data = JSON.parse(rawData);
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});
