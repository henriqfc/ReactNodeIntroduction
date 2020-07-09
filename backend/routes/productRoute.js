import express from 'express';
import Product from '../models/productModel'
import { isAuth, isAdmin } from '../util';

const router = express.Router();

router.get('/', async (req, res) => {
    const products = await Product.find({});
    res.send(products);
})

router.get('/:id', async (req, res) => {
    const product = await Product.findOne({ _id: req.params.id });
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: "Product not found." })
    }
})


router.post('/', isAuth, isAdmin, async (req, res) => {
    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        description: req.body.description,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
    });

    const newProduct = await product.save();
    if (newProduct) {
        return res.status(201).send({ message: 'New Product Created.' });
    }
    return res.status(500).send({ message: 'Error Creating Product.' });
});

router.put('/:id', isAuth, isAdmin, async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
        product.name = req.body.name;
        product.image = req.body.image;
        product.brand = req.body.brand;
        product.price = req.body.price;
        product.category = req.body.category;
        product.countInStock = req.body.countInStock;
        product.description = req.body.description;
    }

    const updatedProduct = await product.save();
    if (updatedProduct) {
        return res.status(200).send({ message: 'Product Uptaded.', data: updatedProduct });
    }
    return res.status(500).send({ message: 'Error Updating Product.' });
});


router.delete('/:id', isAuth, isAdmin, async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
        await product.remove();
        res.send({ message: 'Product Deleted.' });
    } else {
        res.send({ message: 'Error Updating Product.' });
    }
});

export default router;