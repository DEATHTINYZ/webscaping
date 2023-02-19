const puppeteer = require("puppeteer");
const fs = require("fs");

// (async () => {
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();
//   await page.goto("https://www.thaiwater.net/water/wl");

//   let data = [];

//   let hasNextPage = true;
//   let pageCounter = 1;

//   while (hasNextPage) {
//     // Extract the data from the table
//       const pageData = await page.evaluate(() => {
//         const rows = Array.from(
//           document.querySelectorAll("#app table tbody tr")
//         );
//         return rows.map((row) => {
//           const th = row.querySelectorAll("th");
//           const columns = row.querySelectorAll("td");
//           return {
//             station: th[0].textContent.trim(),
//             location: columns[0].textContent.trim().replace(/\s+/g, " "),
//             basin: columns[1].textContent.trim(),
//             province: columns[2].textContent.trim(),
//             waterLevel: columns[3].textContent.trim(),
//             status: columns[4].textContent.trim(),
//             datetime: columns[6].textContent.trim(),
//           };
//         });
//       });
//       data = data.concat(pageData);

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.thaiwater.net/water/wl");

  let data = [];

  let hasNextPage = true;
  let pageCounter = 1;

  while (hasNextPage) {
    // Extract the data from the table
    const pageData = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll("#app table tbody tr"));

      return rows
        .map((row) => {
          const th = row.querySelectorAll("th");
          const td = row.querySelectorAll("td");
          const data = {
            station: th[0]?.textContent?.trim() || "",
            location: td[0]?.textContent?.trim().replace(/\s+/g, " ") || "",
            basin: td[1]?.textContent?.trim() || "",
            province: td[2]?.textContent?.trim() || "",
            waterLevel: td[3]?.textContent?.trim() || "",
            status: td[4]?.textContent?.trim() || "",
            datetime: td[6]?.textContent?.trim() || "",
          };
          // Filter out objects where all properties are empty strings
          if (Object.values(data).some((value) => value !== "")) {
            return data;
          }
        })
        .filter(Boolean); // Filter out any undefined objects
    });

    data = data.concat(pageData);

    // Check if there is a next page
    const nextButton = await page.$(
      "#app > main > div > div > div > div:nth-child(4) > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-md-7.MuiGrid-grid-lg-8 > div:nth-child(3) > div > div.MuiTablePagination-root > div > div > button:nth-child(3)"
    );
    hasNextPage = !(await page.evaluate(
      (nextButton) => nextButton.disabled,
      nextButton
    ));

    // if (!nextButton) {
    //   console.log(`Reached the last page`);
    //   break;
    // }

    // Click the next button and wait for the table to load again
    await nextButton.click();
    await page.waitForSelector("#app table tbody tr");
    pageCounter++;
    console.log(`Navigated to page ${pageCounter}`);
  }

  // Write data to a JSON file
  fs.writeFile("data.json", JSON.stringify(data), (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Data written to file success.");
  });

  await browser.close();
})();
