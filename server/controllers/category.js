const Category = require("../models/category")
const Product = require("../models/product")
const Sub = require("../models/sub")
const slugify = require("slugify");

exports.create = async (req, res) => {
    try {
        const { name } = req.body;
        //const category = await new Category({ name, slug: slugify(name) }).save()
        res.json(await new Category({ name, slug: slugify(name) }).save())
    } catch (err) {
        //console.log(err)
        res.status(400).send('Create category failed')
    }
}

exports.list = async (req, res) => {
    res.json(await Category.find({}).sort({ createdAt: -1 }).exec())
}

exports.read = async (req, res) => {
    let category = await Category.findOne({ slug: req.params.slug }).exec()
    //res.json(category)

    const products = await Product.find({ category }) //here you need not give id mongo resloves it for itself
        .populate('category')
        .exec()

    res.json({
        category,
        products
    })
}

exports.update = async (req, res) => {
    try {
        const { name } = req.body;
        const updated = await Category.findOneAndUpdate({ slug: req.params.slug }, { name, slug: slugify(name) }, { new: true }) //new: true return new value not the old one
        res.json(updated)
    } catch (err) {
        //console.log(err)
        res.status(400).send('update category failed')
    }
}

exports.remove = async (req, res) => {
    try {
        let deleted = await Category.findOneAndDelete({ slug: req.params.slug })
        res.json(deleted)
    } catch (err) {
        res.status(400).send("Delete category failed")
    }
}

// for getting subs based on caregory id
//why this is not async
// aso wy query was dne on sub instead of category, cuz we want to have title as well
exports.getSubs = (req, res) => {
    Sub.find({ parent: req.params._id }).exec((err, subs) => {
        if (err) console.log(err);
        res.json(subs)
    })
}