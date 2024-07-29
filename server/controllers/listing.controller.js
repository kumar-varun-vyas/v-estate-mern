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
        console.log("listing-----", listing)
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

module.exports = {
    createListing,
    deleteListing,
    updateListing,
    getListing
}