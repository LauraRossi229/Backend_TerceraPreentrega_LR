import express from 'express';
import ticketController from '../controllers/ticketController';

const router = express.Router();

// Ruta para crear un nuevo ticket
router.post('/tickets', ticketController.createTicket);

// Otros endpoints para gestionar los tickets

export default ticketrouter;
