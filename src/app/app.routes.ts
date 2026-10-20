import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { CatalogoPage } from './pages/catalogo/catalogo.page';
import { ProductoDetallePage } from './pages/producto-detalle/producto-detalle.page';
import { LoginPage } from './pages/login/login.page';
import { RegistroPage } from './pages/registro/registro.page';
import { CarritoPage } from './pages/carrito/carrito.page';
import { MisPedidosPage } from './pages/mis-pedidos/mis-pedidos.page';
import { MiCuentaPage } from './pages/mi-cuenta/mi-cuenta.page';
import { AdminProductosPage } from './pages/admin/productos/admin-productos.page';
import { AdminCategoriasPage } from './pages/admin/categorias/admin-categorias.page';
import { AdminPedidosPage } from './pages/admin/pedidos/admin-pedidos.page';
import { AdminResenasPage } from './pages/admin/resenas/admin-resenas.page';
import { NotFoundPage } from './pages/not-found/not-found.page';

export const routes: Routes = [
  // Públicas (los tres tipos de usuario)
  { path: '', component: HomePage, title: 'TecnoStore | Inicio' },
  { path: 'catalogo', component: CatalogoPage, title: 'TecnoStore | Catálogo' },
  { path: 'producto/:id', component: ProductoDetallePage, title: 'TecnoStore | Producto' },
  { path: 'login', component: LoginPage, title: 'TecnoStore | Iniciar sesión' },
  { path: 'registro', component: RegistroPage, title: 'TecnoStore | Crear cuenta' },

  // Cliente autenticado
  { path: 'carrito', component: CarritoPage, title: 'TecnoStore | Carrito' },
  { path: 'mis-pedidos', component: MisPedidosPage, title: 'TecnoStore | Mis pedidos' },
  { path: 'mi-cuenta', component: MiCuentaPage, title: 'TecnoStore | Mi cuenta' },

  // Administrador
  { path: 'admin', redirectTo: 'admin/productos', pathMatch: 'full' },
  { path: 'admin/productos', component: AdminProductosPage, title: 'Admin | Productos' },
  { path: 'admin/categorias', component: AdminCategoriasPage, title: 'Admin | Categorías' },
  { path: 'admin/pedidos', component: AdminPedidosPage, title: 'Admin | Pedidos' },
  { path: 'admin/resenas', component: AdminResenasPage, title: 'Admin | Reseñas' },

  // Rutas no definidas
  { path: 'not-found', component: NotFoundPage, title: 'TecnoStore | Página no encontrada' },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' },
];
