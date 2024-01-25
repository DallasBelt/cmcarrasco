const express = require('express')
const app = express()
const port = 3000
const loginRoute = require('./routes/loginRoute')
const appointmentsRoute = require('./routes/appointmentsRoute')
const medicsRoute = require('./routes/medicsRoute')
const patientsRoute = require('./routes/patientsRoute')
const recordsRoute = require('./routes/recordsRoute')
const usersRoute = require('./routes/usersRoute')
const cors = require('cors')
const { EncryptPassword } = require('./utils/encryptPassword')
const mail = require('./utils/mailer')
const citaService = require('./services/appointmentsService')
const cron = require('node-cron')

// middelwares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

//routes 
app.use('/login', loginRoute)
app.use('/appointments', appointmentsRoute)
app.use('/medics', medicsRoute )
app.use('/patients', patientsRoute)
app.use('/records', recordsRoute)
app.use('/users', usersRoute)

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

cron.schedule('30 * * * *', () => {
  citaService.correoDeCitasPendientes()
})