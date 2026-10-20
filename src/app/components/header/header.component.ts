import { Component, HostListener, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CarritoService } from '../../services/carrito.service';
import { NotificacionService } from '../../services/notificacion.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  // Controla el menú desplegable en pantallas pequeñas
  public menuAbierto = signal(false);
  // true cuando el usuario ya bajó en la página (la barra se compacta)
  public conScroll = signal(false);

  @HostListener('window:scroll')
  alHacerScroll(): void {
    this.conScroll.set(window.scrollY > 12);
  }

  constructor(
    private authService: AuthService,
    private carritoService: CarritoService,
    private notificacion: NotificacionService,
    private router: Router,
  ) {}

  public get estaAutenticado(): boolean { return this.authService.estaAutenticado; }
  public get esAdmin(): boolean { return this.authService.esAdmin; }
  public get esCliente(): boolean { return this.authService.esCliente; }
  public get nombreUsuario(): string { return this.authService.usuarioActual?.nombre ?? ''; }
  public get articulosEnCarrito(): number { return this.carritoService.cantidadArticulos; }

  alternarMenu(): void {
    this.menuAbierto.update(valor => !valor);
  }

  cerrarMenu(): void {
    this.menuAbierto.set(false);
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.carritoService.vaciar();
    this.cerrarMenu();
    this.notificacion.mostrar('Cerraste sesión correctamente.', 'info');
    this.router.navigate(['/']);
  }
}
