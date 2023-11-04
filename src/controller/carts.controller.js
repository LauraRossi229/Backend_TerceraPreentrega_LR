import { cartModel } from '../models/carts.models.js';
import { productModel } from '../models/products.models.js';
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



  export const postCart = async (req, res) => {
    try {
      const { products } = req.body;
  
      if (!products || !Array.isArray(products) || products.length === 0) {
        console.error('Productos no válidos');
        return res.status(400).json({ respuesta: 'Error en crear Carrito', mensaje: 'Productos no válidos' });
      }
  
      const productIds = products.map(product => product.id_prod);
  
      // Verificar si los productos existen en la base de datos
      const existingProducts = await productModel.find({ _id: { $in: productIds } });
  
      if (existingProducts.length !== products.length) {
        console.error('Algunos productos no fueron encontrados');
        return res.status(404).json({ respuesta: 'Error en crear Carrito', mensaje: 'Algunos productos no fueron encontrados' });
      }
  
      // Crear un nuevo carrito con los productos proporcionados
      const cart = await cartModel.create({ products });
  
      console.log('Carrito creado:', cart);
      res.status(200).json({ respuesta: 'OK', mensaje: cart });
    } catch (error) {
      console.error('Error al crear el carrito:', error);
      res.status(400).json({ respuesta: 'Error en crear Carrito', mensaje: error.message });
    }
  };
  



export const postCartCID = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    // Obtener el carrito por ID
    const cart = await cartModel.findById(cid);

    if (!cart) {
      // Si el carrito no existe, devuelve un error
      return res.status(404).json({ respuesta: 'Error en agregar producto Carrito', mensaje: 'Carrito no encontrado' });
    }

    // Buscar el producto por ID
    const prod = await productModel.findById(pid);

    if (!prod) {
      // Si el producto no existe, devuelve un error
      return res.status(404).json({ respuesta: 'Error en agregar producto Carrito', mensaje: 'Producto no encontrado' });
    }

    // Buscar el índice del producto en el carrito
    const indice = cart.products.findIndex(item => item.id_prod.toString() === pid);

    if (indice !== -1) {
      // Si el producto ya está en el carrito, actualiza la cantidad
      cart.products[indice].quantity = quantity;
    } else {
      // Si el producto no está en el carrito, agrégalo
      cart.products.push({ id_prod: pid, quantity: quantity });
    }

    // Actualizar el carrito en la base de datos
    const respuesta = await cartModel.findByIdAndUpdate(cid, cart, { new: true });

    // Enviar una respuesta exitosa
    //res.status(200).json({ respuesta: 'OK', mensaje: respuesta });

    //renderizo el carrito.
    res.render('cartspecific', { cart });
  } catch (error) {
    // Capturar y manejar errores
    console.error('Error en el controlador:', error);
    res.status(500).json({ respuesta: 'Error en agregar producto Carrito', mensaje: error.message });
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
