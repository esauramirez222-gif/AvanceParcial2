import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Categoria } from '../../interfaces/categoria.interface';
import { Producto } from '../../interfaces/producto.interface';
import { CategoriasService } from '../../services/categorias.service';
import { ProductosService } from '../../services/productos.service';
import { ResenasService } from '../../services/resenas.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ENVIO_GRATIS_DESDE } from '../../services/carrito.service';
import { AuthService } from '../../services/auth.service';
import { RevealDirective } from '../../directives/reveal.directive';
import { CountUpDirective } from '../../directives/count-up.directive';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, CurrencyPipe, ProductCardComponent, RevealDirective, CountUpDirective],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export class HomePage {
  public envioGratisDesde = ENVIO_GRATIS_DESDE;

  // Íconos para mostrar cada categoría en la página de inicio
  private iconos: Record<string, string> = {
    'cat-audio': 'bi-headphones',
    'cat-cables': 'bi-usb-c',
    'cat-cargadores': 'bi-lightning-charge',
    'cat-computo': 'bi-keyboard',
    'cat-accesorios': 'bi-phone',
  };

  constructor(
    private productosService: ProductosService,
    private categoriasService: CategoriasService,
    private resenasService: ResenasService,
    private authService: AuthService,
  ) {}

  public get estaAutenticado(): boolean {
    return this.authService.estaAutenticado;
  }

  public get esAdmin(): boolean {
    return this.authService.esAdmin;
  }

  public get categorias(): Categoria[] {
    return this.categoriasService.categorias;
  }

  public get totalProductos(): number {
    return this.productosService.productos.length;
  }

  // Promedio de todas las reseñas de la tienda (para las cifras del banner)
  public get promedioGeneral(): number {
    const resenas = this.resenasService.resenas;
    if (resenas.length === 0) return 0;
    return resenas.reduce((suma, r) => suma + r.calificacion, 0) / resenas.length;
  }

  // Productos destacados: los disponibles con mejor calificación promedio (máximo 4)
  public get destacados(): Producto[] {
    return this.productosService.productos
      .filter(p => p.disponibilidad && p.stock > 0)
      .sort((a, b) => this.promedio(b._id) - this.promedio(a._id) || b.precio - a.precio)
      .slice(0, 4);
  }

  // Los tres primeros destacados flotan en el banner
  public get vitrina(): Producto[] {
    return this.destacados.slice(0, 3);
  }

  iconoDe(categoriaId: string): string {
    return this.iconos[categoriaId] ?? 'bi-tag';
  }

  nombreCategoria(id: string): string {
    return this.categoriasService.nombreDe(id);
  }

  contarEnCategoria(id: string): number {
    return this.productosService.contarPorCategoria(id);
  }

  promedio(productoId: string): number {
    return this.resenasService.promedio(productoId);
  }

  totalResenas(productoId: string): number {
    return this.resenasService.porProducto(productoId).length;
  }
}
