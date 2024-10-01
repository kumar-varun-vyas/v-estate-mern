const errorHandler = require("../middlewares/errorHandler")
const { Listing } = require("../models/listing.model")
const customError = require('../utils/customError')
const createListing = async (req, res, next) => {

    try {
        const listing = await Listing.create(req.body)
        return res.status(200).json(listing)
    } catch (err) {
        next(err)
    }
}

const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return next(customError(404, 'Listing not found!'))
    }

    if (req.user.id !== listing.userRef.toString()) {
        return next(customError(401, 'You can only delete your own listings!'))
    }
    try {
        await Listing.findByIdAndDelete(req.params.id)
        res.status(200).json({
            success: true,
            message: "Listing deleted successfully"
        }
        )

    } catch (err) { console.log(err) }

}

const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return next(customError(404, 'Listing not found!'))
    }

    if (req.user.id !== listing.userRef.toString()) {
        return next(customError(401, 'You can only update your own listings!'))
    }
    try {
        let list = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.status(200).json({
            success: true,
            message: "Listing updated successfully",
            data: list
        }
        )

    } catch (err) { console.log(err) }

}
const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        // console.log("listing-----", listing)
        if (!listing) {
            return next(customError(404, 'Listing not found!'))
        }


        res.status(200).json({
            success: true,
            message: "",
            data: listing
        }
        )

    } catch (err) {
        if (err.name === 'CastError') {
            // Handle the CastError
            console.error('CastError:', err.message);
            // Send a user-friendly error response
            next(customError(400, 'Invalid data type'));
        } else {
            next(err)
        }
    }
}

const getListings = async (req, res, next) => {
    try {

        let limit = req.query.limit ? parseInt(req.query.limit) : 9;
        console.log("query-----------", req.query)
        let startIndex = parseInt(req.query.startIndex) || 0;
        let offer = req.query.offer;
        if (!offer) {
            offer = { $in: [false, true] }
        }
        let furnished = req.query.furnished;
        if (!furnished) {
            furnished = { $in: [false, true] }
        }
        let parking = req.query.parking;
        if (!parking) {
            parking = { $in: [false, true] }
        }
        let pet = req.query.pet;
        if (!pet) {
            pet = { $in: [false, true] }
        }
        let type = req.query.type;
        if (!type) {
            type = { $in: ['sale', 'rent'] }
        }
        let searchTerm = req.query.searchTerm || ''
        let sort = req.query.sort || 'createdAt'
        let order = req.query.order || 'desc'
        const listings = await Listing.find({
            name: { $regex: searchTerm, $options: 'i' },
            offer,
            furnished,
            parking,
            type,

        }).sort(
            { [sort]: order }
        ).limit(limit).skip(startIndex)

        res.status(200).json({
            success: true,
            message: "",
            data: listings
        })

    } catch (err) {
        next(err)
    }
}

module.exports = {
    createListing,
    deleteListing,
    updateListing,
    getListing,
    getListings
}