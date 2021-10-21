const express = require('express');
const router = express.Router();

const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();

//localhost:3000/pokemon 

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