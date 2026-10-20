import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

// Anima un número desde 0 hasta su valor final cuando aparece en pantalla.
// Uso: <span [appCountUp]="14"></span>  o con decimales: <span [appCountUp]="4.6" [decimales]="1"></span>
@Directive({
  selector: '[appCountUp]',
})
export class CountUpDirective implements OnInit, OnDestroy {
  @Input({ required: true }) public appCountUp: number = 0;
  @Input() public decimales: number = 0;
  @Input() public duracion: number = 1400;

  private observer?: IntersectionObserver;
  private frame = 0;

  constructor(private elemento: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const reducirMovimiento = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reducirMovimiento || typeof IntersectionObserver === 'undefined') {
      this.escribir(this.appCountUp);
      return;
    }

    this.escribir(0);
    this.observer = new IntersectionObserver(entradas => {
      if (entradas.some(e => e.isIntersecting)) {
        this.observer?.disconnect();
        this.animar();
      }
    });
    this.observer.observe(this.elemento.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    cancelAnimationFrame(this.frame);
  }

  private animar(): void {
    const inicio = performance.now();
    const paso = (ahora: number) => {
      const progreso = Math.min((ahora - inicio) / this.duracion, 1);
      const suavizado = 1 - Math.pow(1 - progreso, 3); // ease-out cúbico
      this.escribir(this.appCountUp * suavizado);
      if (progreso < 1) this.frame = requestAnimationFrame(paso);
    };
    this.frame = requestAnimationFrame(paso);
  }

  private escribir(valor: number): void {
    this.elemento.nativeElement.textContent = valor.toFixed(this.decimales);
  }
}
