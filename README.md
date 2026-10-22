# 🦺 Plataforma de Evaluación Interactiva CMASS

> **Simulador de Detección de Riesgos, Condiciones y Actos Subestándares en Seguridad y Salud Ocupacional (CMASS)**.

---

## 📌 1. Descripción del Proyecto

Esta plataforma web es una herramienta de capacitación y evaluación práctica para trabajadores, mandos medios y supervisores en materia de **Seguridad e Higiene Laboral / CMASS** (*Condiciones y Medio Ambiente de Trabajo*).

Los evaluadores se autentican mediante su cuenta de **Google**, seleccionan su rol jerárquico dentro de la obra o planta, y deben localizar contra reloj **35 condiciones y actos subestándares** interactuando directamente sobre una lámina técnica de un taller industrial. Los resultados quedan registrados en tiempo real en **Firebase** para clasificaciones y auditoría individual.

---

## 🚀 2. Resumen de Mejoras Realizadas (Versión Actual)

Esta versión incluye una renovación completa de **Diseño (UI)**, **Experiencia de Usuario (UX)** y **Arquitectura de Código**:

1. **Nuevo Sistema de Diseño "Safety Tech"**:
   - Sustitución de la tipografía previa de baja legibilidad por **Inter** (estándar de la industria para aplicaciones web) y **JetBrains Mono** para cronómetros y métricas.
   - Paleta de color corporativa: *Dark Slate* de alto contraste (`#0b0f19`), acentos en **Ámbar de Seguridad** (`#f59e0b`), **Azul Institucional** (`#3b82f6`) y **Verde Esmeralda** (`#10b981`).
   - Componentes construidos con **Glassmorphism sutil** (paneles con desenfoque de fondo y bordes elegantes de 1px).

2. **Reemplazo de Prompts Nativos por Modales Accesibles**:
   - Se eliminaron los molestos cuadros de texto nativos (`prompt()` y `alert()`) del navegador.
   - **Modal de Selección de Rol**: Permite elegir con un clic entre *Principiante* (5 min), *Intermedio* (3 min) o *Avanzado* (1 min), con visualización clara de tiempos y responsabilidades.
   - **Modal de Fin de Partida**: Presenta las estadísticas de la sesión y precarga el nombre del usuario autenticado para guardar con un clic.

3. **HUD Dinámico y Feedback en Tiempo Real**:
   - Identificación del usuario activo con avatar y badge de rol.
   - Cronómetro con advertencia progresiva de color (Verde ➔ Ámbar < 60s ➔ Rojo palpitante < 20s).
   - Barra de progreso horizontal animada de riesgos detectados (0 a 35).
   - Marcadores de impacto con efecto radar (*ping*) y notificaciones flotantes (*toasts*) con el nombre de cada anomalía encontrada.

4. **Clasificación y Podio Top 3**:
   - Tarjetas destacadas de podio para los 3 mejores puntajes de la empresa/obra (🥇 Oro, 🥈 Plata, 🥉 Bronce).
   - Barra de búsqueda interactiva para filtrar por nombre o rol al instante.

5. **Informe Técnico y Descarga de Certificado**:
   - Ficha detallada con cálculo de efectividad porcentual (`%`).
   - Listado comparativo de anomalías detectadas vs omitidas.
   - Botón para **exportar el informe en formato de imagen PNG en alta resolución** mediante la librería `html2canvas`.

---

## 📂 3. Estructura de Archivos del Proyecto

```plaintext
Armando_Applicacion-main/
│
├── index.html                   # Redirección automática a /public/index.html
├── firebase.json                # Configuración de Firebase Hosting y Firestore
├── firestore.rules              # Reglas de seguridad de Firestore
├── firestore.indexes.json       # Índices de Firestore
├── README.md                    # Esta documentación técnica
│
└── public/                      # Raíz pública de la aplicación
    ├── index.html               # Landing page y pantalla de Login con Google
    │
    ├── assets/                  # Hojas de estilo y recursos gráficos
    │   ├── estilos.css          # Sistema de diseño central, variables y layout
    │   ├── messages.css         # Estilos para alertas flotantes y toasts
    │   ├── table.css            # Estilos de la tabla de posiciones y podio
    │   ├── img_riesgo4.png      # Lámina técnica principal de inspección
    │   └── img_riesgo*.jpeg     # Láminas adicionales preparadas para nuevos niveles
    │
    ├── firebase/
    │   └── app_firebase.js      # Conexión Firebase (Auth + Realtime Database)
    │
    ├── js/
    │   ├── app.js               # Mecánica del juego, cronómetro y coordenadas
    │   ├── tabla.js             # Lógica de rankings, podio y buscador
    │   └── descripcion.js       # Auditoría individual y descarga en PNG
    │
    └── pages/
        ├── app.html             # Pantalla del simulador y HUD de inspección
        ├── instrucciones.html   # Guía de observación técnica y roles
        ├── puntos.html          # Tabla de posiciones y clasificaciones
        └── descripcion.html     # Ficha de resultados y reporte del evaluador
```

---

## 🎯 4. Cómo Funciona la Detección de Riesgos (Lógica y Coordenadas)

