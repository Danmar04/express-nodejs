const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const p = path.join(
    rootDir,
    'data',
    'products.json');


module.exports = class Product {
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile(products => {
            products.push(this);
            //Escribimos los productos en el json
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
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
