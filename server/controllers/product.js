const Product = require("../models/product")
const User = require("../models/user")
const slugify = require("slugify")
const { populate } = require("../models/product")
const { response } = require("express")

exports.create = async (req, res) => {
    try {
        console.log(req.body)
        req.body.slug = slugify(req.body.title)
        res.json(await new Product(req.body).save())
    } catch (err) {
        //console.log(err)
        //res.status(400).send('Create product failed')
        res.status(400).json({
            err: err.message
        })
    }
}

exports.listAll = async (req, res) => {
    let products = await Product.find({})
        .limit(parseInt(req.params.count))
        .populate("category") //this method use to get the entire information of a model in db instead of just id
        .populate("subs")
        .sort([['createdAt', 'desc']])
        .exec()
    res.json(products)
}

exports.remove = async (req, res) => {
    try {
        const deleted = await Product.findOneAndDelete({ slug: req.params.slug }).exec()
        res.json(deleted)
    } catch (err) {
        console.log(err)
        return res.status(400).send("product delete failed")
    }
}

exports.read = async (req, res) => {
    let product = await Product.findOne({ slug: req.params.slug })
        .populate("category")
        .populate("subs")
        .exec()
    res.json(product)
}

exports.update = async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const updated = await Product.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true }).exec()
        res.json(updated)
    } catch (err) {
        console.log("PRODUCT UPDATE ERROR--", err)
        res.status(400).json(
            {
                err: err.message
            }
        )
    }
}

//without pagination
/* exports.list = async (req, res) => {
    try {
        //createdAt/updatedAt, asc/desc, 4
        const { sort, order, limit } = req.body
        const products = await Product.find({})
            .populate("category")
            .populate("subs")
            .sort([[sort, order]])
            .limit(limit)
            .exec()

        res.json(products)
    } catch (err) {
        console.log(err)
    }
} */

exports.list = async (req, res) => {
    console.table(req.body)
    try {
        //createdAt/updatedAt, asc/desc, 4
        const { sort, order, page } = req.body

        let currentPage = page || 1
        let perPage = 3

        const products = await Product.find({})
            .skip((currentPage - 1) * perPage)
            .populate("category")
            .populate("subs")
            .sort([[sort, order]])
            .limit(perPage)
            .exec()

        res.json(products)
    } catch (err) {
        console.log(err)
    }
}

exports.productsCount = async (req, res) => {
    let total = await Product.find({}).estimatedDocumentCount().exec()
    res.json(total)
}

exports.productStar = async (req, res) => {
    const product = await Product.findById(req.params.productId).exec()
    //who is updating?
    const user = await User.findOne({ email: req.user.email }).exec()
    const { star } = req.body


    //check if currently logged in user have already added rating
    let existingRatingObject = product.ratings.find((ele) => ele.postedBy.toString() === user._id.toString())
    // If user haven't left any rating then push it
    if (existingRatingObject === undefined) {
        let ratingAdded = await Product.findByIdAndUpdate(
            product._id,
            {
                $push: {
                    ratings: {
                        star,
                        postedBy: user._id
                    }
                }
            },
            { new: true }
        ).exec()
        console.log(ratingAdded)
        res.json(ratingAdded)
    } else { //if user has already left rating update it
        const ratingUpdated = await Product.updateOne(
            {
                ratings: { $elemMatch: existingRatingObject },
            },
            { $set: { "ratings.$.star": star } },
            { new: true }
        ).exec()
        console.log(ratingUpdated)
        res.json(ratingUpdated)
    }
}

exports.listRelated = async (req, res) => {
    const product = await Product.findById(req.params.productId).exec()

    const related = await Product.find({
        _id: { $ne: product._id },
        category: product.category,
    })
        .limit(3)
        .populate('category')
        .populate('sub')
        .populate('postedBy')
        .exec()

    res.json(related)
}

// SEARCH/FILTER

const handleQuery = async (req, res, query) => {
    const products = await Product.find({ $text: { $search: query } })
        .populate("category", "_id, name")
        .populate("subs", "_id, name")
        .populate("postedBy", "_id, name")
        .exec();

    res.json(products);
}

