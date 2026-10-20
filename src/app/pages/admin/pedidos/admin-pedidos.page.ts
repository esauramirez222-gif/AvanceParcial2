import { Component } from '@angular/core';
import { CurrencyPipe, DatePipe, NgClass, TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { EstadoPedido, Pedido } from '../../../interfaces/pedido.interface';
import { AuthService } from '../../../services/auth.service';
import { NotificacionService } from '../../../services/notificacion.service';
import { PedidosService } from '../../../services/pedidos.service';
import { ProductosService } from '../../../services/productos.service';
import { AdminNavComponent } from '../../../components/admin-nav/admin-nav.component';

// Consulta de pedidos y actualización de su estado (pendiente, enviado, entregado).
@Component({
  selector: 'app-admin-pedidos-page',
  imports: [CurrencyPipe, DatePipe, NgClass, TitleCasePipe, AdminNavComponent],
  templateUrl: './admin-pedidos.page.html',
  styleUrl: './admin-pedidos.page.css',
})
export class AdminPedidosPage {
  public filtro: EstadoPedido | 'todos' = 'todos';
  public pedidoAbierto: string | null = null;

  constructor(
    private pedidosService: PedidosService,
    private productosService: ProductosService,
    private authService: AuthService,
    private notificacion: NotificacionService,
    private router: Router,
  ) {
    if (!this.authService.esAdmin) {
      this.router.navigate(['/login']);
    }
  }

  public get estados(): EstadoPedido[] {
    return this.pedidosService.estados;
  }

  public get pedidos(): Pedido[] {
    const todos = this.pedidosService.pedidos;
    return this.filtro === 'todos' ? todos : todos.filter(p => p.estado === this.filtro);
  }

  contar(estado: EstadoPedido | 'todos'): number {
    const todos = this.pedidosService.pedidos;
    return estado === 'todos' ? todos.length : todos.filter(p => p.estado === estado).length;
  }

  cliente(usuarioId: string): string {
    return this.authService.nombreDeUsuario(usuarioId);
  }

  nombreProducto(id: string): string {
    return this.productosService.obtenerPorId(id)?.nombre ?? 'Producto eliminado';
  }

  piezas(pedido: Pedido): number {
    return pedido.productos.reduce((suma, p) => suma + p.cantidad, 0);
  }

  alternarDetalle(id: string): void {
    this.pedidoAbierto = this.pedidoAbierto === id ? null : id;
  }

  cambiarEstado(pedido: Pedido, evento: Event): void {
    const estado = (evento.target as HTMLSelectElement).value as EstadoPedido;
    this.pedidosService.actualizarEstado(pedido._id, estado);
    this.notificacion.mostrar(`El pedido #${pedido._id} ahora está "${estado}".`);
  }
}
