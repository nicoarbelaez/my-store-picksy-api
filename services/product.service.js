import { faker } from '@faker-js/faker';

export default class ProductService {
  constructor() {
    this.products = this.#generateProducts(100);
  }

  #generateProducts(numProducts) {
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
  }

  #filterProducts({
    category,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
    limit,
    offset,
  }) {
    let filteredProducts = structuredClone(this.products);

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

  create(newProduct) {
    newProduct.id = this.products.at(-1).id + 1;
    this.products.push(newProduct);
    return newProduct;
  }

  find({ category, minPrice, maxPrice, sortBy, sortOrder, limit, offset }) {
    return this.#filterProducts({
      category,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
      limit,
      offset,
    });
  }

  findOne(productId) {
    return this.products.find((p) => p.id === productId);
  }

  update(productId, newProduct) {
    const productIndex = this.products.findIndex((p) => p.id === productId);
    if (productIndex === -1) {
      return null;
    }

    this.products[productIndex] = {
      ...this.products[productIndex],
      ...newProduct,
    };
    return this.products[productIndex];
  }

  updatePartial(productId, newProduct) {
    const productIndex = this.products.findIndex((p) => p.id === productId);
    if (productIndex === -1) {
      return null;
    }

    this.products[productIndex] = {
      ...this.products[productIndex],
      ...newProduct,
    };
    return this.products[productIndex];
  }

  delete(productId) {
    const productIndex = this.products.findIndex((p) => p.id === productId);
    if (productIndex === -1) {
      return false;
    }
    this.products.splice(productIndex, 1);
    return true;
  }
}
