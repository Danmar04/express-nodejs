const path = require('path');

const express = require('express'); 7

const shopController = require('../controllers/shop');

const isAuth = require('../middleware/is-auth');

const router = express.Router();


console.log("Modulo de tienda");

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', isAuth, shopController.postCart);
router.get('/checkout', isAuth, shopController.getCheckout);
router.get('/orders', isAuth, shopController.getOrders);
router.post('/create-order', isAuth, shopController.postOrder);
router.get('/products/:productId', shopController.getProduct);
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);


module.exports = router;