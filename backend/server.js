const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const express = require('express');
const waterLevelData = require('./scraping/WaterLevel');
const reservoirData = require('./scraping/Reservoir');

const app = express();
const port = 5000;

app.use(function (req, res, next) {
  res.header(
    'Access-Control-Allow-Origin',
    'https://waterdata-table.vercel.app'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

cron.schedule('*/1 * * * *', async () => {
  try {
    await waterLevelData();
    await reservoirData();
    let waterLevelCache = null;
    let reservoirCache = null;
  } catch (error) {
    console.error(error);
  }
});

Promise.all([waterLevelData(), reservoirData()])
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/waterlevel', async (req, res) => {
  if (!waterLevelCache) {
    try {
      const rawData = fs.readFileSync(
        path.join(__dirname, 'data/waterLevelData.json')
      );
      waterLevelCache = JSON.parse(rawData);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
      return;
    }
  }
  res.send(waterLevelCache);
});

app.get('/api/reservoir', async (req, res) => {
  if (!reservoirCache) {
    try {
      const rawData = fs.readFileSync(
        path.join(__dirname, 'data/reservoirData.json')
      );
      reservoirCache = JSON.parse(rawData);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
      return;
    }
  }
  res.send(reservoirCache);
});
