const bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
const fs = require('fs');
const path = require('path');
fs.writeFileSync(path.join(__dirname, 'salt.log'), salt);