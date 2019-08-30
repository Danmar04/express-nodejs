const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const p = path.join(
    rootDir,
    'data',
    'products.json');

const Cart = require('./cart');



module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile(products => {
            console.log(products);
            if (this.id) {
                const existingProductIndex = products.findIndex(prod => prod.id == this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                    if (err) {
                        console.log(err);
                    }
                });

            } else {
                this.id = Math.floor(Math.random() * (1000 - 1)) + 1;
                products.push(this);
                //Escribimos los productos en el json
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile(products => {
            console.log(id);
            const product = products.find(p => p.id == id);
            console.log(product);
            cb(product);
        });
    }

    static deleteProduct(id) {
        getProductsFromFile(products => {
            const product = products.find(prod => prod.id == id);
            const updatedProducts = products.filter(prod => prod.id != id);
            fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                console.log(err);
                if (!err) {
                    Cart.deleteProduct(id, product.price);
                }
            });
        });
    }

}

const getProductsFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            //Leemos los productos del JSOn
            cb([]);
        }
        cb(JSON.parse(fileContent));

    });
};
