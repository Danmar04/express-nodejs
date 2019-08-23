const path = require('path');

const express = require('express'); 7

const shopController = require('../controllers/shop');

const router = express.Router();



router.get('/', shopController.getIndex);

// TODO: Implementar
router.get('/products', shopController.getProducts);
router.get('/cart', shopController.getCart);
router.get('/checkout', shopController.getCheckout);
router.get('/orders', shopController.getOrders);

// router.get('/product-detail', METODO_DETALLE_PRODUCTO)

module.exports = router;