const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://ratchakitcha.soc.go.th/#list-tab'; 

axios.get(url)
  .then(response => {
    const $ = cheerio.load(response.data);
    const blogPosts = [];

    $('.post-thumbnail-content').each((index, element) => {
      const title = $(element).find('a.m-b-10').text();
      const postUrl = $(element).find('a').attr('href');
      const date = $(element).find('.post-date').text();

      // delete \n in front of title and leave the rest
      const titleTrim = title.replace(/\n/g, '').trim();

      blogPosts.push({
        title: titleTrim,
        url: postUrl,
        date: date
      });
    });

    const jsonData = JSON.stringify(blogPosts, null, 2);


    fs.writeFile('annocementList.json', jsonData, err => {
      if (err) {
        console.error('Error writing JSON file:', err);
      } else {
        console.log('Data has been scraped and saved to annocementList.json');
      }
    });
  })
  .catch(error => {
    console.error('Error fetching or parsing data:', error);
  });
