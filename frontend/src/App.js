import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [logueado, setLogueado] = useState(false);

  // Historia de Usuario 2: Crear usuario 
  // Programadores: Santiago Alcaraz, Gustavo Hoyos 
  const handleRegister = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/register', { email, password });
      setMensaje(res.data.message);
    } catch (err) {
      // Si el correo ya está en la base de datos, salta el mensaje de error 
      setMensaje(err.response.data.error); 
    }
  };

  // Historia de Usuario 1: Login 
  // Programadores: Santiago Alcaraz, Gustavo Hoyos 
  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/login', { email, password });
      setMensaje(res.data.message);
      // Si la validación es exitosa, permite ingresar al menú principal 
      setLogueado(true); 
    } catch (err) {
      // De lo contrario, salta un mensaje de error 
      setMensaje(err.response.data.error); 
      setLogueado(false);
    }
  };

  // Interfaz del Menú Principal (Validación exitosa Historia 1) 
  if (logueado) {
  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <span style={styles.logo}>⚡ EcoManager</span>
        <button onClick={() => setLogueado(false)} style={styles.logoutBtn}>Cerrar Sesión</button>
      </nav>

      <div style={styles.main}>
        <header style={styles.header}>
          <h2>Gestión de Eficiencia Energética</h2>
          <p>Bienvenido, <strong>{email}</strong>. Monitorea tu consumo actual.</p>
        </header>

        <section style={styles.card}>
          <h3 style={styles.cardTitle}>Registro de Factura (Colombia)</h3>
          <div style={styles.formGroup}>
            <label style={styles.label}>Consumo del mes (kWh):</label>
            <input type="number" id="kwh" placeholder="Ej: 150" style={styles.input} />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Valor total de la factura (COP):</label>
            <input type="number" id="cost" placeholder="Ej: 120000" style={styles.input} />
          </div>

          <button onClick={async () => {
            const kwh = document.getElementById('kwh').value;
            const cost = document.getElementById('cost').value;
            try {
              const res = await axios.post('http://localhost:5000/api/save-consumption', { email, kwh, cost });
              alert(`¡Datos Guardados!\nImpacto Ambiental: ${res.data.footprint} kg CO2\nAhorro Potencial: ${res.data.savingPotential} kWh`);
            } catch (err) {
              alert("Error de conexión");
            }
          }} style={styles.primaryBtn}>
            Calcular y Guardar Registro
          </button>
        </section>
      </div>
    </div>
  );
}

  // Interfaz de Autenticación (Login y Registro)
  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <span style={styles.logo}>⚡ EcoManager</span>
      </nav>
      <div style={{...styles.main, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh'}}>
        <div style={{...styles.card, width: '100%', maxWidth: '400px'}}>
          <h2 style={{...styles.cardTitle, textAlign: 'center', fontSize: '1.8rem'}}>Bienvenido</h2>
          <p style={{textAlign: 'center', color: '#666', marginBottom: '25px'}}>Ingresa tus credenciales para gestionar tu eficiencia energética.</p>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Correo Electrónico</label>
            <input 
              type="email" 
              placeholder="nombre@ejemplo.com" 
              onChange={(e) => setEmail(e.target.value)} 
              style={styles.input} 
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Contraseña</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              onChange={(e) => setPassword(e.target.value)} 
              style={styles.input} 
            />
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px'}}>
            <button onClick={handleLogin} style={styles.primaryBtn}>
              Iniciar Sesión
            </button>
            <button onClick={handleRegister} style={{...styles.primaryBtn, backgroundColor: '#6c757d'}}>
              Crear Cuenta Nueva
            </button>
          </div>

          {mensaje && (
            <div style={{
              marginTop: '20px', 
              padding: '10px', 
              borderRadius: '6px', 
              backgroundColor: '#ffebee', 
              color: '#c62828', 
              textAlign: 'center',
              fontSize: '0.9rem',
              border: '1px solid #ffcdd2'
            }}>
              {mensaje}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#f4f7f6',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 50px',
    backgroundColor: '#1a2e35',
    color: 'white',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  logo: { fontSize: '1.5rem', fontWeight: 'bold', color: '#4caf50' },
  logoutBtn: { backgroundColor: 'transparent', color: 'white', border: '1px solid white', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer' },
  main: { padding: '40px 10%' },
  header: { marginBottom: '30px', color: '#333' },
  card: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    maxWidth: '500px',
  },
  cardTitle: { marginTop: 0, marginBottom: '20px', color: '#2e7d32' },
  formGroup: { marginBottom: '15px' },
  label: { display: 'block', marginBottom: '5px', fontWeight: '600', color: '#555' },
  input: { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '1rem' },
  primaryBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#2e7d32',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background 0.3s',
  }
};

export default App;