import { Component, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Producto } from '../../interfaces/producto.interface';
import { StarRatingComponent } from '../star-rating/star-rating.component';

// Tarjeta de producto usada en Home y en el Catálogo. Recibe los datos del padre con @Input.
@Component({
  selector: 'app-product-card',
  imports: [RouterLink, CurrencyPipe, StarRatingComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  @Input({ required: true }) public producto!: Producto;
  @Input() public categoria: string = '';
  @Input() public promedio: number = 0;
  @Input() public totalResenas: number = 0;

  public get disponible(): boolean {
    return this.producto.disponibilidad && this.producto.stock > 0;
  }

  // Muy bien calificado: promedio de 4.5 o más con al menos una reseña
  public get esTop(): boolean {
    return this.totalResenas > 0 && this.promedio >= 4.5;
  }

  // Avisa cuando quedan pocas piezas en existencia
  public get pocasPiezas(): boolean {
    return this.producto.stock <= 10;
  }
}
