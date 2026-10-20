import { Injectable, signal } from '@angular/core';
import { Producto } from '../interfaces/producto.interface';
import { generarId } from '../utils/generar-id';

const IMG = 'img/productos/';

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private _productos = signal<Producto[]>([
    {
      _id: 'p01', nombre: 'Audífonos inalámbricos AuraSound Pro', precio: 1299, stock: 15, disponibilidad: true,
      categoria: 'cat-audio', imagen: IMG + 'audifonos-aurasound.svg',
      descripcion: 'Audífonos over-ear con Bluetooth 5.3, cancelación activa de ruido y hasta 40 horas de batería. Incluyen estuche rígido y cable de 3.5 mm.',
    },
    {
      _id: 'p02', nombre: 'Audífonos in-ear Pulse Buds', precio: 649, stock: 30, disponibilidad: true,
      categoria: 'cat-audio', imagen: IMG + 'audifonos-pulse-buds.svg',
      descripcion: 'Audífonos true wireless con estuche de carga, resistencia al sudor IPX5 y controles táctiles.',
    },
    {
      _id: 'p03', nombre: 'Bocina portátil BoomCube', precio: 899, stock: 8, disponibilidad: true,
      categoria: 'cat-audio', imagen: IMG + 'bocina-boomcube.svg',
      descripcion: 'Bocina Bluetooth resistente al agua con 12 horas de reproducción y sonido 360°.',
    },
    {
      _id: 'p04', nombre: 'Cable USB-C a USB-C 2 m', precio: 199, stock: 60, disponibilidad: true,
      categoria: 'cat-cables', imagen: IMG + 'cable-usb-c.svg',
      descripcion: 'Cable trenzado de nylon con carga rápida de hasta 100 W y transferencia de datos a 480 Mbps.',
    },
    {
      _id: 'p05', nombre: 'Cable USB-C a Lightning 1 m', precio: 249, stock: 0, disponibilidad: false,
      categoria: 'cat-cables', imagen: IMG + 'cable-lightning.svg',
      descripcion: 'Cable certificado para carga rápida de iPhone, con conectores reforzados.',
    },
    {
      _id: 'p06', nombre: 'Cargador de pared GaN 65 W', precio: 749, stock: 20, disponibilidad: true,
      categoria: 'cat-cargadores', imagen: IMG + 'cargador-gan-65w.svg',
      descripcion: 'Cargador compacto con tecnología GaN, dos puertos USB-C y uno USB-A. Carga una laptop y un teléfono al mismo tiempo.',
    },
    {
      _id: 'p07', nombre: 'Power bank 20,000 mAh', precio: 599, stock: 25, disponibilidad: true,
      categoria: 'cat-cargadores', imagen: IMG + 'power-bank-20000.svg',
      descripcion: 'Batería portátil con pantalla de porcentaje, carga rápida de 22.5 W y salida USB-C.',
    },
    {
      _id: 'p08', nombre: 'Mouse inalámbrico ergonómico', precio: 459, stock: 18, disponibilidad: true,
      categoria: 'cat-computo', imagen: IMG + 'mouse-ergonomico.svg',
      descripcion: 'Mouse vertical con sensor de 4,000 DPI, conexión 2.4 GHz o Bluetooth y batería recargable.',
    },
    {
      _id: 'p09', nombre: 'Teclado mecánico compacto 75%', precio: 1499, stock: 10, disponibilidad: true,
      categoria: 'cat-computo', imagen: IMG + 'teclado-mecanico.svg',
      descripcion: 'Teclado mecánico con switches intercambiables, retroiluminación RGB y conexión triple modo.',
    },
    {
      _id: 'p10', nombre: 'Webcam Full HD 1080p', precio: 829, stock: 12, disponibilidad: true,
      categoria: 'cat-computo', imagen: IMG + 'webcam-fullhd.svg',
      descripcion: 'Cámara web con micrófono doble, enfoque automático y tapa de privacidad.',
    },
    {
      _id: 'p11', nombre: 'Funda de silicón para smartphone', precio: 179, stock: 40, disponibilidad: true,
      categoria: 'cat-accesorios', imagen: IMG + 'funda-silicon.svg',
      descripcion: 'Funda de silicón suave al tacto con interior de microfibra y bordes elevados para proteger la cámara.',
    },
    {
      _id: 'p12', nombre: 'Correa deportiva para smartwatch', precio: 229, stock: 22, disponibilidad: true,
      categoria: 'cat-accesorios', imagen: IMG + 'correa-smartwatch.svg',
      descripcion: 'Correa de silicón transpirable compatible con relojes de 42 a 45 mm.',
    },
    {
      _id: 'p13', nombre: 'Memoria USB 128 GB', precio: 289, stock: 35, disponibilidad: true,
      categoria: 'cat-accesorios', imagen: IMG + 'memoria-usb-128.svg',
      descripcion: 'Memoria USB 3.2 con carcasa metálica y velocidades de lectura de hasta 150 MB/s.',
    },
    {
      _id: 'p14', nombre: 'Control inalámbrico para PC y móvil', precio: 699, stock: 6, disponibilidad: true,
      categoria: 'cat-accesorios', imagen: IMG + 'control-inalambrico.svg',
      descripcion: 'Control con vibración, conexión Bluetooth y soporte para teléfono incluido.',
    },
  ]);

  public get productos(): Producto[] {
    return this._productos();
  }

  obtenerPorId(id: string): Producto | undefined {
    return this._productos().find(p => p._id === id);
  }

  contarPorCategoria(categoriaId: string): number {
    return this._productos().filter(p => p.categoria === categoriaId).length;
  }

  // Un producto se puede comprar si el administrador lo marcó disponible y tiene stock.
  sePuedeComprar(producto: Producto): boolean {
    return producto.disponibilidad && producto.stock > 0;
  }

  agregar(datos: Omit<Producto, '_id'>): void {
    this._productos.update(lista => [...lista, { _id: generarId(), ...datos }]);
  }

  actualizar(id: string, datos: Omit<Producto, '_id'>): void {
    this._productos.update(lista => lista.map(p => (p._id === id ? { _id: id, ...datos } : p)));
  }

  eliminar(id: string): void {
    this._productos.update(lista => lista.filter(p => p._id !== id));
  }

  descontarStock(id: string, cantidad: number): void {
    this._productos.update(lista =>
      lista.map(p => (p._id === id ? { ...p, stock: Math.max(0, p.stock - cantidad) } : p))
    );
  }
}
