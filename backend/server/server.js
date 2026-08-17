require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

const ordersRouter = require("./orders");

const app = express();
const PORT = Number(process.env.PORT || 3000);

const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:5500"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Origen no permitido por CORS"));
  },
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false
}));

app.use(helmet({contentSecurityPolicy:false}));
app.use(express.json({limit:"1mb"}));

app.get("/api/health",(req,res)=>
  res.json({ok:true,service:"canchero-backend"})
);

app.use("/api/orders",ordersRouter);

app.use("/admin",express.static(path.join(__dirname,"..","admin")));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Canchero backend escuchando en el puerto ${PORT}`);
});