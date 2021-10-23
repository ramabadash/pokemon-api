const express = require('express');
const router = express.Router();

//localhost:3000/info

//Return user name
router.post("/", (req, res)=> {
    const userName = req.headers.username; //get user name
    res.json({"username": userName});
})

module.exports = router;