const pgp = require('pg-promise')()
const db = pgp('postgres://cmcarrasco:cmcarrasco@localhost:5432/cmcarrasco');

db.connect()
  .then(obj => {
    console.info('Successfully connected to the database :)')
    obj.done(); // Se libera la conexión
  })
  .catch(error => {
    console.error('Error while connecting to the database :(', error)
  });

module.exports = db;