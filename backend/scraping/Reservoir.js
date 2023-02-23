const puppeteer = require('puppeteer');
const fs = require('fs');

async function reservoirData() {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.thaiwater.net/water');

    let data = {
      largeTub: [],
    };

    let hasNextPage = true;
    let pageCounter = 1;

    while (hasNextPage) {
      const pageData = await page.evaluate(() => {
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

      data.largeTub = data.largeTub.concat(pageData);

      const nextButton = await page.$(
        '#app > main > div > div > div:nth-child(4) > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-12.MuiGrid-grid-md-7.MuiGrid-grid-lg-7 > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-12.MuiGrid-grid-md-12.MuiGrid-grid-lg-12 > div.MuiPaper-root.MuiPaper-elevation1.MuiPaper-rounded > div > div.MuiTypography-root.MuiTypography-body1 > div.MuiTablePagination-root.jss1703 > div > div.jss2068 > button:nth-child(3)'
      );

      hasNextPage = !(await page.evaluate(
        (nextButton) => nextButton.disabled,
        nextButton
      ));

      if (!hasNextPage) {
        const nextTableButton = await page.$(
          '#app > main > div > div > div:nth-child(4) > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-12.MuiGrid-grid-md-7.MuiGrid-grid-lg-7 > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-12.MuiGrid-grid-md-12.MuiGrid-grid-lg-12 > div.MuiPaper-root.MuiPaper-elevation1.MuiPaper-rounded > div > div.MuiPaper-root.MuiPaper-elevation1 > div > div > div > button:nth-child(2)'
        );
        await nextTableButton.click();

        await page.waitForSelector('#app table tbody tr');

        let data2 = {
          mediumSizeTub: [],
        };
        hasNextPage = true;
        pageCounter = 1;

        while (hasNextPage) {
          const pageData2 = await page.evaluate(() => {
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

          data2.mediumSizeTub = data2.mediumSizeTub.concat(pageData2);

          const nextButton2 = await page.$(
            '#app > main > div > div > div:nth-child(4) > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-12.MuiGrid-grid-md-7.MuiGrid-grid-lg-7 > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-12.MuiGrid-grid-md-12.MuiGrid-grid-lg-12 > div.MuiPaper-root.MuiPaper-elevation1.MuiPaper-rounded > div > div.MuiTypography-root.MuiTypography-body1 > div.MuiTablePagination-root.jss2460 > div > div.jss2068 > button:nth-child(3)'
          );

          hasNextPage = !(await page.evaluate(
            (nextButton2) => nextButton2.disabled,
            nextButton2
          ));

          if (!nextButton2) {
            console.log(`Reached the last page`);
            break;
          }

          await nextButton2.click();
          await page.waitForSelector('#app table tbody tr');
          pageCounter++;
        }

        await browser.close();

        const combinedData = { ...data, ...data2 };

        const duplicateData = Object.entries(combinedData).reduce((acc, [key, arr]) => {
            acc[key] = arr.filter(obj => !obj.reservoir.includes("รวม"));
            return acc;
          }, {});

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

      await nextButton.click();
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
      console.log('Webpage closed or terminated.');
    } else {
      console.error(error);
    }
  }
}

module.exports = reservoirData;
