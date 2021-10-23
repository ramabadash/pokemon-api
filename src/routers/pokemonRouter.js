const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require("path");


const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();

//localhost:3000/pokemon/ 

//Get pokemon collection
router.get("/", (req, res)=> {
    const userName = req.headers.username; //get user name
    const usreFolderPath = path.resolve(`.\\users`, userName); //path to th user file
    const pokemonCollection = [];
    const collection = fs.readdirSync(usreFolderPath); //collection files from user folder
    for (const pokemonFile of collection) {
        const currentFilePath = path.resolve(usreFolderPath, pokemonFile); 
        const fileContent = fs.readFileSync(currentFilePath).toString();
        pokemonCollection.push(fileContent); //Array with pokemon collection
    }
    return res.send(pokemonCollection);
})


//Pokemon information
router.get("/get/:id", (req, res, next)=> {
        const id = req.params.id;
        P.getPokemonByName(id)
        .then((response) => {
            const pokeObj = createPokeObj(response);
            return res.send(pokeObj);
        })
        .catch((error)=> {
            next ({"status": 404, "messege": "pokemon not found"});
        });
})

//Pokemon information by quary
router.get("/query",  (req, res, next)=> {
    const pokeName = req.body.query;
    console.log(req.body);
    P.getPokemonByName(pokeName)
    .then((response) => {
        const pokeObj = createPokeObj(response);
        return res.send(pokeObj);
    })
    .catch((error)=> {
        next ({"status": 404, "messege": "pokemon not found"});
    });
})
//get names list by type
router.get("/type/:type", (req, res, next) => {
    const type = req.params.type;
    P.getTypeByName(type)
    .then((response) => {
      const namesArray = [];
      for(const poke of response.pokemon) {
        namesArray.push(poke.pokemon.name);
      }
      res.send(namesArray);
    })
    .catch((error) => {
      next({"status": 404, "messege": "names list not found"})
    });
})
       
//Pokemon catch
router.put("/catch/:id", (req, res)=> {
    const id = req.params.id;
    const userName = req.headers.username;
    const usreFolderPath = path.resolve(`.\\users`, userName);
    if(fs.existsSync(usreFolderPath)) {
        const collection = fs.readdirSync(usreFolderPath); //all pokemon collection files
        if (collection.includes(`${id}.json`)){ //Pokemon already caught
            throw {"status": 403, "messege": "Pokemon already caught"};
        }
    } 
    fs.writeFileSync(`${usreFolderPath}\\${id}.json`, `${JSON.stringify(req.body.pokemon)}`); //Add pokemon file with pokemon obj
    return res.send(true);
})

//Delete pokemon from collection
router.delete("/release/:id", (req, res)=> {
    const id = req.params.id;
    const userName = req.headers.username;
    const usreFolderPath = path.resolve(`.\\users`, userName);
    if(fs.existsSync(usreFolderPath)) {
        const collection = fs.readdirSync(usreFolderPath);
        if (collection.includes(`${id}.json`)){
            fs.unlinkSync(`${usreFolderPath}\\${id}.json`); //Delete from collection
            return res.send(true);
        }
        throw {"status": 403, "messege": "Pokemon is not in your collection"};//the user exists the pokemon doesn't
    }
})

//create Poke Object from response
function createPokeObj (pokeObj) {
    const typesArray = [];
    for(type of pokeObj.types) {
        typesArray.push(type.type.name);
    }
    const abilitiesArray = [];
    for(ability of pokeObj.abilities) {
        abilitiesArray.push(ability.ability.name);
    }
    const pokedexObj = {
        "id": pokeObj.id,
        "name": pokeObj.forms[0].name, 
        "height": pokeObj.height,
        "weight": pokeObj.weight,
        "types": typesArray,
        "front_pic": pokeObj.sprites.front_default,
        "back_pic": pokeObj.sprites.back_default,
        "abilities": abilitiesArray
    } 
    return pokedexObj;
}
module.exports = router;


