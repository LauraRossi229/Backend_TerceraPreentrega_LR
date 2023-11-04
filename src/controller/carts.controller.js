import { cartModel } from "../models/carts.models.js";
import mongoose from 'mongoose';

// GET api/carts/:cid - Obtener productos en un carrito


export const getCart = async (req, res) => {
  try {
    const { cid } = req.params;

    // Verificar si 'cid' es un ObjectId válido
    if (mongoose.Types.ObjectId.isValid(cid)) {
      const cart = await cartModel.findById(cid).populate('products.id_prod');
      
      if (!cart) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
      }
      // Renderiza la vista 'carts' y pasa los datos del carrito
      res.render('cartspecific', { cart });
    } else {
      // Manejar el caso en el que 'cid' no es un ObjectId válido
      res.status(400).json({ message: 'ID de carrito no válido' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


  // DELETE api/carts/:cid/products/:pid - Eliminar producto del carrito

export const deleteProductCart = async (req, res) => { // Cambiado a cartRoute
    try {
      const { cid, pid } = req.params;
      const cart = await cartModel.findOneAndUpdate(
        { _id: cid },
        { $pull: { products: { id_prod: pid } } },
        { new: true }
      ).populate('products.id_prod');
      
      if (!cart) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
      }
      
      res.json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

 // PUT api/carts/:cid - Actualizar carrito con arreglo de productos
 export const putCart = async (req, res) => { 
  try {
    const { cid, } = req.body;
    const { products } = req.body;
    const cart = await cartModel.findOneAndUpdate(
      { _id: cid },
      { products },
      { new: true }
    ).populate('products.id_prod');
    
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

 // PUT api/carts/:cid/products/:pid - Actualizar cantidad de un producto en el carrito
export const putCartQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    // Obtener el carrito asociado al usuario desde req.user
    const userCart = req.user.cart;
    console.log('Valor de userCart:', userCart);

    // Verificar que el carrito sea válido
    if (!userCart) {
      return res.status(404).json({ message: 'Carrito no encontrado o producto no encontrado en el carrito' });
    }

    // Buscar el carrito por su ID (cartID) y verificar si el producto existe en el carrito
    const cart = userCart.find((cartItem) => String(cartItem.id_prod) === pid);

    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado o producto no encontrado en el carrito' });
    }

    // Actualizar la cantidad del producto en el carrito
    cart.quantity = quantity;

    // Renderizar la vista carts.handlebars para mostrar el carrito
    res.render('cartcartSpecific', { cart: userCart, productID: pid });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

  // DELETE api/carts/:cid - Eliminar todos los productos del carrito

  export const deleteAllCart = async (req, res) => { // Cambiado a cartRoute
    try {
      const { cid } = req.params;
      const cart = await cartModel.findOneAndDelete({ _id: cid });
      
      if (!cart) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
      }
      
      res.json({ message: 'Carrito eliminado exitosamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
  


const finalizePurchase = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate('items.product'); // Supongamos que tu carrito tiene una propiedad 'items' con detalles del producto.

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    for (const item of cart.items) {
      const product = item.product;
      const requestedQuantity = item.quantity;

      if (product.stock >= requestedQuantity) {
        // Si hay suficiente stock, resta la cantidad del producto y continúa
        product.stock -= requestedQuantity;
        await product.save();
      } else {
        // Si no hay suficiente stock, no agrega el producto al proceso de compra
        return res.status(400).json({ error: 'Stock insuficiente para uno o más productos' });
      }
    }

    // Realiza otras acciones necesarias para finalizar la compra, como generar una factura, guardar detalles de la compra, etc.

    // Limpia el carrito o marca como comprado
    cart.items = [];
    await cart.save();

    res.status(200).json({ message: 'Compra exitosa' });
  } catch (error) {
    res.status(500).json({ error: 'Error al finalizar la compra' });
  }
};

export default {
  finalizePurchase,
};
