const request = require('request');
const fs = require('fs');
const PromiseSeries = require('promise-series');

const list = fs.readFileSync("./list").toString();
const series = new PromiseSeries();
const DELAY_BETWEEN_REQUESTS = 500;

list.split('\n').map((challengeUrl, i) => {
  series.add(() => (new Promise((resolve, reject) => {
    console.log('fetching... ', challengeUrl);
    request(challengeUrl, (error, response, body) => {
      if (error) {
        reject(error);
      }

      setTimeout(() => {
        console.log('done! ', challengeUrl);
        const jsonBody = JSON.parse(body);

        fs.writeFileSync((i + 1) + ".before", jsonBody.in.data);
        fs.writeFileSync((i + 1) + ".after", jsonBody.out.data);

        resolve();
      }, DELAY_BETWEEN_REQUESTS);
    });
  })));
});

series.run();
