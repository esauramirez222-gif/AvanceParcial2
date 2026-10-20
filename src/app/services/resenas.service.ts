import { Injectable, signal } from '@angular/core';
import { Resena } from '../interfaces/resena.interface';
import { generarId } from '../utils/generar-id';

@Injectable({ providedIn: 'root' })
export class ResenasService {
  private _resenas = signal<Resena[]>([
    {
      _id: 'r1', producto: 'p01', usuario: 'u-luis', calificacion: 5, fecha: new Date('2026-09-10'),
      comentario: 'La cancelación de ruido es excelente y la batería me dura toda la semana.',
    },
    {
      _id: 'r2', producto: 'p03', usuario: 'u-luis', calificacion: 4, fecha: new Date('2026-09-11'),
      comentario: 'Suena muy bien para su tamaño. Le faltaría un poco más de bajo.',
    },
    {
      _id: 'r3', producto: 'p08', usuario: 'u-ana', calificacion: 4, fecha: new Date('2026-09-20'),
      comentario: 'Muy cómodo para trabajar varias horas, me tomó un par de días acostumbrarme.',
    },
    {
      _id: 'r4', producto: 'p09', usuario: 'u-luis', calificacion: 5, fecha: new Date('2026-10-08'),
      comentario: 'Se siente sólido y los switches suenan increíble. Totalmente recomendable.',
    },
  ]);

  // Más recientes primero
  public get resenas(): Resena[] {
    return [...this._resenas()].sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
  }

  porProducto(productoId: string): Resena[] {
    return this.resenas.filter(r => r.producto === productoId);
  }

  promedio(productoId: string): number {
    const lista = this._resenas().filter(r => r.producto === productoId);
    if (lista.length === 0) return 0;
    return lista.reduce((suma, r) => suma + r.calificacion, 0) / lista.length;
  }

  resenaDeUsuario(productoId: string, usuarioId: string): Resena | undefined {
    return this._resenas().find(r => r.producto === productoId && r.usuario === usuarioId);
  }

  agregar(productoId: string, usuarioId: string, calificacion: number, comentario: string): void {
    const nueva: Resena = {
      _id: generarId(), producto: productoId, usuario: usuarioId,
      calificacion, comentario: comentario.trim(), fecha: new Date(),
    };
    this._resenas.update(lista => [...lista, nueva]);
  }

  editar(id: string, calificacion: number, comentario: string): void {
    this._resenas.update(lista =>
      lista.map(r => (r._id === id ? { ...r, calificacion, comentario: comentario.trim(), fecha: new Date() } : r))
    );
  }

  eliminar(id: string): void {
    this._resenas.update(lista => lista.filter(r => r._id !== id));
  }

  // Al borrar un producto del catálogo también se borran sus reseñas.
  eliminarDeProducto(productoId: string): void {
    this._resenas.update(lista => lista.filter(r => r.producto !== productoId));
  }
}
