import express from 'express';
import { faker } from '@faker-js/faker';

const app = express();
const PORT = 3000;

const generateProducts = (numProducts) => {
  const products = [];
  for (let i = 0; i < numProducts; i++) {
    products.push({
      id: i + 1,
      name: faker.commerce.productName(),
      image: faker.image.url(),
      price: parseFloat(faker.commerce.price()),
      description: faker.commerce.productDescription(),
      category: faker.commerce.department(),
      stock: faker.number.int({ min: 0, max: 100 }),
      rating: parseFloat(
        faker.number.float({ min: 1, max: 5, precision: 0.1 }).toFixed(1),
      ),
    });
  }
  return products;
};

const products = generateProducts(20);

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
    <button onclick="location.href='/'">Home</button>
    <button onclick="location.href='/products'">Products</button>
    <button onclick="location.href='/about'">About</button>
    <button onclick="location.href='/api'">API</button>
    <main></main>
</body>
</html>
`;

function filterProducts({
  category,
  minPrice,
  maxPrice,
  sortBy,
  sortOrder,
  limit,
  offset,
}) {
  let filteredProducts = structuredClone(products);

  if (category) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === category,
    );
  }

  if (minPrice) {
    filteredProducts = filteredProducts.filter(
      (product) => product.price >= minPrice,
    );
  }

  if (maxPrice) {
    filteredProducts = filteredProducts.filter(
      (product) => product.price <= maxPrice,
    );
  }

  if (sortBy) {
    filteredProducts = filteredProducts.sort((a, b) => {
      if (sortOrder === 'desc') {
        return b[sortBy] - a[sortBy];
      }
      return a[sortBy] - b[sortBy];
    });
  }

  if (offset) {
    filteredProducts = filteredProducts.slice(parseInt(offset));
  }

  if (limit) {
    filteredProducts = filteredProducts.slice(0, parseInt(limit));
  }

  return filteredProducts;
}

app.get('/', (req, res) => {
  res.send(htmlContent);
});

app.get('/products', (req, res) => {
  const { category, minPrice, maxPrice, sortBy, sortOrder, limit, offset } =
    req.query;
  const filteredProducts = filterProducts({
    category,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
    limit,
    offset,
  });

  const filterForm = `
    <form method="GET" action="/products" style="margin: auto; max-width: 500px; padding: 20px; border: 1px solid #ccc; border-radius: 10px; background-color: #f9f9f9; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <label for="category">Categoría:</label>
      <input type="text" id="category" name="category" value="${category || ''}">
      <label for="minPrice">Precio Mínimo:</label>
      <input type="number" id="minPrice" name="minPrice" value="${minPrice || ''}">
      <label for="maxPrice">Precio Máximo:</label>
      <input type="number" id="maxPrice" name="maxPrice" value="${maxPrice || ''}">
      <label for="sortBy">Ordenar por:</label>
      <select id="sortBy" name="sortBy">
        <option value="" ${sortBy === '' ? 'selected' : ''}>Seleccionar</option>
        <option value="price" ${sortBy === 'price' ? 'selected' : ''}>Precio</option>
        <option value="rating" ${sortBy === 'rating' ? 'selected' : ''}>Rating</option>
      </select>

      <label for="sortOrder">Orden:</label>
      <select id="sortOrder" name="sortOrder">
        <option value="" ${sortOrder === '' ? 'selected' : ''}>Seleccionar</option>
        <option value="asc" ${sortOrder === 'asc' ? 'selected' : ''}>Ascendente</option>
        <option value="desc" ${sortOrder === 'desc' ? 'selected' : ''}>Descendente</option>
      </select>
      <label for="limit">Límite:</label>
      <input type="number" id="limit" name="limit" value="${limit || ''}">
      <label for="offset">Offset:</label>
      <input type="number" id="offset" name="offset" value="${offset || ''}">
      <button type="submit" style="padding: 10px 20px; border: none; border-radius: 5px; background-color: #007bff; color: #fff; cursor: pointer; margin-right: 10px;">Filtrar</button>
      <button type="button" onclick="location.href='/products'" style="padding: 10px 20px; border: none; border-radius: 5px; background-color: #6c757d; color: #fff; cursor: pointer;">Borrar Filtros</button>
      <div><span>Products: ${filteredProducts.length}</span></div>
    </form>
  `;

  const productsTable = `
    <table border="1" style="margin: auto; max-width: 100vh; padding: 20px; border: 1px solid #ccc; border-radius: 10px; background-color: #f9f9f9; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Imagen</th>
        <th>Precio</th>
        <th>Descripción</th>
        <th>Categoría</th>
        <th>Stock</th>
        <th>Rating</th>
      </tr>
      ${filteredProducts
        .map(
          (product) => `
        <tr>
          <td><a href="/products/${product.id}">${product.id}</a></td>
          <td>${product.name}</td>
          <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover;"></td>
          <td>${product.price}</td>
          <td>${product.description}</td>
          <td>${product.category}</td>
          <td>${product.stock}</td>
          <td>${product.rating}</td>
        </tr>
      `,
        )
        .join('')}
    </table>
  `;
  res.send(
    htmlContent
      .replace('<h1>My Store</h1>', '<h1>Products</h1>')
      .replace('<main></main>', `<main>${filterForm}${productsTable}</main>`),
  );
});

app.get('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find((p) => p.id === productId);
  if (product) {
    const productDetails = `
      <img src="${product.image}" alt="${product.name}" style="width: 200px; height: 200px; object-fit: cover;">
      <p>ID: ${product.id}</p>
      <p>Nombre: ${product.name}</p>
      <p>Precio: ${product.price}</p>
      <p>Descripción: ${product.description}</p>
      <p>Categoría: ${product.category}</p>
      <p>Stock: ${product.stock}</p>
      <p>Rating: ${product.rating}</p>
      <button onclick="location.href='/products'">Back to Products</button>
    `;
    res.send(
      htmlContent
        .replace('<h1>My Store</h1>', '<h1>Product Details</h1>')
        .replace('<main></main>', `<main>${productDetails}</main>`),
    );
  } else {
    res.status(404).send('Product not found');
  }
});

app.get('/about', (req, res) => {
  res.send(htmlContent.replace('<h1>My Store</h1>', '<h1>About</h1>'));
});

app.get('/api', (req, res) => {
  res.json(products);
});

app.listen(PORT, () => {
  console.log(`Escuchando en puerto ${PORT}`);
});
