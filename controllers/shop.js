
const Product = require('../models/product');
const Cart = require('../models/cart');

//Obtener todos los productos
exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render(
            'shop/product-list',
            {
                prods: products,
                pageTitle: 'All products',
                path: '/products',
                hasProducts: products.length > 0,
                activeShop: true,
                productCSS: true

            }
        );
    });

};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        res.render('shop/product-detail', {
            product: product,
            pageTitle: 'Product detail',
            path: '/products'
        });
    });

};

exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render(
            'shop/index',
            {
                prods: products,
                pageTitle: 'Shop',
                path: '/',
                hasProducts: products.length > 0,
                activeShop: true,
                productCSS: true

            }
        );
    });
};

exports.getCart = (req, res, next) => {
    let isEmpty = true;
    Cart.getProducts(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(prod => prod.id == product.id);
                if (cartProductData) {
                    isEmpty = false;
                    cartProducts.push({ productData: product, qty: cartProductData.qty });
                }
            }
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: cartProducts,
                empty: isEmpty
            });
        });
    });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, (product) => {
        console.log(product);
        Cart.addProduct(prodId, product.price);
    });
    res.redirect('/cart');
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
    });
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders'
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
};