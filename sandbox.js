const bcrypt = require('bcryptjs');


const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync("passwordJuan123", salt);

console.log(hash)

const password = "passwordJuan12" // < daept dari req.body

console.log(bcrypt.compareSync(password, hash))