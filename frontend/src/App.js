import React, { useState, useEffect } from 'react';
import './index.css';

// --- 1. COMPONENTE: INICIO (Estilo SaaS Profesional) ---
const Home = ({ setView }) => (
  <div className="landing-wrapper">
    <nav className="navbar">
      <div className="nav-left"><h1 className="logo">EcoManager</h1></div>
      <div className="nav-btns">
        <button onClick={() => setView('login')} className="link-text">Iniciar Sesión</button>
        <button onClick={() => setView('register')} className="cta-navbar">Registrarse Gratis</button>
      </div>
    </nav>
    
    {/* Sección Principal (Hero) */}
    <header className="hero-section">
      <div className="hero-content">
        <h2 className="hero-badge">PLATAFORMA DE SOSTENIBILIDAD DOMÉSTICA</h2>
        <h1 className="hero-main-text">Transforma tu consumo eléctrico en acción climática.</h1>
        <p className="hero-subtext">
          EcoManager es el sistema integral que te permite registrar tus facturas, calcular tu huella de carbono exacta y descubrir tu potencial de ahorro real. Analiza tus datos y toma el control de tu energía.
        </p>
        <div className="hero-actions">
          <button onClick={() => setView('register')} className="btn-blue btn-large">Comenzar Ahora</button>
          <button onClick={() => setView('login')} className="btn-outline btn-large">Ir al Dashboard</button>
        </div>
      </div>
    </header>

    {/* Sección de Características (Lo que le ofrecemos al usuario) */}
    <section className="features-section">
      <div className="section-header">
        <h2>Todo lo que necesitas para gestionar tu eficiencia</h2>
        <p>Herramientas diseñadas para darte visibilidad total sobre tu impacto ambiental y tu economía del hogar.</p>
      </div>
      
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Monitoreo de Consumo</h3>
          <p>Registra el valor de tu factura y los kilovatios-hora (kWh) consumidos mensualmente. Mantén un historial estructurado para analizar tus picos de consumo a lo largo del tiempo.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🌍</div>
          <h3>Conversor de Impacto</h3>
          <p>Traducimos tu consumo eléctrico a emisiones de CO2 utilizando factores de emisión estandarizados. Conoce exactamente cuál es tu huella de carbono generada por la red eléctrica.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📉</div>
          <h3>Proyección de Ahorro</h3>
          <p>Nuestro motor de cálculo procesa tus datos para establecer escenarios eficientes, proyectando metas de ahorro viables para reducir tanto tus emisiones como el costo económico.</p>
        </div>
      </div>
    </section>

    {/* Llamado a la acción final */}
    <section className="bottom-cta">
      <h2>¿Listo para optimizar los recursos de tu hogar?</h2>
      <button onClick={() => setView('register')} className="btn-blue btn-large" style={{marginTop: '20px'}}>Crear cuenta gratuita</button>
    </section>
    
    <footer className="footer-simple">
      <p>© 2026 EcoManager. Todos los derechos reservados.</p>
    </footer>
  </div>
);

