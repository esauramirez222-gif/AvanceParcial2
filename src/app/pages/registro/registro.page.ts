import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificacionService } from '../../services/notificacion.service';

// Validador del formulario completo: la confirmación debe ser igual a la contraseña
export function contrasenasIguales(grupo: AbstractControl): ValidationErrors | null {
  const contrasena = grupo.get('contrasena')?.value;
  const confirmacion = grupo.get('confirmacion')?.value;
  return contrasena && confirmacion && contrasena !== confirmacion ? { noCoinciden: true } : null;
}

// Formulario reactivo: se define y valida desde TypeScript.
@Component({
  selector: 'app-registro-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.page.html',
})
export class RegistroPage {
  public form: FormGroup;
  public formSubmitted: boolean = false;
  public correoRepetido: boolean = false;

  constructor(
    private authService: AuthService,
    private notificacion: NotificacionService,
    private router: Router,
  ) {
    this.form = new FormGroup(
      {
        nombre: new FormControl('', [Validators.required, Validators.minLength(2)]),
        apellidos: new FormControl('', [Validators.required, Validators.minLength(2)]),
        correo: new FormControl('', [Validators.required, Validators.email]),
        contrasena: new FormControl('', [Validators.required, Validators.minLength(8)]),
        confirmacion: new FormControl('', [Validators.required]),
      },
      { validators: contrasenasIguales }
    );
  }

  // Indica si un campo debe mostrarse en rojo
  invalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!control && control.invalid && (control.touched || this.formSubmitted);
  }

  public get confirmacionNoCoincide(): boolean {
    return this.form.hasError('noCoinciden') && (this.form.get('confirmacion')!.touched || this.formSubmitted);
  }

  registrar(): void {
    this.formSubmitted = true;
    this.correoRepetido = false;
    if (this.form.invalid) return;

    if (this.authService.existeCorreo(this.form.value.correo)) {
      this.correoRepetido = true;
      return;
    }

    this.authService.registrar({
      nombre: this.form.value.nombre,
      apellidos: this.form.value.apellidos,
      correo: this.form.value.correo,
      contrasena: this.form.value.contrasena,
    });
    this.notificacion.mostrar('¡Tu cuenta se creó! Ya puedes comprar en TecnoStore.');
    this.router.navigate(['/catalogo']);
  }
}
