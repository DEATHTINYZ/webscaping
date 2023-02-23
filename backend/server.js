const cron = require('node-cron');
const express = require('express');
const fs = require('fs');
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

cron.schedule('*/15 * * * *', () => {
  waterLevelData();
  reservoirData();
});

waterLevelData();
reservoirData();

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

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
