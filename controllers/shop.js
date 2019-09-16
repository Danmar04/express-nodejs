
const Product = require('../models/product');
const Cart = require('../models/cart');

//Obtener todos los productos
exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(([rows, fieldData]) => {
            res.render(
                'shop/product-list', {
                prods: rows,
                pageTitle: 'All products',
                path: '/products',
                hasProducts: rows.length > 0,
                activeShop: true,
                productCSS: true
            }
            );
        })
        .catch()


};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(([product]) => {
            console.log(product[0]);
            res.render('shop/product-detail', {
                product: product[0],
                pageTitle: 'Product detail',
                path: '/products'
            });
        })
        .catch((err) => {
            console.log(err);
        });

};

exports.getIndex = (req, res, next) => {
    Product.fetchAll().then(([rows, fieldData]) => {
        res.render(
            'shop/index',
            {
                prods: rows,
                pageTitle: 'Shop',
                path: '/',
                hasProducts: rows.length > 0,
                activeShop: true,
                productCSS: true

            }
        );
    }).catch((err) => {
        console.log(err);
    });;

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