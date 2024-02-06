const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const verifyToken = require('./middlewares/verifyToken');
require('dotenv').config();
const app = express();
const port = 3000;

const authRoute = require('./routes/authRoute');
const sessionRoute = require('./routes/sessionRoute');
const appointmentsRoute = require('./routes/appointmentsRoute');
const medicsRoute = require('./routes/medicsRoute');
const patientsRoute = require('./routes/patientsRoute');
const recordsRoute = require('./routes/recordsRoute');
const usersRoute = require('./routes/usersRoute');

const corsOptions = {
  origin: 'http://localhost:3001',
  credentials: true, // Allow cookies
};

// middelwares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Public routes 
app.use('/auth', authRoute);

app.use(verifyToken);

//Protected routes 
app.use('/session', sessionRoute);
app.use('/appointments', appointmentsRoute);
app.use('/medics', medicsRoute);
app.use('/patients', patientsRoute);
app.use('/records', recordsRoute);
app.use('/users', usersRoute);

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});