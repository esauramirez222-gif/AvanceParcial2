import { Injectable, computed, signal } from '@angular/core';
import { DetalleCarrito, ItemCarrito } from '../interfaces/carrito.interface';
import { ProductosService } from './productos.service';

export const ENVIO_GRATIS_DESDE = 999;
export const COSTO_ENVIO = 99;

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private items = signal<ItemCarrito[]>([]);

  constructor(private productosService: ProductosService) {}

  // computed() recalcula automáticamente cuando cambian los items del carrito.
  private _detalle = computed<DetalleCarrito[]>(() =>
    this.items()
      .map(item => {
        const producto = this.productosService.obtenerPorId(item.productoId);
        return producto ? { producto, cantidad: item.cantidad, subtotal: producto.precio * item.cantidad } : null;
      })
      .filter((d): d is DetalleCarrito => d !== null)
  );

  private _subtotal = computed(() => this._detalle().reduce((suma, d) => suma + d.subtotal, 0));

  private _costoEnvio = computed(() => {
    const subtotal = this._subtotal();
    return subtotal === 0 || subtotal >= ENVIO_GRATIS_DESDE ? 0 : COSTO_ENVIO;
  });

  public get detalle(): DetalleCarrito[] { return this._detalle(); }
  public get subtotal(): number { return this._subtotal(); }
  public get costoEnvio(): number { return this._costoEnvio(); }
  public get total(): number { return this._subtotal() + this._costoEnvio(); }
  public get cantidadArticulos(): number {
    return this.items().reduce((suma, i) => suma + i.cantidad, 0);
  }

  cantidadDe(productoId: string): number {
    return this.items().find(i => i.productoId === productoId)?.cantidad ?? 0;
  }

  // Regresa la cantidad que realmente se pudo agregar (no se rebasa el stock).
  agregar(productoId: string, cantidad: number): number {
    const producto = this.productosService.obtenerPorId(productoId);
    if (!producto) return 0;
    const enCarrito = this.cantidadDe(productoId);
    const posible = Math.min(cantidad, producto.stock - enCarrito);
    if (posible <= 0) return 0;

    if (enCarrito > 0) {
      this.cambiarCantidad(productoId, enCarrito + posible);
    } else {
      this.items.update(lista => [...lista, { productoId, cantidad: posible }]);
    }
    return posible;
  }

  cambiarCantidad(productoId: string, cantidad: number): void {
    const stock = this.productosService.obtenerPorId(productoId)?.stock ?? 0;
    const nueva = Math.max(1, Math.min(cantidad, stock));
    this.items.update(lista => lista.map(i => (i.productoId === productoId ? { ...i, cantidad: nueva } : i)));
  }

  eliminar(productoId: string): void {
    this.items.update(lista => lista.filter(i => i.productoId !== productoId));
  }

  vaciar(): void {
    this.items.set([]);
  }
}
