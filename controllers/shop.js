
const Product = require('../models/product');
const Cart = require('../models/cart');


//Obtener todos los productos
exports.getProducts = (req, res, next) => {

    Product.findAll().then(products => {
        res.render(
            'shop/product-list', {
            prods: products,
            pageTitle: 'All products',
            path: '/products',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true,
            isAuthenticated: req.session.isLogedIn
        }
        );
    }).catch(err => {
        console.log(err);
    });


};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findByPk(prodId)
        .then(product => {
            console.log(product);
            res.render('shop/product-detail', {
                product: product,
                pageTitle: 'Product detail',
                path: '/products',
                isAuthenticated: req.session.isLogedIn
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getIndex = (req, res, next) => {
    Product.findAll().then(products => {
        res.render(
            'shop/index',
            {
                prods: products,
                pageTitle: 'Shop',
                path: '/',
                hasProducts: products.length > 0,
                activeShop: true,
                productCSS: true,
                isAuthenticated: req.session.isLogedIn,

            }
        );
    }).catch(err => {
        console.log(err);
    });
};

exports.getCart = (req, res, next) => {
    let isEmpty = true;
    req.user.getCart()
        .then(cart => {
            return cart.getProducts();

        })
        .then(products => {
            if (products.length > 0) {
                isEmpty = false;
                console.log("Hay productos");
            }
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products,
                empty: isEmpty,
                isAuthenticated: req.session.isLogedIn
            });

        })
        .catch((err) => {

        });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: prodId } });
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                product.cartItem.quantity = newQuantity;
                return product;
            }
            return Product.findByPk(prodId);
        })
        .then(product => {
            return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: prodId } });
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getOrders = (req, res, next) => {
    req.user.getOrders({ include: ['products'] })
        .then(orders => {
            console.log(orders);
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders,
                isAuthenticated: req.session.isLogedIn
            });
        })
        .catch((err) => {
            console.log(err);
        });;

};

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user.createOrder()
                .then(order => {
                    return order.addProducts(products.map(product => {
                        product.orderItem = { quantity: product.cartItem.quantity };
                        return product;
                    }));
                }).catch((err) => {
                    console.log(err);
                });;
        })
        .then(result => {
            return fetchedCart.setProducts(null);
        }).then(result => {
            res.redirect('/orders');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
        isAuthenticated: req.session.isLogedIn
    });
};
