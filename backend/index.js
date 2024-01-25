const express = require('express')
const app = express()
const port = 3000
const loginRoute = require('./routes/loginRoute');
const patientsRoute = require('./routes/patientsRoute');
const citaRoute = require('./routes/citaRoute');
const medicoRoute = require('./routes/medicoRoute');
const usuarioRoute = require('./routes/usuarioRoute');
const historia_clinicaRoute = require('./routes/historia_clinicaRoute');
const cors = require('cors');
const { EncryptPassword } = require('./utils/encryptPassword');
const mail = require('./utils/mailer');
const citaService = require('./services/citaService');
const cron = require('node-cron');

// middelwares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes 
app.use('/login', loginRoute);
app.use('/patients', patientsRoute);
app.use('/appointment', citaRoute );
app.use('/medic', medicoRoute );
app.use('/historia_clinica', historia_clinicaRoute );
app.use('/usuario', usuarioRoute );

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

//cronometro para envío de notificaciones a correo
cron.schedule('30 * * * *', () => {
  citaService.correoDeCitasPendientes();
});