# Primeros Pasos para Crear una API REST en Node con Buenas Prácticas 🚀

En este tutorial vamos a construir una API REST en Node usando **Express** y siguiendo buenas prácticas de desarrollo. Dividiremos el proceso en varias secciones para que puedas entender cada paso. Además, te recomiendo usar herramientas de **Inteligencia Artificial (IA)** para generar datos de ejemplo o para ayudarte a resolver dudas sobre temas que no domines completamente. La IA puede inspirarte con datos ficticios y sugerir soluciones, permitiéndote enfocarte en la estructura y las buenas prácticas de tu código. 🤖

---

## 1. Configuración del Proyecto 📦

### 1.1 Inicialización del Proyecto y Dependencias

Primero, crea una carpeta para tu proyecto y luego inicialízalo con tu gestor de paquetes favorito (en este ejemplo, se usa **pnpm**):

```bash
pnpm init
```

Instala las dependencias necesarias, como **Express** y herramientas para mantener un código limpio, como **ESLint** y **Prettier**:

```bash
pnpm add express
pnpm add -D eslint eslint-config-prettier globals nodemon prettier
```

Tu archivo `package.json` se verá similar a este:

```json
{
  "name": "my-store",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "nodemon index.js",
    "start": "node index.js",
    "lint": "eslint ."
  },
  "type": "module",
  "keywords": [],
  "author": "",
  "license": "ISC",
  "packageManager": "pnpm@10.6.2",
  "devDependencies": {
    "eslint": "^9.22.0",
    "eslint-config-prettier": "^9.0.0",
    "globals": "^14.0.0",
    "nodemon": "^3.1.9",
    "prettier": "^3.5.3"
  },
  "dependencies": {
    "express": "^4.21.2"
  }
}
```

### 1.2 Configuración de ESLint

Para asegurarte de seguir buenas prácticas, configura **ESLint**. Crea un archivo llamado `eslint.config.mjs` y agrega la siguiente configuración:

```js
import { defineConfig } from "eslint/config";
import globals from "globals";
import prettier from "eslint-config-prettier";

export default defineConfig([
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 2018,
      sourceType: "module",
    },
    rules: {
      "no-console": "warn",
      "no-unused-vars": "error",
      "no-undef": "error", // Error si se usa una variable no definida
      "init-declarations": ["error", "always"], // Fuerza la inicialización en la declaración
      "no-use-before-define": ["error", { functions: false, classes: true, variables: true }],
      "prefer-const": "error" // Recomienda const si la variable no se reasigna
    },
  },
  prettier,
]);
```

---

## 2. Creando un Servidor Básico con Express 🌐

### 2.1 Importando Express y Creando la Aplicación

Comienza importando **Express** y creando una instancia de la aplicación. Establece también el puerto en el que el servidor escuchará:

```js
import express from 'express';

const app = express();
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Escuchando en puerto ${PORT}`);
});

```

### 2.2 Primer Endpoint: La Raíz ("/")

Define el primer endpoint que responderá en la ruta `/`. Este endpoint enviará una respuesta básica. Inicialmente, puedes simplemente mostrar un mensaje o un HTML básico:

```js
const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Store</title>
</head>
<body>
  <h1>My Store</h1>
  <button onclick="location.href='/products'">Products</button>
  <button onclick="location.href='/about'">About</button>
  <button onclick="location.href='/api'">API</button>
</body>
</html>
`;

app.get('/', (req, res) => {
  // Se reemplaza el título para mostrar un saludo personalizado
  res.send(htmlContent.replace('<h1>My Store</h1>', '<h1>Hola Express</h1>'));
});
```

Esta sección te enseña a **iniciar un servidor básico** y a crear un **endpoint** que envía una respuesta HTML simple. 😃

---

## 3. Integrando HTML y Navegación 🖥️

### 3.1 Creación del HTML Base

El contenido HTML se utiliza para facilitar la navegación entre las diferentes secciones de la aplicación. En nuestro ejemplo, el HTML contiene botones que redirigen a distintas rutas.

### 3.2 Añadiendo Navegación

Observa cómo se utilizan los botones con la propiedad `onclick` para navegar a los endpoints `/products`, `/about` y `/api`. Esto te ayudará a entender cómo integrar la parte del front-end con tu servidor:

```html
<button onclick="location.href='/products'">Products</button>
<button onclick="location.href='/about'">About</button>
<button onclick="location.href='/api'">API</button>
```

---

## 4. Creación de la API y Endpoints para Productos 📊

### 4.1 Definiendo Datos de Ejemplo

Para la API, se utiliza un array de objetos que simulan productos. Puedes usar **IA** para generar estos datos de ejemplo si no dispones de datos reales o deseas experimentar con datos ficticios. La IA puede ayudarte a sugerir atributos, nombres y otros detalles para enriquecer tus ejemplos.

