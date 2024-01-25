const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: 'cmcarrasco2023@gmail.com ',
    pass: 'dago taul qphg sklm'
  }
});

// async..await is not allowed in global scope, must use a wrapper
async function enviarMail() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: 'cmcarrasco2023@gmail.com', // sender address
    to: "cmcarrasco2023@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    html: "<b>Hello world de pruebita</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
}

async function enviarMailPaciente(datos) {
  try {
    const info = await transporter.sendMail({
      from: 'cmcarrasco2023@gmail.com',
      to: datos.correo,
      subject: "Registro exitoso en el sistema del Centro Médico Carrasco.",
      html: ` <h3>El equipo de Centro Médico Carrasco le da la bienvenida.</h3>
    <p>
    Estimado ${datos.primer_nombre} ${datos.primer_apellido}  ${datos.segundo_apellido} le recordamos que sus credenciales de acceso son:
    <br>
    Usuario: <b> su correo electrónico.</b>
    <br>
    Contraseña: <b>su número de cédula.</b>
    </p>
    <p> 
    Cualquier duda o inconveniente por favor comunicarse al correo:
    <br>
    <b>cmcarrasco2023@gmail.com</b>
    </p>`,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
}

async function enviarMailMedico(datos) {
  try {
    const info = await transporter.sendMail({
      from: 'cmcarrasco2023@gmail.com',
      to: datos.correo,
      subject: "Registro exitoso en el sistema del Centro Médico Carrasco.",
      html: ` <h3>El equipo de Centro Médico Carrasco le da la bienvenida.</h3>
      <p>
      Estimado ${datos.primer_nombre} ${datos.primer_apellido}  ${datos.segundo_apellido} le recordamos que sus credenciales de acceso son:
      <br>
      Usuario: <b> su correo electrónico.</b>
      <br>
      Contraseña: <b>su número de cédula.</b>
      </p>
      <p> 
      Cualquier duda o inconveniente por favor comunicarse al correo:
      <br>
      <b>cmcarrasco2023@gmail.com</b>
      </p>`,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
}

async function enviarMailPendientes(datos) {

  for (const fila of datos.rows) {
    try {
      const fechaInicio = new Date(fila.fecha_inicio); // Convierte la fecha a un objeto Date

      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
      };
      const fechaFormateada = fechaInicio.toLocaleString('es-ES', options);

      const info = await transporter.sendMail({
        from: 'cmcarrasco2023@gmail.com',
        to: fila.correo,
        subject: "Tiene una cita pendiente.",
        html: `<b>Tiene una cita pendiente en el Centro Médico Carrasco</b>
              <p>Saludos estimado ${fila.p_primer_nombre} ${fila.p_primer_apellido}. 
              Se le informa que tiene una cita pendiente, con el/la doctor(a) ${fila.m_primer_nombre} ${fila.m_primer_apellido}
              el día ${fechaFormateada}</p>
        `,
      });

      console.log("Message sent: %s", info.messageId);
    } catch (error) {
      console.error('Error al enviar el correo:', error);
    }
  }
}


/* async function enviarMailPendientes(datos) {
  console.log(datos.rows[0].correo);
  //console.log("EL CORREO ES " +datos.correo);
  // send mail with defined transport object
  datos.rows.forEach((fila) => {
    
  })
  const info = await transporter.sendMail({
    from: 'cmcarrasco2023@gmail.com', // sender address
    to: datos.rows[0].correo, // list of receivers
    subject: "Tiene una cita pendiente.", // Subject line
    html: `<b>Tiene una cita pendiente en el centro médico Carrasco</b>
          <p>Saludos estimado ${datos.rows[0].p_primer_nombre} ${datos.rows[0].p_primer_apellido}. </p>
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
} */

//enviarMail().catch(console.error);

module.exports = {
  enviarMail,
  enviarMailPendientes,
  enviarMailPaciente,
  enviarMailMedico
};