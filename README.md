# TecnoStore — Frontend en Angular

Tienda en línea de accesorios tecnológicos. Proyecto de la materia **Aplicaciones Web Escalables** (UASLP).
Autor: Jaziel Esau Lara Ramirez.

Este avance contiene **todas las pantallas** de la propuesta, hechas en Angular 21 (componentes standalone).
Los datos viven en servicios de Angular (en memoria), por lo que al recargar el navegador todo regresa a los datos de prueba.
Cuando se construya la API con Node/Express/MongoDB, solo hay que cambiar el interior de los servicios por peticiones `HttpClient`.

## Cómo ejecutarlo

Requisitos: Node.js 20.19+ o 22.12+.

```bash
npm install
npm start          # o: ng serve
```

Abrir http://localhost:4200

### Cuentas de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Cliente | cliente@tecnostore.mx | cliente123 |
| Administrador | admin@tecnostore.mx | admin1234 |

En la pantalla de inicio de sesión hay botones para llenar estas cuentas automáticamente.

## Pantallas (rutas)

| Ruta | Pantalla | Quién la ve |
|---|---|---|
| `/` | Home: banner, categorías y productos destacados | Todos |
| `/catalogo` | Catálogo con búsqueda, filtro por categoría y orden | Todos |
| `/producto/:id` | Detalle, añadir al pedido y reseñas | Todos (comprar y reseñar: cliente) |
| `/login` | Inicio de sesión (con botón a registro) | No autenticado |
| `/registro` | Registro de usuario | No autenticado |
| `/carrito` | Carrito: subtotal, envío, total y finalizar compra | Cliente |
| `/mis-pedidos` | Historial de pedidos y su estado | Cliente |
| `/mi-cuenta` | Datos personales, dirección de envío y contraseña | Cliente |
| `/admin/productos` | Gestión de catálogo (añadir, editar, eliminar) | Administrador |
| `/admin/categorias` | Gestión de categorías | Administrador |
| `/admin/pedidos` | Consultar pedidos y cambiar estado | Administrador |
| `/admin/resenas` | Moderación de reseñas | Administrador |
| `/not-found` y `**` | Página no encontrada | Todos |

## Estructura

```
src/app/
├── interfaces/   Usuario, Categoria, Producto, Pedido, Resena, ItemCarrito (modelo de datos de la propuesta)
├── services/     auth, categorias, productos, carrito, pedidos, resenas, notificacion
├── components/   header, footer, product-card, star-rating, confirm-dialog, admin-nav
├── pages/        una carpeta por pantalla (admin/ agrupa las del administrador)
├── utils/        generar-id
├── app.routes.ts rutas de la aplicación
└── app.config.ts router, idioma es-MX
public/img/productos/  imágenes de los productos de prueba
```

## Organización de los estilos (CSS)

- `src/styles.css` (global): la paleta de colores (`--ts-*`) y las clases que usan **varias** pantallas (`ts-card`, `btn-ts`, `ts-empty`, colores de estado de pedido, etc.).
- `*.component.css` / `*.page.css`: lo que usa **solo** ese componente (por ejemplo el banner de Home o las tarjetas de producto). Angular encapsula estos estilos, así que no afectan a otras pantallas.
- Bootstrap y Bootstrap Icons se cargan como estilos globales desde `angular.json`.

## Temas del curso y dónde se usan

| Tema | Dónde |
|---|---|
| Componentes, propiedades y métodos | Todas las pantallas y `components/` |
| Señales (`signal`, `computed`) | Servicios; `carrito.service.ts` calcula subtotal, envío y total con `computed` |
| `@if` / `@for` | Todas las plantillas HTML |
| Interfaces | `interfaces/` |
| `@Input()` | `product-card`, `star-rating`, `confirm-dialog` |
| `@Output()` + `EventEmitter` | `star-rating` (calificación elegida), `confirm-dialog` (confirmar / cancelar) |
| `[ngClass]` y clases condicionales | Filtros del catálogo, estado de pedidos, botones del admin |
| `ngModel` | Búsqueda del catálogo, cantidad del producto, buscador del admin |
| Formularios basados en plantilla | Login, reseñas, categorías |
| Formularios reactivos | Registro, Mi cuenta, producto (admin) |
| Rutas, `routerLink`, `routerLinkActive`, `redirectTo`, `**` | `app.routes.ts`, header, admin-nav |
| Inyección de `Router` | Redirecciones según la sesión y el rol |
| Servicios (`@Injectable({ providedIn: 'root' })`) | `services/` |
| Observables (`subscribe`) | `producto-detalle.page.ts` se suscribe a `paramMap` |

## Reglas de negocio implementadas

- Sin sesión se puede ver Home y el catálogo; al intentar comprar se redirige al login y después se regresa al producto.
- Solo el cliente que compró un producto puede escribir una reseña (una por producto) y puede editarla o eliminarla.
- El administrador puede eliminar cualquier reseña (en el detalle o en Moderación).
- Envío gratis desde $999; si no, cuesta $99.
- Para finalizar la compra el cliente necesita dirección de envío. El pago es simulado y el pedido se crea como "pendiente".
- No se puede agregar al carrito más piezas que el stock. Al comprar se descuenta el stock.
- No se puede eliminar una categoría que todavía tiene productos.
