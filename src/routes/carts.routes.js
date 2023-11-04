import express from 'express';
import { getCart, deleteProductCart, putCart, putCartQuantity, deleteAllCart} from '../controller/carts.controller.js';

const cartRoute = express.Router(); // Cambiado a cartRoute

// GET api/carts/:cid - Obtener productos en un carrito
cartRoute.get('/:cid', getCart)

// DELETE api/carts/:cid/products/:pid - Eliminar producto del carrito
cartRoute.delete('/:cid/products/:pid', deleteProductCart)

// PUT api/carts/:cid - Actualizar carrito con arreglo de productos
cartRoute.put('/:cid', putCart)

// PUT api/carts/:cid/products/:pid - Actualizar cantidad de un producto en el carrito
cartRoute.put('/:cid/products/:pid', putCartQuantity)
  

// DELETE api/carts/:cid - Eliminar todos los productos del carrito
cartRoute.delete('/:cid', deleteAllCart)

// Ruta para finalizar el proceso de compra
router.post('/:cid/purchase', cartController.finalizePurchase);
  
export default cartRoute; 
