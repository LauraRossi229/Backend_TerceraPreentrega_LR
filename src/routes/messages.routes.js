
import { Router } from "express";
import { getchat, postMessage } from "../controller/messages.controller.js";

const messageRouter = Router()

// Ruta para la vista del chat
messageRouter.get('/chat', getchat)

// Ruta para enviar un nuevo mensaje
messageRouter.post('/chat', postMessage)

export { messageRouter as messageRoutes };

