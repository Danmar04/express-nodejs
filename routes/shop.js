const path = require('path');

const express = require('express'); 7

const shopController = require('../controllers/shop');

const router = express.Router();


console.log("Modulo de tienda");

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);
router.get('/checkout', shopController.getCheckout);
router.get('/orders', shopController.getOrders);
router.post('/create-order', shopController.postOrder);
router.get('/products/:productId', shopController.getProduct);
router.post('/cart-delete-item', shopController.postCartDeleteProduct);
router.post

module.exports = router;