const express = require('express');
const usersService = require('../services/usersService')

async function eliminarUsuario(req, res) {
  try {
    const datosPaciente = req.body;
    const resultado = await usersService.eliminarUsuario(datosPaciente)
    if (resultado.error) {
      return res.status(resultado.status).json(resultado.error)
    }
    return res.status(200).json('Usuario eliminado correctamente.')
  } catch (error) {
    console.error(error);
    return res.status(500).json('Error interno del servidor')
  }
}

module.exports = {
  eliminarUsuario,
}