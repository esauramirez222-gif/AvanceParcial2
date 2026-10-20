import { Injectable, signal } from '@angular/core';
import { DetalleCarrito } from '../interfaces/carrito.interface';
import { EstadoPedido, Pedido } from '../interfaces/pedido.interface';
import { ProductosService } from './productos.service';

@Injectable({ providedIn: 'root' })
export class PedidosService {
  public readonly estados: EstadoPedido[] = ['pendiente', 'enviado', 'entregado'];

  private _pedidos = signal<Pedido[]>([
    {
      _id: 'ped-1001', usuario: 'u-luis', estado: 'entregado', fecha: new Date('2026-09-05T11:20:00'),
      productos: [
        { producto: 'p01', cantidad: 1, subtotal: 1299 },
        { producto: 'p03', cantidad: 1, subtotal: 899 },
      ],
      subtotal: 2198, costoEnvio: 0, total: 2198,
    },
    {
      _id: 'ped-1002', usuario: 'u-ana', estado: 'entregado', fecha: new Date('2026-09-12T17:45:00'),
      productos: [
        { producto: 'p01', cantidad: 1, subtotal: 1299 },
        { producto: 'p08', cantidad: 1, subtotal: 459 },
      ],
      subtotal: 1758, costoEnvio: 0, total: 1758,
    },
    {
      _id: 'ped-1003', usuario: 'u-luis', estado: 'enviado', fecha: new Date('2026-10-01T09:10:00'),
      productos: [{ producto: 'p09', cantidad: 1, subtotal: 1499 }],
      subtotal: 1499, costoEnvio: 0, total: 1499,
    },
    {
      _id: 'ped-1004', usuario: 'u-ana', estado: 'pendiente', fecha: new Date('2026-10-15T20:05:00'),
      productos: [
        { producto: 'p04', cantidad: 2, subtotal: 398 },
        { producto: 'p11', cantidad: 1, subtotal: 179 },
      ],
      subtotal: 577, costoEnvio: 99, total: 676,
    },
  ]);

  constructor(private productosService: ProductosService) {}

  // Del más reciente al más antiguo
  public get pedidos(): Pedido[] {
    return [...this._pedidos()].sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
  }

  pedidosDeUsuario(usuarioId: string): Pedido[] {
    return this.pedidos.filter(p => p.usuario === usuarioId);
  }

  haComprado(usuarioId: string, productoId: string): boolean {
    return this._pedidos().some(
      p => p.usuario === usuarioId && p.productos.some(item => item.producto === productoId)
    );
  }

  // El pago se simula: el pedido se registra directamente con estado "pendiente".
  crearPedido(usuarioId: string, detalle: DetalleCarrito[], subtotal: number, costoEnvio: number): Pedido {
    const pedido: Pedido = {
      _id: 'ped-' + (1001 + this._pedidos().length), // folio consecutivo
      usuario: usuarioId,
      productos: detalle.map(d => ({ producto: d.producto._id, cantidad: d.cantidad, subtotal: d.subtotal })),
      subtotal,
      costoEnvio,
      total: subtotal + costoEnvio,
      estado: 'pendiente',
      fecha: new Date(),
    };
    detalle.forEach(d => this.productosService.descontarStock(d.producto._id, d.cantidad));
    this._pedidos.update(lista => [...lista, pedido]);
    return pedido;
  }

  actualizarEstado(id: string, estado: EstadoPedido): void {
    this._pedidos.update(lista => lista.map(p => (p._id === id ? { ...p, estado } : p)));
  }
}
