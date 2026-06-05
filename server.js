require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// ===== FRONTEND =====
// Sirve carpeta public
app.use(express.static(path.join(__dirname, "public")));

// Si NO quieres renombrar tu archivo, usa esto:
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "práctica.html"));
});

// ===== MONGO =====
const client = new MongoClient(process.env.MONGO_URI);
let db;

async function conectarMongo() {
    try {
        await client.connect();
        db = client.db("pixelforge");
        console.log("MongoDB conectado");

        // SOLO levanta servidor si Mongo conecta
        app.listen(PORT, () => {
            console.log(`Servidor iniciado en puerto ${PORT}`);
        });

    } catch (error) {
        console.log("Error conectando MongoDB:", error);
    }
}

conectarMongo();

// ===== API =====
app.post("/producto", async (req, res) => {
    try {
        const producto = req.body;

        console.log("Producto recibido:", producto);

        const result = await db.collection("productos").insertOne(producto);

        res.json({
            mensaje: "Producto guardado",
            id: result.insertedId
        });

    } catch (error) {
        console.log("Error en /producto:", error);
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
});