// --- 2. COMPONENTE: DASHBOARD ---
const Dashboard = ({ setView, userEmail }) => {
  const [loading, setLoading] = useState(true);
  const [kwh, setKwh] = useState('');
  const [cost, setCost] = useState('');
  const [resultados, setResultados] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); 
    return () => clearTimeout(timer);
  }, []);

  const handleCalcularYGuardar = async () => {
    if (!kwh || !cost) {
      alert("Por favor ingrese ambos valores.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/save-consumption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, kwh: Number(kwh), cost: Number(cost) })
      });
      const data = await response.json();
      
      if (response.ok) {
        setResultados({
          footprint: data.footprint,
          savingPotential: data.savingPotential
        });
        alert(data.message); 
      } else {
        alert("Error al guardar el registro.");
      }
    } catch (error) {
      alert("Error al conectar con el motor de cálculo");
    }
  };

  if (loading) {
    return (
      <div className="auth-full">
        <div className="loader-container">
          <div className="spinner"></div>
          <p>Generando resultados...</p>
          <small>Tiempo de recuperación estimado: 2 segundos</small>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <nav className="navbar">
        <div className="nav-left">
          <h1 className="logo" style={{color: '#4ade80'}}>EcoManager</h1>
        </div>
        <button onClick={() => setView('home')} className="link-text">Cerrar Sesión</button>
      </nav>
      
      <div className="auth-full" style={{ alignItems: 'flex-start', paddingTop: '60px' }}>
        <div className="dashboard-content" style={{ width: '100%', maxWidth: '600px' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '10px' }}>Gestión de Eficiencia Energética</h2>
          <p style={{ color: '#ababab', marginBottom: '30px' }}>
            Bienvenido, <strong>{userEmail}</strong>. Monitorea tu consumo actual.
          </p>

          <div className="auth-box" style={{ width: '100%', textAlign: 'left' }}>
            <h3 style={{ color: '#4ade80', marginTop: '0', marginBottom: '20px' }}>Registro de Factura (Colombia)</h3>
            
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#ababab' }}>Consumo del mes (kWh):</label>
            <input 
              type="number" 
              placeholder="Ej: 150" 
              className="input-modern" 
              value={kwh} 
              onChange={(e) => setKwh(e.target.value)} 
              style={{ marginBottom: '15px' }}
            />

            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#ababab' }}>Valor total de la factura (COP):</label>
            <input 
              type="number" 
              placeholder="Ej: 120000" 
              className="input-modern" 
              value={cost} 
              onChange={(e) => setCost(e.target.value)} 
              style={{ marginBottom: '20px' }}
            />

            <button 
              onClick={handleCalcularYGuardar} 
              className="btn-blue-full" 
              style={{ backgroundColor: '#2e7d32' }}
            >
              Calcular y Guardar Registro
            </button>
            
            {resultados && (
              <div className="result-card" style={{ marginTop: '25px', borderColor: '#4ade80' }}>
                <h4>Resultados del Análisis:</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: '#ababab' }}>Huella de Carbono</span>
                    <p className="impact-value" style={{ color: '#ef4444', fontSize: '22px' }}>{resultados.footprint} kg CO2</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#ababab' }}>Meta de Ahorro (10%)</span>
                    <p className="impact-value" style={{ color: '#4ade80', fontSize: '22px' }}>{resultados.savingPotential} kWh</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTES AUTH (Login / Register) ---
const Login = ({ setView, formData, handleChange, handleAuth }) => (
  <div className="auth-full">
    <div className="auth-box">
      <h2>Bienvenido</h2>
      <input name="email" type="email" placeholder="Correo electrónico" className="input-modern" value={formData.email} onChange={handleChange} />
      <input name="password" type="password" placeholder="Contraseña" className="input-modern" value={formData.password} onChange={handleChange} />
      <button onClick={() => handleAuth('login')} className="btn-blue-full">Entrar</button>
      <p onClick={() => setView('home')} className="back-home">← Volver al inicio</p>
    </div>
  </div>
);

const Register = ({ setView, formData, handleChange, handleAuth }) => (
  <div className="auth-full">
    <div className="auth-box">
      <h2>Crear Cuenta</h2>
      <input name="email" type="email" placeholder="Correo electrónico" className="input-modern" value={formData.email} onChange={handleChange} />
      <input name="password" type="password" placeholder="Contraseña" className="input-modern" value={formData.password} onChange={handleChange} />
      <button onClick={() => handleAuth('register')} className="btn-blue-full">Registrarse</button>
      <p onClick={() => setView('home')} className="back-home">← Volver al inicio</p>
    </div>
  </div>
);

// --- COMPONENTE PRINCIPAL ---
function App() {
  const [view, setView] = useState('home');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAuth = async (endpoint) => {
    try {
      const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        if(endpoint === 'register') {
          alert("Usuario creado exitosamente. Ya puedes iniciar sesión.");
          setView('login');
        } else {
          setView('dashboard'); 
        }
      } else {
        alert("Error: " + (data.error || data.message));
      }
    } catch (error) {
      alert("Error de conexión con el servidor.");
    }
  };

  return (
    <div className="App">
      {view === 'home' && <Home setView={setView} />}
      {view === 'login' && <Login setView={setView} formData={formData} handleChange={handleChange} handleAuth={handleAuth} />}
      {view === 'register' && <Register setView={setView} formData={formData} handleChange={handleChange} handleAuth={handleAuth} />}
      {view === 'dashboard' && <Dashboard setView={setView} userEmail={formData.email} />}
    </div>
  );
}

export default App;