import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from '../../interfaces/usuario.interface';
import { AuthService } from '../../services/auth.service';
import { NotificacionService } from '../../services/notificacion.service';

// La nueva contraseña es opcional; si se escribe debe tener 8+ caracteres y coincidir con la confirmación
function validarNuevaContrasena(grupo: AbstractControl): ValidationErrors | null {
  const nueva: string = grupo.get('nuevaContrasena')?.value ?? '';
  const confirmacion: string = grupo.get('confirmacion')?.value ?? '';
  if (!nueva && !confirmacion) return null;
  if (nueva.length < 8) return { muyCorta: true };
  if (nueva !== confirmacion) return { noCoinciden: true };
  return null;
}

@Component({
  selector: 'app-mi-cuenta-page',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './mi-cuenta.page.html',
  styleUrl: './mi-cuenta.page.css',
})
export class MiCuentaPage {
  public form: FormGroup;
  public formSubmitted: boolean = false;
  public correoRepetido: boolean = false;

  constructor(
    private authService: AuthService,
    private notificacion: NotificacionService,
    private router: Router,
  ) {
    const u = this.authService.usuarioActual;

    this.form = new FormGroup({
      nombre: new FormControl(u?.nombre ?? '', [Validators.required]),
      apellidos: new FormControl(u?.apellidos ?? '', [Validators.required]),
      correo: new FormControl(u?.correo ?? '', [Validators.required, Validators.email]),
      // Grupo anidado para la dirección de envío
      direccion: new FormGroup({
        calle: new FormControl(u?.direccion.calle ?? '', [Validators.required]),
        numero: new FormControl(u?.direccion.numero ?? '', [Validators.required]),
        colonia: new FormControl(u?.direccion.colonia ?? '', [Validators.required]),
        codigoPostal: new FormControl(u?.direccion.codigoPostal ?? '', [Validators.required, Validators.pattern(/^\d{5}$/)]),
        ciudad: new FormControl(u?.direccion.ciudad ?? '', [Validators.required]),
        estado: new FormControl(u?.direccion.estado ?? '', [Validators.required]),
        pais: new FormControl(u?.direccion.pais || 'México', [Validators.required]),
      }),
      seguridad: new FormGroup(
        {
          nuevaContrasena: new FormControl(''),
          confirmacion: new FormControl(''),
        },
        { validators: validarNuevaContrasena }
      ),
    });

    if (!this.authService.esCliente) {
      this.authService.rutaPendiente = '/mi-cuenta';
      this.router.navigate([this.authService.esAdmin ? '/admin' : '/login']);
    }
  }

  public get usuario(): Usuario | null {
    return this.authService.usuarioActual;
  }

  invalido(ruta: string): boolean {
    const control = this.form.get(ruta);
    return !!control && control.invalid && (control.touched || this.formSubmitted);
  }

  public get errorSeguridad(): string {
    const grupo = this.form.get('seguridad')!;
    if (!(grupo.touched || this.formSubmitted)) return '';
    if (grupo.hasError('muyCorta')) return 'La nueva contraseña debe tener 8 caracteres o más.';
    if (grupo.hasError('noCoinciden')) return 'Las contraseñas no coinciden.';
    return '';
  }

  guardar(): void {
    this.formSubmitted = true;
    this.correoRepetido = false;
    if (this.form.invalid) {
      this.notificacion.mostrar('Revisa los campos marcados en rojo.', 'error');
      return;
    }

    const valores = this.form.value;
    if (this.authService.existeCorreo(valores.correo, this.usuario?._id)) {
      this.correoRepetido = true;
      return;
    }

    this.authService.actualizarCuenta({
      nombre: valores.nombre.trim(),
      apellidos: valores.apellidos.trim(),
      correo: valores.correo.trim().toLowerCase(),
      direccion: valores.direccion,
      // Solo se cambia la contraseña si se escribió una nueva
      ...(valores.seguridad.nuevaContrasena ? { contrasena: valores.seguridad.nuevaContrasena } : {}),
    });

    this.form.get('seguridad')!.reset({ nuevaContrasena: '', confirmacion: '' });
    this.formSubmitted = false;
    this.form.markAsUntouched();
    this.notificacion.mostrar('Tus datos se guardaron correctamente.');
  }
}
