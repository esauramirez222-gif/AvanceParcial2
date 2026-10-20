import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Categoria } from '../../../interfaces/categoria.interface';
import { AuthService } from '../../../services/auth.service';
import { CategoriasService } from '../../../services/categorias.service';
import { NotificacionService } from '../../../services/notificacion.service';
import { ProductosService } from '../../../services/productos.service';
import { AdminNavComponent } from '../../../components/admin-nav/admin-nav.component';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';

// Gestión de categorías con un formulario basado en plantilla (ngModel).
@Component({
  selector: 'app-admin-categorias-page',
  imports: [FormsModule, AdminNavComponent, ConfirmDialogComponent],
  templateUrl: './admin-categorias.page.html',
  styleUrl: './admin-categorias.page.css',
})
export class AdminCategoriasPage {
  public nombre: string = '';
  public descripcion: string = '';
  public idEditando: string | null = null;
  public nombreRepetido: boolean = false;
  public categoriaPorEliminar: Categoria | null = null;

  constructor(
    private categoriasService: CategoriasService,
    private productosService: ProductosService,
    private authService: AuthService,
    private notificacion: NotificacionService,
    private router: Router,
  ) {
    if (!this.authService.esAdmin) {
      this.router.navigate(['/login']);
    }
  }

  public get categorias(): Categoria[] {
    return this.categoriasService.categorias;
  }

  productosEn(id: string): number {
    return this.productosService.contarPorCategoria(id);
  }

  guardar(form: NgForm): void {
    if (form.invalid) return;

    const nombre = this.nombre.trim();
    this.nombreRepetido = this.categorias.some(
      c => c.nombre.toLowerCase() === nombre.toLowerCase() && c._id !== this.idEditando
    );
    if (this.nombreRepetido) return;

    const datos = { nombre, descripcion: this.descripcion.trim() };
    if (this.idEditando) {
      this.categoriasService.actualizar(this.idEditando, datos);
      this.notificacion.mostrar(`La categoría "${nombre}" se actualizó.`);
    } else {
      this.categoriasService.agregar(datos);
      this.notificacion.mostrar(`La categoría "${nombre}" se añadió.`);
    }
    form.resetForm();
    this.idEditando = null;
  }

  editar(categoria: Categoria): void {
    this.idEditando = categoria._id;
    this.nombre = categoria.nombre;
    this.descripcion = categoria.descripcion;
    this.nombreRepetido = false;
  }

  cancelar(form: NgForm): void {
    form.resetForm();
    this.idEditando = null;
    this.nombreRepetido = false;
  }

  pedirEliminar(categoria: Categoria): void {
    // No se permite dejar productos sin categoría
    if (this.productosEn(categoria._id) > 0) {
      this.notificacion.mostrar('No puedes eliminar una categoría que todavía tiene productos.', 'error');
      return;
    }
    this.categoriaPorEliminar = categoria;
  }

  confirmarEliminar(): void {
    if (!this.categoriaPorEliminar) return;
    this.categoriasService.eliminar(this.categoriaPorEliminar._id);
    this.notificacion.mostrar(`La categoría "${this.categoriaPorEliminar.nombre}" se eliminó.`, 'info');
    this.categoriaPorEliminar = null;
  }
}
