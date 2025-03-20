import express from 'express';
import { faker } from '@faker-js/faker';

const router = express.Router();

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

router.get('/', (req, res) => {
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

  res.json(filteredProducts);
});

router.get('/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find((p) => p.id === productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({
      status: 404,
      message: 'Product not found',
      info: `No product found with ID ${productId}`,
    });
  }
});

export default router;
