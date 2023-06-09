const PORT = 8000
const axios = require("axios").default
const express = require("express")
const cors = require("cors")
require('dotenv').config()

const wordle = express()

wordle.use(cors())


wordle.get('/word', (req, res) => {
  const options = {
    method: 'GET',
    url: 'https://random-words5.p.rapidapi.com/getMultipleRandom',
    params: { count: '5', wordLength: '5' },
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': 'random-words5.p.rapidapi.com'
    }
  }

  axios.request(options).then((response) => {
    console.log(response.data)
    res.json(response.data[0])
  }).catch((error) => {
    console.error(error);
  })

})


wordle.get('/check', (req, res) => {
  const word = req.query.word

  const options = {
    method: 'GET',
    url: 'https://twinword-word-graph-dictionary.p.rapidapi.com/association/',
    params: { entry: word },
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': 'twinword-word-graph-dictionary.p.rapidapi.com'
    }
  }
  axios.request(options).then((response) => {
    console.log(response.data)
    res.json(response.data.result_msg)
  }).catch((error) => {
    console.error(error)
  })
})




wordle.listen(PORT, () => console.log('Server running on PORT ' + PORT));





