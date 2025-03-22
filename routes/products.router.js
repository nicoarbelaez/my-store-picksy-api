import express from 'express';
import ProductService from '../services/product.service.js';

const router = express.Router();
const service = new ProductService();

router.get('/', (req, res) => {
  res.json(service.find(req.query));
});

router.get('/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = service.findOne(productId);
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

router.post('/', (req, res) => {
  const newProduct = service.create(req.body);
  res.status(201).json({
    status: 201,
    message: 'Product created successfully',
    product: newProduct,
  });
});

router.put('/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = service.update(productId, req.body);
  if (!product) {
    res.status(404).json({
      status: 404,
      message: 'Product not found',
      info: `No product found with ID ${productId}`,
    });
    return;
  }

  res.status(200).json({
    status: 200,
    message: 'Product update successfully',
    product: product,
  });
});

router.patch('/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = service.updatePartial(productId, req.body);
  if (!product) {
    res.status(404).json({
      status: 404,
      message: 'Product not found',
      info: `No product found with ID ${productId}`,
    });
    return;
  }

  res.status(200).json({
    status: 200,
    message: 'Product update successfully',
    product: product,
  });
});

router.delete('/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const confirm = service.delete(productId);
  if (!confirm) {
    res.status(404).json({
      status: 404,
      message: 'Product not found',
      info: `No product found with ID ${productId}`,
    });
    return;
  }

  res.status(200).json({
    status: 200,
    message: 'Product delete successfully',
  });
});

export default router;
