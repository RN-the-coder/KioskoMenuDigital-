# Barra Payán · Kiosco de autoservicio

Prototipo local en React, TypeScript, Vite, Tailwind CSS, Lucide React y Zustand. No requiere backend ni cuentas.

## Ejecución

Requiere Node.js 20.19+ o 22.12+.

```sh
npm install
npm run dev
```

Abrir la dirección local que muestra Vite (normalmente http://127.0.0.1:5173).

```sh
npm run build
npm test
```

## Flujo

Bienvenida → categorías → detalle y cantidad → carrito → pago → confirmación. El carrito se conserva en localStorage bajo `payan-cart-v2`. Cancelar requiere confirmación. Un nuevo pedido elimina los datos del pedido anterior. Las notas distintas producen líneas separadas. Las cantidades se limitan a 99 por línea.

Tarjeta: simulación con aprobación o rechazo, sin campos bancarios ni cargos. Caja: orden pendiente, sin envío a preparación. La referencia de orden utiliza UUID; solo existe durante esta demostración, no se envía a un restaurante. Los botones se bloquean durante la autorización para evitar duplicados.

## Datos y arquitectura

- `src/data/menu.ts`: productos y precios transcritos de la fotografía del menú, categorías, imágenes intercambiables y pendientes.
- `src/types`: modelos de productos, tamaños, líneas, órdenes y estados.
- `src/store/cart.ts`: carrito persistente con Zustand.
- `src/utils/order.ts`: cálculo de totales y configuración fiscal.
- `src/services/payment.ts`: autorización simulada, punto de sustitución por una integración certificada.
- `src/components`: controles reutilizables y fotografías con fallback local.
- `src/App.tsx`: pantallas y navegación del prototipo.

Las imágenes remotas de Unsplash son ilustrativas y no confirman ingredientes. Si fallan se muestra una ilustración local. Fuentes de Google con alternativas del sistema. Cambiar imágenes en `menu.ts` para usar fotografías oficiales locales.

## Pendientes de validación

Se incorporó la fotografía MenuBarraPayan.jpg. Consulta MENU_VALIDATION.md para la transcripción pendiente: sección inferior de otras bebidas cortada y significado de la columna C de jugos. Natural y con leche se ofrecen como preparaciones; no se inventaron tamaños ni volúmenes. Los ingredientes y extras continúan pendientes de confirmación.

La política fiscal se encuentra en `taxPolicy` y admite `unconfirmed`, `included` y `excluded`. Se mantiene `unconfirmed` con tasa cero: no se presupone que los precios excluyen impuestos. Las tasas de los tests son ejemplos técnicos, no una política atribuida al restaurante.

## Revisión manual

1. Comenzar, agregar dos productos y comprobar cantidad y total.
2. Cambiar categorías y volver; comprobar que el pedido se conserva.
3. Modificar cantidades y eliminar líneas; probar carrito vacío.
4. Recargar con productos y comprobar persistencia.
5. Probar tarjeta rechazada y luego aprobada; comprobar que rechazar conserva el carrito.
6. Crear otro pedido, pagar en caja y comprobar estado pendiente e instrucciones.
7. Comenzar nuevo pedido y verificar limpieza.
8. Cancelar un pedido: probar ambas respuestas.

No hay backend, impresión, terminal, cobros ni preparación de órdenes reales. Antes de uso comercial se necesita integración de catálogo, disponibilidad, política fiscal, órdenes e idempotencia del servidor y terminal certificada.

## Verificación realizada

Compilación de producción verificada con `npm run build`. Pruebas automáticas de cálculo fiscal, carrito persistente y autorización simulada mediante `npm test`. El acceso de automatización a Chrome expiró durante la revisión; el flujo visual completo y las resoluciones táctiles quedan pendientes de revisión manual con los pasos anteriores.
