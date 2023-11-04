import express from 'express';
import {postCartCID, getCart, deleteProductCart, postCart, deleteAllCart} from '../controller/carts.controller.js';

const cartRoute = express.Router(); // Cambiado a cartRoute

// GET api/carts/:cid - Obtener productos en un carrito
cartRoute.get('/:cid', getCart)

// DELETE api/carts/:cid/products/:pid - Eliminar producto del carrito
cartRoute.delete('/:cid/products/:pid', deleteProductCart)

// POST api/carts/:cid - Actualizar carrito con arreglo de productos
cartRoute.post('/:cid', postCart)

// POST api/carts/:cid/products/:pid - Actualizar cantidad de un producto en el carrito
cartRoute.post('/:cid/products/:pid', postCartCID)
  

// DELETE api/carts/:cid - Eliminar todos los productos del carrito
cartRoute.delete('/:cid', deleteAllCart)

// Ruta para finalizar el proceso de compra
//router.post('/:cid/purchase', cartController.finalizePurchase);
  
export default cartRoute; 
