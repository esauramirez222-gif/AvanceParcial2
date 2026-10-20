import { Injectable, signal } from '@angular/core';

export type TipoNotificacion = 'exito' | 'error' | 'info';

export interface Notificacion {
  mensaje: string;
  tipo: TipoNotificacion;
}

// Muestra mensajes breves (toast) desde cualquier pantalla.
@Injectable({ providedIn: 'root' })
export class NotificacionService {
  private _actual = signal<Notificacion | null>(null);
  private temporizador?: ReturnType<typeof setTimeout>;

  public get actual(): Notificacion | null {
    return this._actual();
  }

  mostrar(mensaje: string, tipo: TipoNotificacion = 'exito'): void {
    this._actual.set({ mensaje, tipo });
    clearTimeout(this.temporizador);
    this.temporizador = setTimeout(() => this.cerrar(), 3500);
  }

  cerrar(): void {
    this._actual.set(null);
  }
}
