const  loginService  = require('../services/loginService');

async function login(req, res) {
  try {
    const result = await loginService.login(req.body);
    if (result.error) {
      return res.status(result.status).json(result.error);
    }

    return res.status(200).json(result.userDTO);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ statusCodeValue: 500, error: error.message });
  }
}

module.exports = {
  login
};