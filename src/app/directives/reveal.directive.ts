import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

// Hace que un elemento aparezca suavemente cuando entra en pantalla al hacer scroll.
// Uso: <div appReveal></div>  o con retraso en ms: <div [appReveal]="120"></div>
// Los estilos (.ts-reveal / .is-visible) están en src/styles.css.
@Directive({
  selector: '[appReveal]',
  host: { class: 'ts-reveal' },
})
export class RevealDirective implements OnInit, OnDestroy {
  @Input() public appReveal: number | '' = 0;

  private observer?: IntersectionObserver;

  constructor(private elemento: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const el = this.elemento.nativeElement;
    el.style.setProperty('--ts-delay', `${Number(this.appReveal) || 0}ms`);

    // Navegadores sin soporte: se muestra de inmediato
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible');
      return;
    }

    this.observer = new IntersectionObserver(
      entradas => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) {
            el.classList.add('is-visible');
            this.observer?.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    this.observer.observe(el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
