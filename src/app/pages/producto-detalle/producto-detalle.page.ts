import { Component } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Producto } from '../../interfaces/producto.interface';
import { Resena } from '../../interfaces/resena.interface';
import { AuthService } from '../../services/auth.service';
import { CarritoService } from '../../services/carrito.service';
import { CategoriasService } from '../../services/categorias.service';
import { NotificacionService } from '../../services/notificacion.service';
import { PedidosService } from '../../services/pedidos.service';
import { ProductosService } from '../../services/productos.service';
import { ResenasService } from '../../services/resenas.service';
import { StarRatingComponent } from '../../components/star-rating/star-rating.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-producto-detalle-page',
  imports: [RouterLink, FormsModule, CurrencyPipe, DatePipe, StarRatingComponent, ConfirmDialogComponent, ProductCardComponent],
  templateUrl: './producto-detalle.page.html',
  styleUrl: './producto-detalle.page.css',
})
export class ProductoDetallePage {
  public productoId: string = '';
  public cantidad: number = 1;

  // Formulario de reseña (crear / editar)
  public calificacion: number = 0;
  public comentario: string = '';
  public editandoResena: boolean = false;
  public errorCalificacion: boolean = false;

  // Reseña que se quiere eliminar (abre el diálogo de confirmación)
  public resenaPorEliminar: Resena | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productosService: ProductosService,
    private categoriasService: CategoriasService,
    private resenasService: ResenasService,
    private pedidosService: PedidosService,
    private carritoService: CarritoService,
    private authService: AuthService,
    private notificacion: NotificacionService,
  ) {
    // paramMap es un Observable: nos suscribimos para reaccionar cuando cambia el :id de la ruta
    // (por ejemplo, al abrir un producto relacionado desde esta misma pantalla).
    this.route.paramMap.subscribe(params => {
      this.productoId = params.get('id') ?? '';
      this.cantidad = 1;
      this.cancelarEdicion();
    });
  }

  // ---------- Datos del producto ----------
  public get producto(): Producto | undefined {
    return this.productosService.obtenerPorId(this.productoId);
  }

  public get nombreCategoria(): string {
    return this.producto ? this.categoriasService.nombreDe(this.producto.categoria) : '';
  }

  public get disponible(): boolean {
    return !!this.producto && this.productosService.sePuedeComprar(this.producto);
  }

  // Lo que todavía se puede agregar sin rebasar el stock
  public get maximoAgregable(): number {
    if (!this.producto) return 0;
    return this.producto.stock - this.carritoService.cantidadDe(this.productoId);
  }

  public get relacionados(): Producto[] {
    const actual = this.producto;
    if (!actual) return [];
    return this.productosService.productos
      .filter(p => p.categoria === actual.categoria && p._id !== actual._id)
      .slice(0, 3);
  }

  // ---------- Sesión ----------
  public get estaAutenticado(): boolean { return this.authService.estaAutenticado; }
  public get esAdmin(): boolean { return this.authService.esAdmin; }
  public get esCliente(): boolean { return this.authService.esCliente; }
  private get usuarioId(): string { return this.authService.usuarioActual?._id ?? ''; }

  // ---------- Carrito ----------
  cambiarCantidad(delta: number): void {
    this.cantidad = Math.min(Math.max(1, this.cantidad + delta), Math.max(1, this.maximoAgregable));
  }

  agregarAlPedido(): void {
    // Si no hay sesión se redirige al inicio de sesión y después se regresa aquí
    if (!this.estaAutenticado) {
      this.authService.rutaPendiente = this.router.url;
      this.notificacion.mostrar('Inicia sesión para añadir productos a tu pedido.', 'info');
      this.router.navigate(['/login']);
      return;
    }
    const agregados = this.carritoService.agregar(this.productoId, this.cantidad);
    if (agregados > 0) {
      this.notificacion.mostrar(`Se añadieron ${agregados} pieza(s) a tu pedido.`);
      this.cantidad = 1;
    } else {
      this.notificacion.mostrar('Ya tienes en tu pedido todas las piezas disponibles.', 'error');
    }
  }

  // ---------- Reseñas ----------
  public get resenas(): Resena[] {
    return this.resenasService.porProducto(this.productoId);
  }

  public get promedio(): number {
    return this.resenasService.promedio(this.productoId);
  }

  public get miResena(): Resena | undefined {
    return this.resenasService.resenaDeUsuario(this.productoId, this.usuarioId);
  }

  // Solo el cliente que compró el producto puede escribir una reseña (una por producto)
  public get puedeResenar(): boolean {
    return this.esCliente && !this.miResena && this.pedidosService.haComprado(this.usuarioId, this.productoId);
  }

  nombreAutor(usuarioId: string): string {
    return this.authService.nombreDeUsuario(usuarioId);
  }

  esMia(resena: Resena): boolean {
    return resena.usuario === this.usuarioId;
  }

  seleccionarCalificacion(valor: number): void {
    this.calificacion = valor;
    this.errorCalificacion = false;
  }

  guardarResena(form: NgForm): void {
    this.errorCalificacion = this.calificacion === 0;
    if (form.invalid || this.errorCalificacion) return;

    if (this.editandoResena && this.miResena) {
      this.resenasService.editar(this.miResena._id, this.calificacion, this.comentario);
      this.notificacion.mostrar('Tu reseña se actualizó.');
    } else {
      this.resenasService.agregar(this.productoId, this.usuarioId, this.calificacion, this.comentario);
      this.notificacion.mostrar('¡Gracias! Tu reseña se publicó.');
    }
    form.resetForm();
    this.cancelarEdicion();
  }

  editarMiResena(): void {
    if (!this.miResena) return;
    this.editandoResena = true;
    this.calificacion = this.miResena.calificacion;
    this.comentario = this.miResena.comentario;
  }

  cancelarEdicion(): void {
    this.editandoResena = false;
    this.calificacion = 0;
    this.comentario = '';
    this.errorCalificacion = false;
  }

  pedirEliminar(resena: Resena): void {
    this.resenaPorEliminar = resena;
  }

  confirmarEliminar(): void {
    if (!this.resenaPorEliminar) return;
    this.resenasService.eliminar(this.resenaPorEliminar._id);
    this.notificacion.mostrar('La reseña se eliminó.', 'info');
    this.resenaPorEliminar = null;
    this.cancelarEdicion();
  }

  // Para los productos relacionados
  promedioDe(id: string): number { return this.resenasService.promedio(id); }
  totalResenasDe(id: string): number { return this.resenasService.porProducto(id).length; }
}
