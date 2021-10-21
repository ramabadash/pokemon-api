const express = require('express');
const app = express();
const port = 3000;
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();

const pokemonRouter = require("./routers/pokemonRouter");
app.use(express.static('public'));
app.use(express.json()) // parses requests as json

app.use('/pokemon', pokemonRouter);

app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
// app.use(express.json()) // parses requests as json

// app.get('/get', function(request, response) {
//   response.json({ requested: request.query})
// })

// app.post('/post', function(request, response) {
//   response.json({ requested: request.body})
// })

// app.put('/put', function(request, response) {
//   response.json({ requested: request.body})
// })

// app.delete('/delete', function(request, response) {
//   response.json({ requested: request.body})
// })