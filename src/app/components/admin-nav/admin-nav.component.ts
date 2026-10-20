import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

// Pestañas de navegación compartidas por las pantallas del administrador.
@Component({
  selector: 'app-admin-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-nav.component.html',
  styleUrl: './admin-nav.component.css',
})
export class AdminNavComponent {
  public secciones = [
    { ruta: '/admin/productos', texto: 'Productos', icono: 'bi-box-seam' },
    { ruta: '/admin/categorias', texto: 'Categorías', icono: 'bi-tags' },
    { ruta: '/admin/pedidos', texto: 'Pedidos', icono: 'bi-receipt' },
    { ruta: '/admin/resenas', texto: 'Reseñas', icono: 'bi-chat-square-text' },
  ];
}
