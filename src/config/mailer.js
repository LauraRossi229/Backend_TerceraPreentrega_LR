import 'dotenv/config';
import nodemailer from 'nodemailer';
import express from 'express';

const app = express();
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'pdfcursos71@gmail.com',
    pass: "nsgztsjkmvcntobl", // Contraseña corregida

    authMethod: 'LOGIN'
  }
});

const sendMail = async (req, res) => {
  const enviado = await transporter.sendMail({
    from: 'Cursos en PDF pdfcursos71@gmail.com',
    to: 'rossil229@gmail.com',
    subject: 'Hola, buenos días',
    html: `
      <div>
        <h1>El detalle de la compra realizada es la siguiente: </h1>
      </div>
    `
  });
  res.send('Correo enviado');
  console.log('enviado'); // Corregido "consolg" a "console.log"
};

export { sendMail };
