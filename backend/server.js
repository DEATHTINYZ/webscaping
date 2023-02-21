const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = 5000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.get('/', (req, res) => {
  res.send('Hello, World!')
})

app.get('/api/water', async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.thaiwater.net/water/wl");

    let data = [];

    let hasNextPage = true;
    let pageCounter = 1;

    while (hasNextPage) {
      const pageData = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll("#app table tbody tr"));

        return rows
          .map((row) => {
            const th = row.querySelectorAll("th");
            const td = row.querySelectorAll("td");
            const svg = row.querySelectorAll("td button span");
            const data = {
              station: th[0]?.textContent?.trim() || "",
              location: td[0]?.textContent?.trim().replace(/\s+/g, " ") || "",
              waterLevel: td[1]?.textContent?.trim() || "",
              riverBankLevel: td[2]?.textContent?.trim() || "",
              waterSituation: td[3]?.textContent?.trim() || "",
              status: td[4]?.textContent?.trim() || "",
              trend: svg[0]?.innerHTML?.trim() || "",
              datetime: td[6]?.textContent?.trim() || "",
            };
            if (Object.values(data).some((value) => value !== "")) {
              return data;
            }
          })
          .filter(Boolean);
      });

      data = data.concat(pageData);

      const nextButton = await page.$(
        "#app > main > div > div > div > div:nth-child(4) > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-md-7.MuiGrid-grid-lg-8 > div:nth-child(3) > div > div.MuiTablePagination-root > div > div > button:nth-child(3)"
      );
      hasNextPage = !(await page.evaluate(
        (nextButton) => nextButton.disabled,
        nextButton
      ));

      await nextButton.click();
      await page.waitForSelector("#app table tbody tr");
      pageCounter++;
      console.log(`Navigated to page ${pageCounter}`);
    }

    await browser.close();
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
