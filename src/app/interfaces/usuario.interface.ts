// Roles con cuenta. El "usuario no autenticado" es simplemente no tener sesión.
export type Rol = 'cliente' | 'administrador';

export interface Direccion {
  calle: string;
  numero: string;
  colonia: string;
  codigoPostal: string;
  ciudad: string;
  estado: string;
  pais: string;
}

export interface Usuario {
  _id: string;
  nombre: string;
  apellidos: string;
  correo: string;
  // En el backend se guardará como hash; aquí es texto plano porque los datos son de prueba.
  contrasena: string;
  rol: Rol;
  direccion: Direccion;
  fechaRegistro: Date;
}
