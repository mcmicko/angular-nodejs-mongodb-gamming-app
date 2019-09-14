const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// GET ALL GAMES
router.get('/', async (req, res) => {
  try {
    const headers = {
      'user-key': '58f1bec8f2a0c831cf1563b350d282b3'
    };

    const response = await fetch(
      `https://api-v3.igdb.com/games/?fields=name,platforms.name,genres.name,url,cover.url,rating,first_release_date,storyline&order=rating:asc&limit=50&filter[first_release_date][gt]=1546300800
      &expand=game`,
      {
        headers
      }
    );

    const data = await response.json();

    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error error' });
  }
});

// FIND SINGLE GAME
router.get('/:game_id', async (req, res) => {
  try {
    const singleGame = req.params.game_id;
    const headers = {
      'user-key': '58f1bec8f2a0c831cf1563b350d282b3'
    };
    const response = await fetch(
      `https://api-v3.igdb.com/games/?fields=*&filter[id][eq]=${singleGame}`,
      { headers }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'server errorr' });
  }
});

// SEARCH GAME
router.get('/search/:game_name', async (req, res) => {
  try {
    const searchName = req.params.game_name;
    const headers = {
      'user-key': '58f1bec8f2a0c831cf1563b350d282b3'
    };
    const response = await fetch(
      `https://api-v3.igdb.com/games/?search=${searchName}&fields=name,platforms.name,genres.name,cover.url,rating,first_release_date,storyline,url`,
      { headers }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'server errror' });
  }
});

module.exports = router;
