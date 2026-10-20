import { Component, EventEmitter, Input, Output } from '@angular/core';

// Muestra de 1 a 5 estrellas. Si es "editable", permite elegir una calificación
// y avisa al componente padre mediante el @Output "cambio".
@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.css',
})
export class StarRatingComponent {
  @Input() public calificacion: number = 0;
  @Input() public editable: boolean = false;
  @Input() public tamano: 'sm' | 'lg' = 'sm';

  @Output() public cambio: EventEmitter<number> = new EventEmitter();

  public estrellas: number[] = [1, 2, 3, 4, 5];

  // Regresa la clase del ícono según la calificación (llena, media o vacía)
  icono(posicion: number): string {
    if (this.calificacion >= posicion) return 'bi-star-fill';
    if (this.calificacion >= posicion - 0.5) return 'bi-star-half';
    return 'bi-star';
  }

  seleccionar(valor: number): void {
    if (!this.editable) return;
    this.calificacion = valor;
    this.cambio.emit(valor);
  }
}
