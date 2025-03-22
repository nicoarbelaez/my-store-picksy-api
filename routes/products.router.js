import express from 'express';
import ProductService from '../services/product.service.js';

const router = express.Router();
const service = new ProductService();

router.get('/', async (req, res) => {
  res.json(await service.find(req.query));
});

router.get('/:id', async (req, res) => {
  const productId = parseInt(req.params.id);
  const product = await service.findOne(productId);
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

router.post('/', async (req, res) => {
  const newProduct = await service.create(req.body);
  res.status(201).json({
    status: 201,
    message: 'Product created successfully',
    product: newProduct,
  });
});

router.put('/:id', async (req, res) => {
  const productId = parseInt(req.params.id);
  const product = await service.update(productId, req.body);
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

router.patch('/:id', async (req, res) => {
  const productId = parseInt(req.params.id);
  const product = await service.updatePartial(productId, req.body);
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

router.delete('/:id', async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const confirm = await service.delete(productId);
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
