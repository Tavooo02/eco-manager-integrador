const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Configuraciones iniciales
app.use(express.json());
app.use(cors());

// Conexión a MongoDB (Asegúrate de tener MongoDB Compass abierto)
mongoose.connect('mongodb://127.0.0.1:27017/proyecto_integrador')
    .then(() => console.log("Conectado a MongoDB exitosamente"))
    .catch(err => console.error("Error al conectar a MongoDB:", err));

// Definición del Modelo de Usuario
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// --- HISTORIA DE USUARIO 2: Crear usuario ---
// Programador responsable: Santiago Alcaraz, Gustavo Hoyos [cite: 2]
app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validación: Verificar si el correo ya está en la base de datos [cite: 2]
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "El correo ya está en la base de datos" }); // Mensaje de error [cite: 2]
        }

        const newUser = new User({ email, password });
        await newUser.save();
        res.status(201).json({ message: "Usuario creado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// --- HISTORIA DE USUARIO 1: Login ---
// Programador responsable: Santiago Alcaraz, Gustavo Hoyos [cite: 1]
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validación: Buscar usuario y contraseña correctos [cite: 1]
        const user = await User.findOne({ email, password });

        if (user) {
            // Si es correcto, permite ingresar al menú principal [cite: 1]
            res.status(200).json({ message: "Ingreso al menú principal" });
        } else {
            // De lo contrario, saltar un mensaje de error [cite: 1]
            res.status(401).json({ error: "Usuario o contraseña incorrectos" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// 1. Modelo de datos para persistencia de consumos (Requerimiento 8)
const Consumption = mongoose.model('Consumption', new mongoose.Schema({
  email: String,
  kwh: Number,
  cost: Number,
  carbonFootprint: Number,
  date: { type: Date, default: Date.now }
}));

// 2. Ruta para Entrada de Datos y Motor de Cálculo (Requerimientos 3, 4 y 6)
app.post('/api/save-consumption', async (req, res) => {
  try {
    const { email, kwh, cost } = req.body;

    // Conversor de impacto ambiental (Factor de emisión Colombia) [cite: 6]
    // Se calcula la huella de carbono basándose en los kWh [cite: 6]
    const carbonFootprint = (kwh * 0.126).toFixed(2); 

    // Motor de cálculo: Escenario eficiente (estimación de ahorro del 10%) [cite: 4]
    const savingPotential = (kwh * 0.10).toFixed(2);

    const newRecord = new Consumption({ 
      email, 
      kwh, 
      cost, 
      carbonFootprint 
    });

    await newRecord.save();

    res.json({ 
      message: "Datos procesados y guardados exitosamente",
      footprint: carbonFootprint,
      savingPotential: savingPotential
    });
  } catch (error) {
    res.status(500).json({ error: "Error al procesar los datos energéticos" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});