```js
const products = [
  {
    id: 1,
    name: 'Joya',
    price: 50,
    description: 'Hermosa joya artesanal',
    category: 'Accesorios',
    stock: 10,
    rating: 4.5,
  },
  // ... otros productos
];
```

### 4.2 Endpoint para Listar Productos

Este endpoint genera una tabla HTML con la información de cada producto. Se utiliza la función `map` para recorrer el array y generar las filas de la tabla:

```js
app.get('/products', (req, res) => {
  const productsTable = `
    <table border="1">
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Precio</th>
        <th>Descripción</th>
        <th>Categoría</th>
        <th>Stock</th>
        <th>Rating</th>
      </tr>
      ${products.map(product => `
        <tr>
          <td><a href="/products/${product.id}">${product.id}</a></td>
          <td>${product.name}</td>
          <td>${product.price}</td>
          <td>${product.description}</td>
          <td>${product.category}</td>
          <td>${product.stock}</td>
          <td>${product.rating}</td>
        </tr>
      `).join('')}
    </table>
  `;
  res.send(htmlContent.replace('<h1>My Store</h1>', `<h1>Products</h1>${productsTable}`));
});
```

### 4.3 Endpoint para Detalle de Producto

Permite ver los detalles de un producto específico a través de un parámetro en la URL:

```js
app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (product) {
    const productDetails = `
      <h1>Product Details</h1>
      <p>ID: ${product.id}</p>
      <p>Nombre: ${product.name}</p>
      <p>Precio: ${product.price}</p>
      <p>Descripción: ${product.description}</p>
      <p>Categoría: ${product.category}</p>
      <p>Stock: ${product.stock}</p>
      <p>Rating: ${product.rating}</p>
      <button onclick="location.href='/products'">Back to Products</button>
    `;
    res.send(htmlContent.replace('<h1>My Store</h1>', productDetails));
  } else {
    res.status(404).send('Product not found');
  }
});
```

### 4.4 Endpoint de la API

Finalmente, crea un endpoint que responda con la información de los productos en formato JSON. Esto es útil para el consumo de la API por parte de otras aplicaciones:

```js
app.get('/api', (req, res) => {
  res.json(products);
});
```

---

## 5. Puesta en Marcha del Servidor 🔧

Para arrancar tu servidor, utiliza el siguiente código:

```js
app.listen(PORT, () => {
  console.log(`Escuchando en puerto ${PORT}`);
});
```

Ejecuta el servidor en modo desarrollo con:

```bash
pnpm dev
```

Con esto, tu servidor estará corriendo y listo para atender las solicitudes en las rutas definidas. 👍

---

## 6. Buenas Prácticas y Uso de IA 💡

### 6.1 Buenas Prácticas en el Desarrollo

- **Estructura del Código:** Mantén tu código modular y bien organizado. Divide el código en archivos según su funcionalidad.
- **Configuración de Linter:** Usa herramientas como **ESLint** y **Prettier** para garantizar un código limpio y consistente.
- **Comentarios y Documentación:** Explica cada parte del código para facilitar su comprensión y mantenimiento.
- **Pruebas y Validación:** Implementa pruebas unitarias y de integración para asegurar el correcto funcionamiento de tus endpoints.

### 6.2 Uso de IA para Datos de Ejemplo y Asesoramiento

Usar **IA** puede ser de gran ayuda en diversas áreas:
- **Generación de Datos de Ejemplo:** Si no tienes datos reales, puedes usar IA para crear datos ficticios que se ajusten a tu modelo. Esto es especialmente útil para prototipos o durante el desarrollo.
- **Resolución de Dudas:** La IA puede sugerir soluciones o explicaciones para temas complejos, ayudándote a comprender mejor ciertos conceptos o a resolver problemas que se te presenten.
- **Optimización de Código:** Algunas herramientas basadas en IA pueden revisar tu código y ofrecer sugerencias para mejorarlo, basándose en las mejores prácticas de la industria.

Aprovechar estas herramientas te permitirá acelerar el desarrollo y mejorar la calidad de tus proyectos, dándote mayor confianza en la solución final. 🤩

---

## 7. Conclusión 🎉

En este tutorial has aprendido:
- Cómo inicializar un proyecto en Node y configurar dependencias.
- La creación de un servidor básico con **Express**.
- La configuración de endpoints para devolver respuestas HTML y JSON.
- La integración de buenas prácticas de codificación mediante ESLint y Prettier.
- La utilidad de la IA para generar datos de ejemplo y resolver dudas.

¡Ahora ya tienes los fundamentos para crear y escalar una API REST en Node usando buenas prácticas! Recuerda que la clave está en estructurar tu proyecto de manera modular, seguir las recomendaciones de los linters y estar abierto a usar herramientas innovadoras como la IA para mejorar tu flujo de trabajo.

---

## Conecta y Comparte 🚀

Encuentra más proyectos y conecta conmigo en GitHub: [https://github.com/nicoarbelaez](https://github.com/nicoarbelaez)

¡Feliz codificación y sigue explorando! 🎊
