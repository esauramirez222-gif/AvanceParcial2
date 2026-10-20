import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Resena } from '../../../interfaces/resena.interface';
import { AuthService } from '../../../services/auth.service';
import { NotificacionService } from '../../../services/notificacion.service';
import { ProductosService } from '../../../services/productos.service';
import { ResenasService } from '../../../services/resenas.service';
import { AdminNavComponent } from '../../../components/admin-nav/admin-nav.component';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { StarRatingComponent } from '../../../components/star-rating/star-rating.component';

// Moderación: el administrador elimina reseñas que incumplan las políticas del sitio.
@Component({
  selector: 'app-admin-resenas-page',
  imports: [DatePipe, RouterLink, AdminNavComponent, ConfirmDialogComponent, StarRatingComponent],
  templateUrl: './admin-resenas.page.html',
  styleUrl: './admin-resenas.page.css',
})
export class AdminResenasPage {
  public resenaPorEliminar: Resena | null = null;
  public filtroCalificacion: number = 0; // 0 = todas

  constructor(
    private resenasService: ResenasService,
    private productosService: ProductosService,
    private authService: AuthService,
    private notificacion: NotificacionService,
    private router: Router,
  ) {
    if (!this.authService.esAdmin) {
      this.router.navigate(['/login']);
    }
  }

  public get resenas(): Resena[] {
    const todas = this.resenasService.resenas;
    return this.filtroCalificacion === 0 ? todas : todas.filter(r => r.calificacion === this.filtroCalificacion);
  }

  public calificaciones: number[] = [5, 4, 3, 2, 1];

  autor(id: string): string {
    return this.authService.nombreDeUsuario(id);
  }

  producto(id: string): string {
    return this.productosService.obtenerPorId(id)?.nombre ?? 'Producto eliminado';
  }

  confirmarEliminar(): void {
    if (!this.resenaPorEliminar) return;
    this.resenasService.eliminar(this.resenaPorEliminar._id);
    this.notificacion.mostrar('La reseña fue eliminada por moderación.', 'info');
    this.resenaPorEliminar = null;
  }
}
