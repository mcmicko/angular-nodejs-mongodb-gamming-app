const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// FIND ALL PLATFORMS
router.get('/platforms', async (req, res) => {
  try {
    const headers = { 'user-key': '58f1bec8f2a0c831cf1563b350d282b3' };
    const response = await fetch(
      'https://api-v3.igdb.com/platforms/?fields=name',
      { headers }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {}
});

// FIND ALL GENRES
router.get('/genres', async (req, res) => {
  try {
    const headers = { 'user-key': '58f1bec8f2a0c831cf1563b350d282b3' };
    const response = await fetch(
      'https://api-v3.igdb.com/genres/?fields=name',
      { headers }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {}
});

// FILTERING PLATFROMS AND GENRES
router.get('/filter/:platform?/:genre?/:rating?', async (req, res) => {
  try {
    let platforms;
    if (req.params.genre) {
      platforms = `filter[platforms][eq]=${req.params.platform}`;
    }

    let genres;
    if (req.params.genre) {
      genres = `filter[genres][eq]=${req.params.genre}`;
    }
    let rating;
    if (req.params.rating === null) {
      rating = `filter[rating][eq]=`;
    } else if (req.params.rating) {
      rating = `filter[rating][gt]=${req.params.rating}`;
    }

    const headers = {
      'user-key': '58f1bec8f2a0c831cf1563b350d282b3'
    };
    const response = await fetch(
      `https://api-v3.igdb.com/games/?fields=name,platforms.name,genres.name,cover.url,rating,first_release_date,storyline,url&limit=50
         &${platforms}&${genres}&${rating}`,
      { headers }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
