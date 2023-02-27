const puppeteer = require('puppeteer');
const fs = require('fs');

async function reservoirData() {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.thaiwater.net/water');

    let largeTubData = {
      largeTub: [],
    };

    let hasNextPage = true;
    let pageCounter = 1;

    while (hasNextPage) {
      const largePageData = await page.evaluate(() => {
        const rows = Array.from(
          document.querySelectorAll('#app table tbody tr')
        );

        return rows
          .map((row) => {
            const th = row.querySelectorAll('th');
            const td = row.querySelectorAll('td');
            const data = {
              reservoir: th[0].textContent.trim(),
              capacity: td[0].textContent.trim(),
              amountOfWater: td[1].textContent.trim(),
              practical: td[2].textContent.trim(),
              waterRunningdown: td[3].textContent.trim(),
              drainWater: td[4].textContent.trim(),
            };
            if (Object.values(data).some((value) => value !== '')) {
              return data;
            }
          })
          .filter(Boolean);
      });

      largeTubData.largeTub = largeTubData.largeTub.concat(largePageData);

      const nextButton = await page.$(
        '#app > main > div > div > div:nth-child(4) > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-12.MuiGrid-grid-md-7.MuiGrid-grid-lg-7 > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-12.MuiGrid-grid-md-12.MuiGrid-grid-lg-12 > div.MuiPaper-root.MuiPaper-elevation1.MuiPaper-rounded > div > div.MuiTypography-root.MuiTypography-body1 > div.MuiTablePagination-root > div > div > button:nth-child(3)'
      );

      if (!nextButton) {
        hasNextPage = false;
      }
      
      if (hasNextPage) {
        hasNextPage = !(await page.evaluate(
          (nextButton) => nextButton.disabled,
          nextButton
        ));
      }

      if (!hasNextPage) {
        const nextTableButton = await page.$(
          '#app > main > div > div > div:nth-child(4) > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-12.MuiGrid-grid-md-7.MuiGrid-grid-lg-7 > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-12.MuiGrid-grid-md-12.MuiGrid-grid-lg-12 > div.MuiPaper-root.MuiPaper-elevation1.MuiPaper-rounded > div > div.MuiPaper-root.MuiPaper-elevation1 > div > div > div > button:nth-child(2)'
        );
        await nextTableButton.click();

        await page.waitForSelector('#app table tbody tr');

        let mediumTubData = {
          mediumTub: [],
        };
        hasNextPage = true;
        pageCounter = 1;

        while (hasNextPage) {
          const mediumPageData = await page.evaluate(() => {
            const rows = Array.from(
              document.querySelectorAll('#app table tbody tr')
            );

            return rows
              .map((row) => {
                const th = row.querySelectorAll('th');
                const td = row.querySelectorAll('td');
                const data = {
                  reservoir: th[0].textContent.trim(),
                  province: td[0].textContent.trim(),
                  normalStorage: td[1].textContent.trim(),
                  amountOfWater: td[2].textContent.trim(),
                  waterRunningdown: td[3].textContent.trim(),
                  drainWater: td[4].textContent.trim(),
                };
                if (Object.values(data).some((value) => value !== '')) {
                  return data;
                }
              })
              .filter(Boolean);
          });

          mediumTubData.mediumTub = mediumTubData.mediumTub.concat(mediumPageData);

          const nextButton2 = await page.$(
            '#app > main > div > div > div:nth-child(4) > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-12.MuiGrid-grid-md-7.MuiGrid-grid-lg-7 > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-12.MuiGrid-grid-md-12.MuiGrid-grid-lg-12 > div.MuiPaper-root.MuiPaper-elevation1.MuiPaper-rounded > div > div.MuiTypography-root.MuiTypography-body1 > div.MuiTablePagination-root > div > div > button:nth-child(3)'
          );

          hasNextPage = !(await page.evaluate(
            (nextButton2) => nextButton2.disabled,
            nextButton2
          ));

          if (!nextButton2) {
            break;
          }

          await nextButton2.click();
          await page.waitForSelector('#app table tbody tr');
          pageCounter++;
        }

        await browser.close();

        const combinedData = { ...largeTubData, ...mediumTubData };

        const duplicateData = Object.entries(combinedData).reduce(
          (acc, [key, arr]) => {
            acc[key] = arr.filter((obj) => !obj.reservoir.includes('รวม'));
            return acc;
          },
          {}
        );

        fs.writeFile(
          './data/reservoirData.json',
          JSON.stringify(duplicateData),
          (err) => {
            if (err) {
              console.log(err);
              return;
            }
          }
        );
      }

      await nextButton?.click();
      await page.waitForSelector('#app table tbody tr');
      pageCounter++;
    }

    fs.writeFile('./data/reservoirData.json', JSON.stringify(data), (err) => {
      if (err) {
        console.log(err);
        return;
      }
    });
  } catch (error) {
    if (error.message.includes('Session closed')) {
    } else {
      console.error(error);
    }
  }
}

module.exports = reservoirData;
