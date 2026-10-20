import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { Notificacion, NotificacionService } from './services/notificacion.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  constructor(private notificacionService: NotificacionService) {}

  public get notificacion(): Notificacion | null {
    return this.notificacionService.actual;
  }

  cerrarNotificacion(): void {
    this.notificacionService.cerrar();
  }
}
