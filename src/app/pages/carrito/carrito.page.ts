import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DetalleCarrito } from '../../interfaces/carrito.interface';
import { Direccion } from '../../interfaces/usuario.interface';
import { AuthService } from '../../services/auth.service';
import { CarritoService, ENVIO_GRATIS_DESDE } from '../../services/carrito.service';
import { NotificacionService } from '../../services/notificacion.service';
import { PedidosService } from '../../services/pedidos.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-carrito-page',
  imports: [RouterLink, CurrencyPipe, ConfirmDialogComponent],
  templateUrl: './carrito.page.html',
  styleUrl: './carrito.page.css',
})
export class CarritoPage {
  public envioGratisDesde = ENVIO_GRATIS_DESDE;
  public confirmandoCompra: boolean = false;

  constructor(
    private carritoService: CarritoService,
    private pedidosService: PedidosService,
    private authService: AuthService,
    private notificacion: NotificacionService,
    private router: Router,
  ) {
    // Solo el cliente autenticado tiene carrito
    if (!this.authService.esCliente) {
      this.authService.rutaPendiente = '/carrito';
      this.router.navigate([this.authService.esAdmin ? '/admin' : '/login']);
    }
  }

  public get detalle(): DetalleCarrito[] { return this.carritoService.detalle; }
  public get subtotal(): number { return this.carritoService.subtotal; }
  public get costoEnvio(): number { return this.carritoService.costoEnvio; }
  public get total(): number { return this.carritoService.total; }
  public get articulos(): number { return this.carritoService.cantidadArticulos; }
  public get faltaParaEnvioGratis(): number { return Math.max(0, this.envioGratisDesde - this.subtotal); }

  public get tieneDireccion(): boolean { return this.authService.tieneDireccion; }
  public get direccion(): Direccion | undefined { return this.authService.usuarioActual?.direccion; }

  cambiarCantidad(productoId: string, cantidad: number): void {
    this.carritoService.cambiarCantidad(productoId, cantidad);
  }

  eliminar(item: DetalleCarrito): void {
    this.carritoService.eliminar(item.producto._id);
    this.notificacion.mostrar(`Se quitó "${item.producto.nombre}" de tu pedido.`, 'info');
  }

  finalizarCompra(): void {
    const usuario = this.authService.usuarioActual;
    if (!usuario) return;

    // El pago se simula: se registra el pedido con estado "pendiente"
    this.pedidosService.crearPedido(usuario._id, this.detalle, this.subtotal, this.costoEnvio);
    this.carritoService.vaciar();
    this.confirmandoCompra = false;
    this.notificacion.mostrar('¡Compra realizada! Tu pedido quedó registrado como pendiente.');
    this.router.navigate(['/mis-pedidos']);
  }
}
