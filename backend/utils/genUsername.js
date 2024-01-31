const genUsername = (primerNombre, cedula) => primerNombre + cedula.substring(6)

module.exports = {
  genUsername
}