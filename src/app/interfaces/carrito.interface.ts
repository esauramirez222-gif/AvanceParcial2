import { Producto } from './producto.interface';

// Lo que se guarda en el carrito: solo la referencia y la cantidad
export interface ItemCarrito {
  productoId: string;
  cantidad: number;
}

// Lo que se muestra en pantalla: el producto completo ya resuelto
export interface DetalleCarrito {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}
