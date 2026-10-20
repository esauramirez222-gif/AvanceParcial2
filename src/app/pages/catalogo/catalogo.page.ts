import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Categoria } from '../../interfaces/categoria.interface';
import { Producto } from '../../interfaces/producto.interface';
import { CategoriasService } from '../../services/categorias.service';
import { ProductosService } from '../../services/productos.service';
import { ResenasService } from '../../services/resenas.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { RevealDirective } from '../../directives/reveal.directive';

type Orden = 'relevancia' | 'precio-asc' | 'precio-desc' | 'nombre';

@Component({
  selector: 'app-catalogo-page',
  imports: [FormsModule, NgClass, ProductCardComponent, RevealDirective],
  templateUrl: './catalogo.page.html',
  styleUrl: './catalogo.page.css',
})
export class CatalogoPage {
  // Enlazadas con [(ngModel)] en el HTML
  public busqueda: string = '';
  public categoriaSeleccionada: string = ''; // '' = todas
  public orden: Orden = 'relevancia';
  public soloDisponibles: boolean = false;

  constructor(
    private productosService: ProductosService,
    private categoriasService: CategoriasService,
    private resenasService: ResenasService,
    private route: ActivatedRoute,
  ) {
    // Si se llega desde Home con ?categoria=..., se aplica ese filtro
    this.categoriaSeleccionada = this.route.snapshot.queryParamMap.get('categoria') ?? '';
  }

  public get categorias(): Categoria[] {
    return this.categoriasService.categorias;
  }

  public get productosFiltrados(): Producto[] {
    const texto = this.busqueda.trim().toLowerCase();

    const lista = this.productosService.productos.filter(p =>
      (this.categoriaSeleccionada === '' || p.categoria === this.categoriaSeleccionada) &&
      (texto === '' || p.nombre.toLowerCase().includes(texto) || p.descripcion.toLowerCase().includes(texto)) &&
      (!this.soloDisponibles || (p.disponibilidad && p.stock > 0))
    );

    switch (this.orden) {
      case 'precio-asc': return lista.sort((a, b) => a.precio - b.precio);
      case 'precio-desc': return lista.sort((a, b) => b.precio - a.precio);
      case 'nombre': return lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
      default: return lista;
    }
  }

  public get tituloCategoria(): string {
    return this.categoriaSeleccionada ? this.categoriasService.nombreDe(this.categoriaSeleccionada) : 'Todos los productos';
  }

  seleccionarCategoria(id: string): void {
    this.categoriaSeleccionada = id;
  }

  contarEnCategoria(id: string): number {
    return this.productosService.contarPorCategoria(id);
  }

  limpiarFiltros(): void {
    this.busqueda = '';
    this.categoriaSeleccionada = '';
    this.orden = 'relevancia';
    this.soloDisponibles = false;
  }

  nombreCategoria(id: string): string {
    return this.categoriasService.nombreDe(id);
  }

  promedio(productoId: string): number {
    return this.resenasService.promedio(productoId);
  }

  totalResenas(productoId: string): number {
    return this.resenasService.porProducto(productoId).length;
  }
}
