const Product = require('../models/product');

//Redireccion a introducir nuevos productos
exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product',
        {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            formCSS: true,
            productCSS: true,
            activeAddProduct: true,
            editing: false,
            isAuthenticated: req.session.isLogedIn
        });
}

//Añadir nuevo producto
exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description,
        userId: req.session.user.id
    });

    product.save()
        .then(result => {
            console.log('Created product');
            res.redirect('/admin/products');
        }).catch(err => {
            console.log(err);
        });
}


exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findByPk(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product',
                {
                    pageTitle: 'Edit Product',
                    path: '/admin/add-product',
                    editing: editMode,
                    product: product,
                    editing: true,
                    isAuthenticated: req.session.isLogedIn
                });
        })
        .catch((err) => {
            console.log(err);
        });
}

exports.getPostEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    Product.findByPk(prodId).then(product => {
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.imageUrl = updatedImageUrl;
        product.description = updatedDesc;
        return product.save();
    }).then(result => {
        console.log('Product updated');
        res.redirect('/admin/products');
    }).catch(err => {
        console.log(err);
    });

}

exports.getProducts = (req, res, next) => {
    Product.findAll().then(products => {
        res.render(
            'admin/products',
            {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
                hasProducts: products.length > 0,
                activeShop: true,
                productCSS: true,
                isAuthenticated: req.session.isLogedIn

            }
        );
    }).catch(err => { console.log(err); });
};

exports.deleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByPk(prodId).then((product) => {
        res.redirect('/admin/products');
        return product.destroy();
    }).catch((err) => {
        console.log(err);
    });
};
