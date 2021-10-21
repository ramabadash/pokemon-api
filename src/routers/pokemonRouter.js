const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require("path");


const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();

//localhost:3000/pokemon 

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
        const collection = fs.readdirSync(usreFolderPath);
        if (collection.includes(`${id}.json`)){ //Pokemon already caught
            res.status(403).json({ message: 'Pokemon already caught'});
        }
    } else {
        fs.mkdirSync(`${usreFolderPath}`); //Create new folder for the user
    }
    fs.writeFileSync(`${usreFolderPath}\\${id}.json`, `${JSON.stringify(req.body.pokemon)}`); //Add pokemon file with pokemon obj
    res.send(true);
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


