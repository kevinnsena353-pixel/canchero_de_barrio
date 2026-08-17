# CANCHERO — Backend inicial

Incluye Node.js + Express + PostgreSQL + API de pedidos + panel `/admin`.

## Arranque
1. Instala Node.js 20+ y PostgreSQL.
2. Crea una base llamada `canchero`.
3. Ejecuta `db/schema.sql`.
4. Copia `.env.example` a `.env` y configura `DATABASE_URL` y `ADMIN_TOKEN`.
5. Ejecuta `npm install`.
6. Ejecuta `npm run dev`.

API: `http://localhost:3000`
Panel: `http://localhost:3000/admin`

El endpoint `POST /api/orders` recibe cliente, dirección y todos los productos del carrito. Guarda también talla, color, prenda y diseño de los personalizados.

Todavía NO se conecta Wompi. Primero vamos a comprobar pedidos y panel; después añadimos Wompi y finalmente notificaciones.

Nunca pongas la llave privada de Wompi en el frontend.