const handleCategory = async (req, res, category) => {
    try {
        const products = await Product.find({ category })
            .populate("category", "_id, name")
            .populate("subs", "_id, name")
            .populate("postedBy", "_id, name")
            .exec();

        res.json(products);
    } catch (err) {
        console.log(err);
    }
}

const handleSub = async (req, res, sub) => {
    try {
        const products = await Product.find({ subs: sub })
            .populate("category", "_id, name")
            .populate("subs", "_id, name")
            .populate("postedBy", "_id, name")
            .exec();

        res.json(products);
    } catch (err) {
        console.log(err);
    }
}

const handlePrice = async (req, res, price) => {
    try {
        let products = await Product.find({
            price: {
                $gte: price[0],
                $lte: price[1],
            },
        })
            .populate("category", "_id, name")
            .populate("subs", "_id, name")
            .populate("postedBy", "_id, name")
            .exec();

        res.json(products);
    } catch (err) {
        console.log(err)
    }
};

const handleStars = (req, res, stars) => { //removed async becuase of use of aggregate exec()
    //an aggregation framework query is an array of stages. A stage is an object description of how MongoDB should transform any document coming 
    //into the stage. The first stage feeds documents into the second stage, and so on, so you can compose transformations using stages. 
    //The array of stages you pass to the aggregate() function is called an aggregation pipeline.
    Product.aggregate([
        {
            //The $project stage is extremely useful for filtering a document to show only the fields we need
            $project: {
                document: "$$ROOT", //this gets all properties of document
                //title: "$title",
                floorAverage: {
                    $floor: { $avg: "$ratings.star" },
                },
            },
        },
        { $match: { floorAverage: stars } },
    ])
        .limit(12)
        .exec((err, aggregates) => {
            if (err) console.log("AGGREGATE ERROR", err);
            //console.log(aggregates);
            Product.find({ _id: aggregates }) //why do this step when aggregates already have data? because it's projected/tranformed document, populate functions below will take different args if we use aggregate
                .populate("category", "_id, name")
                .populate("subs", "_id, name")
                .populate("postedBy", "_id, name")
                .exec((err, products) => {
                    if (err) console.log("PRODUCT AGGREGATE ERROR", err);
                    res.json(products);
                });

        });
}

const handleShipping = async (req, res, shipping) => {
    try {
        const products = await Product.find({ shipping })
            .populate("category", "_id, name")
            .populate("subs", "_id, name")
            .populate("postedBy", "_id, name")
            .exec();

        res.json(products);
    } catch (err) {
        console.log(err);
    }
}

const handleColor = async (req, res, color) => {
    try {
        const products = await Product.find({ color })
            .populate("category", "_id, name")
            .populate("subs", "_id, name")
            .populate("postedBy", "_id, name")
            .exec();

        res.json(products);
    } catch (err) {
        console.log(err);
    }
}

const handleBrand = async (req, res, brand) => {
    try {
        const products = await Product.find({ brand })
            .populate("category", "_id, name")
            .populate("subs", "_id, name")
            .populate("postedBy", "_id, name")
            .exec();

        res.json(products);
    } catch (err) {
        console.log(err);
    }
}

exports.searchFilters = async (req, res) => {
    const { query, price, category, stars, sub, shipping, color, brand } = req.body;
    if (query) {
        //console.log('query', query);
        await handleQuery(req, res, query); //helper function
    }

    //price [10, 20]
    if (price !== undefined) {
        //console.log('price', price);
        await handlePrice(req, res, price); //helper function
    }

    if (category) {
        await handleCategory(req, res, category);
    }

    if (stars) {
        await handleStars(req, res, stars);
    }

    if (sub) {
        await handleSub(req, res, sub);
    }

    if (shipping) {
        await handleShipping(req, res, shipping);
    }

    if (color) {
        await handleColor(req, res, color);
    }

    if (brand) {
        await handleBrand(req, res, brand);
    }
}
