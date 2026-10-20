import { Component } from '@angular/core';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Pedido } from '../../interfaces/pedido.interface';
import { Producto } from '../../interfaces/producto.interface';
import { AuthService } from '../../services/auth.service';
import { PedidosService } from '../../services/pedidos.service';
import { ProductosService } from '../../services/productos.service';
import { ResenasService } from '../../services/resenas.service';

@Component({
  selector: 'app-mis-pedidos-page',
  imports: [RouterLink, CurrencyPipe, DatePipe, NgClass],
  templateUrl: './mis-pedidos.page.html',
  styleUrl: './mis-pedidos.page.css',
})
export class MisPedidosPage {
  constructor(
    private authService: AuthService,
    private pedidosService: PedidosService,
    private productosService: ProductosService,
    private resenasService: ResenasService,
    private router: Router,
  ) {
    if (!this.authService.esCliente) {
      this.authService.rutaPendiente = '/mis-pedidos';
      this.router.navigate([this.authService.esAdmin ? '/admin' : '/login']);
    }
  }

  private get usuarioId(): string {
    return this.authService.usuarioActual?._id ?? '';
  }

  public get pedidos(): Pedido[] {
    return this.pedidosService.pedidosDeUsuario(this.usuarioId);
  }

  producto(id: string): Producto | undefined {
    return this.productosService.obtenerPorId(id);
  }

  yaResene(productoId: string): boolean {
    return !!this.resenasService.resenaDeUsuario(productoId, this.usuarioId);
  }

  totalPiezas(pedido: Pedido): number {
    return pedido.productos.reduce((suma, p) => suma + p.cantidad, 0);
  }
}
