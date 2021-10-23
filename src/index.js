const express = require('express');
const app = express();
const port = 3000;

const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();
const cors = require("cors");

app.use(cors({
    origin: "*"
}));

app.use(express.json()) // parses requests as json

const pokemonRouter = require("./routers/pokemonRouter");
const userRouter = require("./routers/userRouter");
const {errorHandlerMiddleware} = require("./middleware/errorHandler")
const {userHandler} = require("./middleware/userHandler");


app.use(userHandler);

app.use('/pokemon', pokemonRouter);
app.use('/info', userRouter);

app.use(errorHandlerMiddleware);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
