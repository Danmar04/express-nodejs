const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();


router.get('/add-product', adminController.getAddProduct);

router.get('/products', adminController.getProducts);

router.post('/add-product', adminController.postAddProduct);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product', adminController.getPostEditProduct);

router.post('/delete-product', adminController.deleteProduct);

// router.put('/edit-product', EDITAR_PRODUCTO);



module.exports = router;