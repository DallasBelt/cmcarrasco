const bcrypt = require('bcryptjs')

class EncryptPassword {

  constructor() {
    this.saltRounds = 10
  }

  async encrypt(password) {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return await bcrypt.hash(password, salt)
  }

  async compare(rawPassword, hashedPassword) {
    return await bcrypt.compare(rawPassword, hashedPassword)
  }
}

module.exports = {
  EncryptPassword
}