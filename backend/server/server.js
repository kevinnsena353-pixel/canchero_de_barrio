require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

const ordersRouter = require("./orders");

const app = express();
const PORT = Number(process.env.PORT || 3000);

// Dominios permitidos para acceder al backend
const allowedOrigins = [
  "https://kevinnsena353-pixel.github.io"
];

app.use(cors({
  origin: function(origin, callback) {
    // Permitir peticiones sin Origin (por ejemplo, algunas pruebas directas)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Origen no permitido por CORS"));
  },
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false
}));

app.use(helmet({
  contentSecurityPolicy: false
}));

app.use(express.json({
  limit: "1mb"
}));

// Comprobar que el backend está funcionando
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "canchero-backend"
  });
});

// Pedidos
app.use("/api/orders", ordersRouter);

// Panel administrativo
app.use(
  "/admin",
  express.static(path.join(__dirname, "..", "admin"))
);

// Iniciar servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Canchero backend escuchando en el puerto ${PORT}`);
});