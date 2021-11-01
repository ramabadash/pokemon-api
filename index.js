const express = require('express');
const app = express();
const port = 3000;

const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();
const cors = require("cors");
const path = require("path");

app.use(cors({
    origin: "*"
}));

app.use(express.json()) // parses requests as json

const pokemonRouter = require("./src/routers/pokemonRouter");
const userRouter = require("./src/routers/userRouter");
const {errorHandlerMiddleware} = require("./src/middleware/errorHandler")
const {userHandler} = require("./src/middleware/userHandler");


app.use(userHandler);

app.use('/pokemon', pokemonRouter);
app.use('/info', userRouter);

app.use(errorHandlerMiddleware);

app.use('/', express.static(path.resolve('../front/dist'))); // serve main path as static dir
app.get('/', function(req, res) { // serve main path as static file
  res.sendFile(path.resolve('../front/dist/index.html'))
});

app.listen(process.env.PORT || port, () => {
    console.log(`Example app listening ....`)
})
