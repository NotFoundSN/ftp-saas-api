import express from "express";
import config from "./config/constants/indes.js"
import mainRoutes from "./routes/main.router.js";

const app = express();
const puerto = config.PORT;

//  recibir datos en formato json
app.use(express.json());
// recibir datos de la url y los convierte en objeto en req.body
app.use(express.urlencoded({ extended: true }));

app.use("/", mainRoutes);

app.use("*", (req, res) => {
  res.status(404).json({
    // quiero ver la ruta que se esta llamando
    method: req.method,
    // quiero ver la ruta que se esta llamando
    // req.originalUrl es la url completa que se esta llamando
    // req.path es la ruta sin el dominio
    originalUrl: req.originalUrl,
    path: req.path,
    error: "Ruta no encontrada",
  });
});

// inicio el servidor
app.listen(puerto, () => {
  console.log(`servidor escuchando en http://localhost:${puerto}`);
});