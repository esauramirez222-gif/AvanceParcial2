import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  styleUrl: './not-found.page.css',
  template: `
    <div class="container my-5">
      <div class="ts-empty">
        <span class="display-1 fw-bold ts-404">404</span>
        <h1 class="h4">Página no encontrada</h1>
        <p>La dirección que buscas no existe o fue movida.</p>
        <a routerLink="/" class="btn btn-ts">Volver al inicio</a>
      </div>
    </div>
  `,
})
export class NotFoundPage {}
