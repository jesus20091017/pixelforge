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
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "practica.html"));
});

// ===== MONGO =====
let db;

async function conectarMongo() {
    try {
        const client = new MongoClient(process.env.MONGO_URI);

        await client.connect();
        db = client.db("pixelforge");

        console.log("MongoDB conectado");
    } catch (error) {
        console.error("Error conectando MongoDB:", error);
    }
}

conectarMongo();

// ===== API =====
app.post("/producto", async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({
                mensaje: "MongoDB no conectado"
            });
        }

        const producto = req.body;

        const result = await db
            .collection("productos")
            .insertOne(producto);

        res.json({
            mensaje: "Producto guardado",
            id: result.insertedId
        });

    } catch (error) {
        console.error("Error en /producto:", error);

        res.status(500).json({
            mensaje: "Error en el servidor"
        });
    }
});

// ===== INICIAR SERVIDOR =====
app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
});