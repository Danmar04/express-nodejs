const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');


const p = path.join(
    rootDir,
    'data',
    'cart.json');



module.exports = class Cart {
    constructor() {
        this.products = [];
        this.totalPrice = 0;
    }

    static addProduct(id, productPrice) {
        //Leemos el carrito existente
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            //Analizamos el carrito  Encontrar si tiene carritos
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            //Añadimos un nuevo producto / incrementamos el que ya esta en el carrito
            let updatedProduct;
            if (existingProduct) {
                console.log("Existe el producto");
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;

            } else {
                console.log("Producto nuevo");
                updatedProduct = { id: id, qty: 1 };
                cart.products.push(updatedProduct);
            }

            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            })

        });


    }

    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return;
            }
            const cart = JSON.parse(fileContent);
            const updatedCart = { ...cart };
            const product = updatedCart.products.findIndex(prod => prod.id == id);
            const productQty = product.qty;
            cart.products = updatedCart.products.filter(prod => prod.id != id);
            cart.totalPrice = cart.totalPrice - productPrice * productQty;


            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            })
        });

    }

    static getProducts(cb) {
        fs.readFile(p, (err, fileContent) => {
            const cart = JSON.parse(fileContent);
            if (err) {
                cb(null);
            }
            else {
                cb(cart);
            }
        });
    }
};