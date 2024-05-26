const { Listing } = require("../models/listing.model")

const createListing = async (req, res, next) => {

    try {
        const listing = await Listing.create(req.body)
        return res.status(200).json(listing)
    } catch (err) {
        next(err)
    }
}

module.exports = {
    createListing
}