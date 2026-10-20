export interface Resena {
  _id: string;
  producto: string; // _id del producto (referencia)
  usuario: string;  // _id del usuario (referencia)
  calificacion: number; // 1 a 5
  comentario: string;
  fecha: Date;
}
