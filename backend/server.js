const request = require('request');
const cheerio = require('cheerio');

const url = 'https://www.thaiwater.net/water/wl';

request(url, (error, response, html) => {
    if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);

        const talent = $('div[class="MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-4"] > div[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-md-7 MuiGrid-grid-lg-8"] > div[class="MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-2"] > div[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-sm-12 MuiGrid-grid-md-12 MuiGrid-grid-lg-12"] > div[class="MuiPaper-root MuiTableContainer-root MuiPaper-elevation1 MuiPaper-rounded"] > table[class="MuiTable-root jss1054 table-custom-sticky"] > tbody[class="MuiTableBody-root"] > tr[class="MuiTableRow-root jss2022"]').map((i, element) => {
            // const nameJp = $(element).find('th[] > button > span[class="MuiButton-label"]').text().trim();
            const test = $(element).find('td[class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"]').text().trim();

            return {
                // nameJp: nameJp,
                test: test,
            }

        }).get()

        // const talentJson = JSON.stringify(talent);

        console.log(talent);
    }
});