En [`public/js/app.js`](file:///c:/laragon/www/Armando_Applicacion-main/public/js/app.js), cada condición insegura está registrada como un objeto con coordenadas porcentuales relativas al tamaño de la imagen:

```javascript
{ nombre: "Escalera quebrada y atada", x: 35.6, y: 38.7, encontrada: false, puntos: 10 }
```

### Cálculo de clic relativo

```javascript
let rect = imagen.getBoundingClientRect();
let x = ((e.clientX - rect.left) / rect.width) * 100;
let y = ((e.clientY - rect.top) / rect.height) * 100;
```

### Radio de tolerancia

Se usa la distancia euclidiana entre el clic del evaluador `(x, y)` y el centro del riesgo `(dif.x, dif.y)`:

```javascript
let distancia = Math.sqrt(Math.pow(x - dif.x, 2) + Math.pow(y - dif.y, 2));

// Si la distancia es menor al 5.2% del ancho/alto, se da por acertado
if (distancia < 5.2) {
    dif.encontrada = true;
    marcar(dif.x, dif.y);
    // ...
}
```

> **Tip para calibrar nuevas coordenadas:** Puedes agregar temporalmente `console.log({ x: x.toFixed(1), y: y.toFixed(1) });` dentro de la función `cargaApp()` para obtener las coordenadas exactas de cualquier nuevo punto al hacer clic sobre la lámina.

---

## ⏱️ 5. Sistema de Roles y Tiempos

El sistema categoriza el tiempo según el grado de entrenamiento y jerarquía:

| Nivel | Roles Incluidos | Tiempo Límite |
| :--- | :--- | :--- |
| **Principiante** | Ayudante, Medio Oficial, Oficial | **5 minutos** (300 s) |
| **Intermedio** | Ejecutor, Capataz, Supervisor | **3 minutos** (180 s) |
| **Avanzado** | Jefe de Obra, Supervisor HyS | **1 minuto** (60 s) |

---

## ☁️ 6. Configuración de Firebase

El archivo [`public/firebase/app_firebase.js`](file:///c:/laragon/www/Armando_Applicacion-main/public/firebase/app_firebase.js) contiene la configuración del proyecto Firebase:

- **Authentication:** Google Sign-In mediante popup (`signInWithPopup`).
- **Realtime Database:** Los resultados se almacenan en el nodo `Jugadores/` con la siguiente estructura:

  ```json
  {
    "uid": "ID_DE_FIREBASE_AUTH",
    "email": "usuario@empresa.com",
    "nombre": "Juan Pérez",
    "puntos": 280,
    "tiempo": "02:14",
    "tiempoRol": "3 minutos",
    "rolUsuario": "capataz",
    "fecha": "22/10/2026, 17:30:00",
    "resultado": [
      { "nombre": "Tacho sin tapa", "encontrada": true },
      { "nombre": "Derrame de aceite", "encontrada": false }
    ]
  }
  ```

- **Permisos de Administrador:** Los correos con privilegios de ver reportes completos y limpiar historial están definidos en la función `esAdmin()`:

  ```javascript
  export function esAdmin(user) {
      if (!user) return false;
      return (
          user.email === "lukitaass2013@gmail.com" ||
          user.email === "armandodelaplataguanco@gmail.com"
      );
  }
  ```

---

## 💻 7. Cómo Ejecutar Localmente

1. **Con Laragon / XAMPP / Apache:**
   - Asegúrate de colocar la carpeta dentro de `c:/laragon/www/Armando_Applicacion-main/`.
   - Inicia los servicios de Laragon.
   - Abre en tu navegador preferido: `http://localhost/Armando_Applicacion-main/`.

2. **Con Live Server (VS Code / Cursor):**
   - Haz clic derecho sobre `public/index.html` y selecciona **Open with Live Server**.

3. **Despliegue a Firebase Hosting:**
   - Si tienes instalado Firebase CLI (`npm install -g firebase-tools`):

     ```bash
     firebase login
     firebase deploy --only hosting
     ```

---

## 🔮 8. Ideas y Roadmap para Futuras Mejoras

Si tu amigo desea seguir expandiendo la plataforma, aquí hay sugerencias de valor agregado listas para implementar:

1. **Múltiples Láminas / Niveles de Dificultad:**
   - En la carpeta `public/assets/` ya existen imágenes adicionales (`img_riesgo_trabajo.jpeg`, `img_riesgo2.jpeg`, `img_riesgo3_mejorada.jpeg`).
   - Se puede crear un selector de escenario: *"Taller Mecánico"*, *"Trabajo en Altura / Andamios"*, *"Excavaciones"*.
2. **Generación de Certificado en PDF:**
   - Integrar `jsPDF` para emitir un diploma con nombre, fecha, calificación y firma del responsable de HyS.
3. **Efectos de Sonido Sutiles (Audio FX):**
   - Agregar un sonido corto de éxito al detectar una anomalía y una alerta sonora cuando falten 10 segundos para finalizar.
4. **Panel de Gestión de Usuarios y Roles (Dashboard Admin):**
   - Permitir al administrador asignar roles o descargar reportes masivos en Excel/CSV de todos los evaluados.
5. **Modo Claro / Oscuro (Toggle de Tema):**
   - Gracias a las variables CSS en `:root` de `estilos.css`, se puede agregar un interruptor para alternar entre tema oscuro industrial y tema corporativo claro.

---

*Desarrollado originalmente por **LEL Desarrollos Web** &bull; Mejorado y optimizado en 2026.*
