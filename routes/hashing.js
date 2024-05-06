const bcrypt = require("bcryptjs");


const hashUtil = {
  getHashed(password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  },


  compareHash(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
  }
};
module.exports = hashUtil;
