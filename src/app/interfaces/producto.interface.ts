export interface Producto {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  stock: number;
  disponibilidad: boolean;
  categoria: string; // _id de la categoría (referencia)
}
