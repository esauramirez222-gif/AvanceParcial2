export type EstadoPedido = 'pendiente' | 'enviado' | 'entregado';

export interface ProductoPedido {
  producto: string; // _id del producto (referencia)
  cantidad: number;
  subtotal: number;
}

export interface Pedido {
  _id: string;
  usuario: string; // _id del usuario (referencia)
  productos: ProductoPedido[];
  subtotal: number;
  costoEnvio: number;
  total: number;
  estado: EstadoPedido;
  fecha: Date;
}
