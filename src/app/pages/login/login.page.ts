import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificacionService } from '../../services/notificacion.service';

// Formulario basado en plantilla (Template Form) con ngModel.
@Component({
  selector: 'app-login-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css',
})
export class LoginPage {
  public credencialesInvalidas: boolean = false;
  public mostrarContrasena: boolean = false;

  constructor(
    private authService: AuthService,
    private notificacion: NotificacionService,
    private router: Router,
  ) {
    // Si ya hay sesión no tiene sentido mostrar el login
    if (this.authService.estaAutenticado) {
      this.router.navigate(['/']);
    }
  }

  iniciarSesion(form: NgForm): void {
    this.credencialesInvalidas = false;
    if (form.invalid) return;

    const exito = this.authService.iniciarSesion(form.value.correo, form.value.contrasena);
    if (!exito) {
      this.credencialesInvalidas = true;
      return;
    }

    this.notificacion.mostrar(`¡Hola, ${this.authService.usuarioActual?.nombre}!`);

    // Administrador -> panel; cliente -> donde se había quedado o al catálogo
    if (this.authService.esAdmin) {
      this.router.navigate(['/admin']);
    } else {
      const destino = this.authService.rutaPendiente ?? '/catalogo';
      this.authService.rutaPendiente = null;
      this.router.navigateByUrl(destino);
    }
  }

  // Atajo para la demostración: llena el formulario con una cuenta de prueba
  usarCuentaDemo(form: NgForm, tipo: 'cliente' | 'admin'): void {
    form.setValue({
      correo: tipo === 'cliente' ? 'cliente@tecnostore.mx' : 'admin@tecnostore.mx',
      contrasena: tipo === 'cliente' ? 'cliente123' : 'admin1234',
    });
  }
}
