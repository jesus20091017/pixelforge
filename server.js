require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);

let db;

async function conectar() {
    await client.connect();
    db = client.db("pixelforge");
    console.log("MongoDB conectado");
}

conectar();

app.post("/producto", async (req, res) => {
    const producto = req.body;

    console.log(producto); // Para verificar que llegan los datos

    await db.collection("productos").insertOne(producto);

    res.json({
        mensaje: "Producto guardado"
    });
});

app.listen(3000, () => {
    console.log("Servidor iniciado en puerto 3000");
});