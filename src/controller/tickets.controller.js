import Ticket from '../models/ticketModel';

// Crear un nuevo ticket
const createTicket = async (req, res) => {
  try {
    const { code, amount, purchaser } = req.body;
    const ticket = new Ticket({ code, amount, purchaser });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el ticket' });
  }
};

// Otros métodos para gestionar los tickets

//export default {
  //createTicket,
  // Otros métodos
//};


import Ticket from '../models/ticketModel';

const createTicket2 = async (req, res) => {
  try {
    const { code, amount, purchaser } = req.body;
    const ticket = new Ticket({ code, amount, purchaser });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el ticket' });
  }
};

// Otros métodos para gestionar los tickets
const otherMethod1 = async (req, res) => {
  // Implementa tu lógica para otro método aquí
};

const otherMethod2 = async (req, res) => {
  // Implementa tu lógica para otro método aquí
};


// ticketService.js

import Ticket from '../models/ticketModel';

const generateTicket = async (purchaseData) => {
  try {
    // Crea un nuevo ticket con los datos de la compra
    const ticket = new Ticket({
      code: generateUniqueCode(), // Genera un código único para el ticket
      purchase_datetime: new Date(),
      amount: purchaseData.totalAmount,
      purchaser: purchaseData.userEmail,
    });

    await ticket.save();
    return ticket;
  } catch (error) {
    throw new Error('Error al generar el ticket');
  }
};

const generateUniqueCode = () => {
  // Lógica para generar un código único para el ticket
};

export default {
  generateTicket,
};
