import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';

// Ventana de confirmación reutilizable (eliminar producto, categoría, reseña, finalizar compra...).
// El padre decide qué hacer al escuchar los eventos "confirmar" o "cancelar".
@Component({
  selector: 'app-confirm-dialog',
  imports: [NgClass],
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
  @Input() public visible: boolean = false;
  @Input() public titulo: string = '¿Estás seguro?';
  @Input() public mensaje: string = '';
  @Input() public textoConfirmar: string = 'Confirmar';
  @Input() public peligro: boolean = true;

  @Output() public confirmar: EventEmitter<void> = new EventEmitter();
  @Output() public cancelar: EventEmitter<void> = new EventEmitter();

  onConfirmar(): void {
    this.confirmar.emit();
  }

  onCancelar(): void {
    this.cancelar.emit();
  }
}
