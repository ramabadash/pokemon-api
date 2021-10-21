const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require("path");


const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();

//localhost:3000/pokemon 

//Get pokemon collection
router.get("/", (req, res)=> {
    const userName = req.headers.username; //get user name
    const usreFolderPath = path.resolve(`.\\users`, userName); //path to th user file
    if(!fs.existsSync(usreFolderPath)) { //is user exsits
        res.status(403).json({ message: 'UserName is not exsists'}); //user isn't exsits
    }
    const pokemonCollection = [];
    const collection = fs.readdirSync(usreFolderPath); //collection files from user folder
    for (const pokemonFile of collection) {
        const currentFilePath = path.resolve(usreFolderPath, pokemonFile); 
        const fileContent = fs.readFileSync(currentFilePath).toString();
        pokemonCollection.push(fileContent); //Array with pokemon collection
    }
    res.send(pokemonCollection);
})


//Pokemon information
router.get("/get/:id", (req, res)=> {
    const id = req.params.id;
    console.log("id "+ id)
    P.getPokemonByName(id) 
    .then((response) => {
        const pokeObj = createPokeObj(response);
        res.send(pokeObj);
    })
    .catch((error)=> {
      res.send(`There was an ERROR: ${error}`)
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
            res.status(403).json({ message: 'Pokemon already caught'});
        }
    } else {
        fs.mkdirSync(`${usreFolderPath}`); //Create new folder for the user
    }
    fs.writeFileSync(`${usreFolderPath}\\${id}.json`, `${JSON.stringify(req.body.pokemon)}`); //Add pokemon file with pokemon obj
    res.send(true);
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
            res.send(true);
        }
        res.status(403).json({ message: 'Pokemon is not in your collection'}); //the user exists the pokemon doesn't
    }
    res.status(403).json({ message: 'UserName is not exsists'});//No user No pokemon 
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


