const path = require("path")
const fs = require("fs");

function userHandler (req, res, next) {
    const userName = req.headers.username;
    if(!userName) {
        throw {"status": 401, "messege": "pokemon requests missing the username header"};
    }
    const usreFolderPath = path.resolve(`.\\users`, userName);
    if(!fs.existsSync(usreFolderPath)) {
        fs.mkdirSync(`${usreFolderPath}`); //Create new folder for the user
    }
    next(); 
}
module.exports = {userHandler}