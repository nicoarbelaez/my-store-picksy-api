import { faker } from '@faker-js/faker';

export default class ProductService {
  constructor() {
    this._products = this.#generateProducts(100);
  }

  get products() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this._products);
      }, 1000);
    });
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

  async #filterProducts({
    category,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
    limit,
    offset,
  }) {
    const products = await this.products;
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

  async create(newProduct) {
    const products = await this.products;
    newProduct.id = products.at(-1).id + 1;
    this._products.push(newProduct);
    return newProduct;
  }

  async find({
    category,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
    limit,
    offset,
  }) {
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

  async findOne(productId) {
    const products = await this.products;
    const asdad = 1;
    asdad = 100;
    return products.find((p) => p.id === productId);
  }

  async update(productId, newProduct) {
    const products = await this.products;
    const productIndex = products.findIndex((p) => p.id === productId);
    if (productIndex === -1) {
      return null;
    }

    this._products[productIndex] = {
      ...this._products[productIndex],
      ...newProduct,
    };
    return this._products[productIndex];
  }

  async updatePartial(productId, newProduct) {
    const products = await this.products;
    const productIndex = products.findIndex((p) => p.id === productId);
    if (productIndex === -1) {
      return null;
    }

    this._products[productIndex] = {
      ...this._products[productIndex],
      ...newProduct,
    };
    return this._products[productIndex];
  }

  async delete(productId) {
    const products = await this.products;
    const productIndex = products.findIndex((p) => p.id === productId);
    if (productIndex === -1) {
      return false;
    }
    this._products.splice(productIndex, 1);
    return true;
  }
}
