import { Injectable, signal } from '@angular/core';
import { Categoria } from '../interfaces/categoria.interface';
import { generarId } from '../utils/generar-id';

@Injectable({ providedIn: 'root' })
export class CategoriasService {
  private _categorias = signal<Categoria[]>([
    { _id: 'cat-audio', nombre: 'Audio', descripcion: 'Audífonos, bocinas y todo para escuchar música.' },
    { _id: 'cat-cables', nombre: 'Cables', descripcion: 'Cables USB-C, Lightning y de datos.' },
    { _id: 'cat-cargadores', nombre: 'Cargadores', descripcion: 'Cargadores de pared y baterías portátiles.' },
    { _id: 'cat-computo', nombre: 'Cómputo', descripcion: 'Mouses, teclados y periféricos para tu equipo.' },
    { _id: 'cat-accesorios', nombre: 'Accesorios', descripcion: 'Fundas, correas, memorias y más.' },
  ]);

  public get categorias(): Categoria[] {
    return this._categorias();
  }

  obtenerPorId(id: string): Categoria | undefined {
    return this._categorias().find(c => c._id === id);
  }

  nombreDe(id: string): string {
    return this.obtenerPorId(id)?.nombre ?? 'Sin categoría';
  }

  agregar(datos: Omit<Categoria, '_id'>): void {
    this._categorias.update(lista => [...lista, { _id: generarId(), ...datos }]);
  }

  actualizar(id: string, datos: Omit<Categoria, '_id'>): void {
    this._categorias.update(lista => lista.map(c => (c._id === id ? { _id: id, ...datos } : c)));
  }

  eliminar(id: string): void {
    this._categorias.update(lista => lista.filter(c => c._id !== id));
  }
}
