import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Categoria } from '../../../interfaces/categoria.interface';
import { Producto } from '../../../interfaces/producto.interface';
import { AuthService } from '../../../services/auth.service';
import { CategoriasService } from '../../../services/categorias.service';
import { NotificacionService } from '../../../services/notificacion.service';
import { ProductosService } from '../../../services/productos.service';
import { ResenasService } from '../../../services/resenas.service';
import { AdminNavComponent } from '../../../components/admin-nav/admin-nav.component';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';

// Gestión de catálogo: añadir, editar y eliminar productos.
@Component({
  selector: 'app-admin-productos-page',
  imports: [ReactiveFormsModule, FormsModule, CurrencyPipe, AdminNavComponent, ConfirmDialogComponent],
  templateUrl: './admin-productos.page.html',
  styleUrl: './admin-productos.page.css',
})
export class AdminProductosPage {
  public form: FormGroup;
  public formSubmitted: boolean = false;
  public mostrarFormulario: boolean = false;
  public idEditando: string | null = null; // null = producto nuevo
  public productoPorEliminar: Producto | null = null;
  public busqueda: string = '';

  constructor(
    private productosService: ProductosService,
    private categoriasService: CategoriasService,
    private resenasService: ResenasService,
    private authService: AuthService,
    private notificacion: NotificacionService,
    private router: Router,
  ) {
    if (!this.authService.esAdmin) {
      this.authService.rutaPendiente = null;
      this.router.navigate(['/login']);
    }

    this.form = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
      precio: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
      imagen: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required, Validators.minLength(10)]),
      categoria: new FormControl('', [Validators.required]),
      stock: new FormControl<number | null>(0, [Validators.required, Validators.min(0)]),
      disponibilidad: new FormControl(true),
    });
  }

  public get categorias(): Categoria[] {
    return this.categoriasService.categorias;
  }

  public get productos(): Producto[] {
    const texto = this.busqueda.trim().toLowerCase();
    return this.productosService.productos.filter(p => !texto || p.nombre.toLowerCase().includes(texto));
  }

  public get totalProductos(): number { return this.productosService.productos.length; }
  public get sinStock(): number { return this.productosService.productos.filter(p => p.stock === 0).length; }
  public get noDisponibles(): number { return this.productosService.productos.filter(p => !p.disponibilidad).length; }

  // Vista previa de la imagen escrita en el formulario
  public get imagenPrevia(): string {
    return this.form.get('imagen')?.value ?? '';
  }

  nombreCategoria(id: string): string {
    return this.categoriasService.nombreDe(id);
  }

  invalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!control && control.invalid && (control.touched || this.formSubmitted);
  }

  nuevo(): void {
    this.idEditando = null;
    this.formSubmitted = false;
    this.form.reset({ nombre: '', precio: null, imagen: '', descripcion: '', categoria: '', stock: 0, disponibilidad: true });
    this.mostrarFormulario = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  editar(producto: Producto): void {
    this.idEditando = producto._id;
    this.formSubmitted = false;
    // patchValue llena el formulario con los datos actuales del producto
    this.form.patchValue(producto);
    this.mostrarFormulario = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelar(): void {
    this.mostrarFormulario = false;
    this.idEditando = null;
  }

  guardar(): void {
    this.formSubmitted = true;
    if (this.form.invalid) return;

    const v = this.form.value;
    const datos: Omit<Producto, '_id'> = {
      nombre: v.nombre.trim(),
      precio: Number(v.precio),
      imagen: v.imagen.trim(),
      descripcion: v.descripcion.trim(),
      categoria: v.categoria,
      stock: Number(v.stock),
      disponibilidad: !!v.disponibilidad,
    };

    if (this.idEditando) {
      this.productosService.actualizar(this.idEditando, datos);
      this.notificacion.mostrar(`"${datos.nombre}" se actualizó.`);
    } else {
      this.productosService.agregar(datos);
      this.notificacion.mostrar(`"${datos.nombre}" se añadió al catálogo.`);
    }
    this.cancelar();
  }

  pedirEliminar(producto: Producto): void {
    this.productoPorEliminar = producto;
  }

  confirmarEliminar(): void {
    if (!this.productoPorEliminar) return;
    const { _id, nombre } = this.productoPorEliminar;
    this.productosService.eliminar(_id);
    this.resenasService.eliminarDeProducto(_id);
    if (this.idEditando === _id) this.cancelar();
    this.notificacion.mostrar(`"${nombre}" se eliminó del catálogo.`, 'info');
    this.productoPorEliminar = null;
  }
}
