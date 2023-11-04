import { Router } from "express";
import { getProducts, getProductById, postProduct, putProductById, deleteProductById} from "../controller/products.controller.js";
import { passportError, authorization } from "../utils/messagesError.js";


const productRouter = Router();


// GET para obtener productos con paginación, límite, ordenamiento y búsqueda
productRouter.get('/', getProducts)

// Get para obtener el detalle de 1 producto.
productRouter.get('/:id', getProductById)

// POST para agregar un producto

productRouter.post('/', passportError('jwt'), authorization('Admin'), postProduct)

// PUT para actualizar un producto
productRouter.put('/:id', passportError('jwt'), authorization('Admin'), putProductById)

// DELETE para eliminar un producto
productRouter.delete('/:id', passportError('jwt'), authorization('Admin'), deleteProductById)

export default productRouter;
