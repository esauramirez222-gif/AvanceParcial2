import { Injectable, signal } from '@angular/core';
import { Direccion, Usuario } from '../interfaces/usuario.interface';
import { generarId } from '../utils/generar-id';

export interface DatosRegistro {
  nombre: string;
  apellidos: string;
  correo: string;
  contrasena: string;
}

const DIRECCION_VACIA: Direccion = {
  calle: '', numero: '', colonia: '', codigoPostal: '', ciudad: '', estado: '', pais: 'México',
};

// Maneja los usuarios, el inicio/cierre de sesión y el rol del usuario actual.
// Más adelante, estas operaciones se harán contra la API (JWT).
@Injectable({ providedIn: 'root' })
export class AuthService {
  private usuarios = signal<Usuario[]>([
    {
      _id: 'u-admin',
      nombre: 'Administrador',
      apellidos: 'TecnoStore',
      correo: 'admin@tecnostore.mx',
      contrasena: 'admin1234',
      rol: 'administrador',
      direccion: { ...DIRECCION_VACIA },
      fechaRegistro: new Date('2026-08-01'),
    },
    {
      _id: 'u-ana',
      nombre: 'Ana',
      apellidos: 'López García',
      correo: 'cliente@tecnostore.mx',
      contrasena: 'cliente123',
      rol: 'cliente',
      direccion: {
        calle: 'Av. Manuel Nava', numero: '8', colonia: 'Zona Universitaria',
        codigoPostal: '78290', ciudad: 'San Luis Potosí', estado: 'San Luis Potosí', pais: 'México',
      },
      fechaRegistro: new Date('2026-08-20'),
    },
    {
      _id: 'u-luis',
      nombre: 'Luis',
      apellidos: 'Martínez Pérez',
      correo: 'luis@correo.com',
      contrasena: 'luis12345',
      rol: 'cliente',
      direccion: {
        calle: 'Calle Reforma', numero: '120', colonia: 'Centro',
        codigoPostal: '78000', ciudad: 'San Luis Potosí', estado: 'San Luis Potosí', pais: 'México',
      },
      fechaRegistro: new Date('2026-09-02'),
    },
  ]);

  private _usuarioActual = signal<Usuario | null>(null);

  // Ruta a la que se intentó entrar sin sesión; tras iniciar sesión se regresa ahí.
  public rutaPendiente: string | null = null;

  public get usuarioActual(): Usuario | null {
    return this._usuarioActual();
  }

  public get estaAutenticado(): boolean {
    return this._usuarioActual() !== null;
  }

  public get esAdmin(): boolean {
    return this._usuarioActual()?.rol === 'administrador';
  }

  public get esCliente(): boolean {
    return this._usuarioActual()?.rol === 'cliente';
  }

  public get tieneDireccion(): boolean {
    const d = this._usuarioActual()?.direccion;
    return !!d && !!d.calle && !!d.numero && !!d.codigoPostal && !!d.ciudad;
  }

  iniciarSesion(correo: string, contrasena: string): boolean {
    const usuario = this.usuarios().find(
      u => u.correo.toLowerCase() === correo.trim().toLowerCase() && u.contrasena === contrasena
    );
    if (!usuario) return false;
    this._usuarioActual.set(usuario);
    return true;
  }

  cerrarSesion(): void {
    this._usuarioActual.set(null);
    this.rutaPendiente = null;
  }

  existeCorreo(correo: string, exceptoId?: string): boolean {
    return this.usuarios().some(
      u => u.correo.toLowerCase() === correo.trim().toLowerCase() && u._id !== exceptoId
    );
  }

  // Todo usuario que se registra desde el sitio es cliente.
  registrar(datos: DatosRegistro): Usuario {
    const nuevo: Usuario = {
      _id: generarId(),
      nombre: datos.nombre.trim(),
      apellidos: datos.apellidos.trim(),
      correo: datos.correo.trim().toLowerCase(),
      contrasena: datos.contrasena,
      rol: 'cliente',
      direccion: { ...DIRECCION_VACIA },
      fechaRegistro: new Date(),
    };
    this.usuarios.update(lista => [...lista, nuevo]);
    this._usuarioActual.set(nuevo);
    return nuevo;
  }

  actualizarCuenta(cambios: Partial<Usuario>): void {
    const actual = this._usuarioActual();
    if (!actual) return;
    const actualizado: Usuario = { ...actual, ...cambios };
    this.usuarios.update(lista => lista.map(u => (u._id === actual._id ? actualizado : u)));
    this._usuarioActual.set(actualizado);
  }

  nombreDeUsuario(id: string): string {
    const u = this.usuarios().find(x => x._id === id);
    return u ? `${u.nombre} ${u.apellidos}` : 'Usuario eliminado';
  }
}
