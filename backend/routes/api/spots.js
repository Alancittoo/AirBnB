const express = require('express');
const { User, Spot, Review, SpotImage, ReviewImage, Booking, Sequelize } = require('../../db/models');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const {check }= require('express-validator')
const { handleValidationErrors } = require('../../utils/auth')
const { handleValidationErrorsSpots, handleValidationErrorsBookings} = require('../../utils/validation');
const { DATEONLY } = require('sequelize');
const Op = Sequelize.Op

const router = express.Router();

// making sure all spots are filled
const validatingSpots = (address, city, state, country, lat, lng, name, description, price) => {
    let errors = []
    lat = Number(lat)
    lng = Number(lng)
    if(!address) errors.push('Street address is required')
    if(!city) errors.push('City is required')
    if(!state) errors.push('State is required')
    if(!country) errors.push('Country is required')

    //fix the lng and lat error

    // if(typeof lat !=="number") errors.push('latitude must be a number')
    // if(typeof lng !=="number") errors.push('longitutde must be a number')


    check('lat')
    .notEmpty()
    .isDecimal()
    .withMessage('Latitude is not valid');
    check('lng')
    .notEmpty()
    .isDecimal()
    .withMessage('Longitude is required');


    if(!name) errors.push('Name is required')
    if(name.length > 30) errors.push('Name must be less than 30 characters')
    if(!description) errors.push('Description is required')
    if(!price) errors.push('Price per day is required')
    if(price < 1) errors.push('Price must be a positive integer')
    return errors
}

const validatingReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required.'),
    check('stars')
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5.'),
    handleValidationErrors
]

// Get All Spots Feature
router.get('/', async (req, res) => {

    // Initialize a query object with empty "where" and "include" properties
    let query = {
        where: {},
        include: []
    }
// Retrieve "page" and "size" parameters from the request query string
const page = req.query.page;
const size = req.query.size;

page = parseInt(page);
    size = parseInt(size);

    if (Number.isNaN(page)) page = 1;
    if (Number.isNaN(size)) size = 20;

// If "page" and "size" are both present and greater than 0, add a "limit" and "offset" property to the query object
if (page > 0 && page < 11 && size > 0 && size < 21) {
        query.limit = size;
        query.offset = size * (page - 1);
    }

// Check for various query parameters to filter results based on latitude, longitude, and price range
  if(req.query.minLat){
    query.where.lat= {[Op.gte] : minLat}
}
if(req.query.maxLat){
    query.where.lat = {[Op.lte]: maxLat}
}
if(req.query.minLng){
    query.where.lng = {[Op.gte] : minLng}
}
if(req.query.maxLng){
    query.where.lng = {[Op.lte]: maxLng}
}
if(req.query.minPrice < 0){
    req.query.minPrice = 0
}
if(req.query.maxPrice < 0){
    req.query.maxPrice = 0
}
if(req.query.minPrice){
    query.where.price = {[Op.gte]: minPrice}
}
if(req.query.maxPrice){
    query.where.price = {[Op.lte]: maxPrice}
}

// Perform a database query to retrieve all matching "Spots" with associated reviews and images, using the "query" object
//         grab all spots
let Spots = await Spot.scope('getAll').findAll(query)

// For each "Spot" in the result set, retrieve its reviews and preview image(s), and calculate the average rating
//grabbing all spots and the images/reviews
    for(let spot of Spots){

        // Retrieve reviews for the current "Spot"
        let reviews = await Review.findAll({
            where: {
                spotId: spot.id
            }
                })

        // Retrieve preview images for the current "Spot"
        let previewImage = await SpotImage.findAll({
            where: {
                spotId: spot.id,
                preview: true
                }
            })

            // Convert the "previewImage" array to a string and parse it back to an object to access its properties
            let previewImageString = JSON.stringify(previewImage)
            let previewImageObj = JSON.parse(previewImageString)
            let url;

            // If a preview image is available, retrieve its URL
        if(previewImageObj[0]){
            url = previewImageObj[0].url
        }

        // Calculate the average rating for the "Spot"
        let reviewSum = 0;
        for (let review of reviews){
            reviewSum += review.stars
        }
        let reviewAverageNum = reviewSum / reviews.length;
        let reviewAverage = reviewAverageNum.toFixed(1)

        // Add the average rating and preview image URL (if available) to the "Spot" object
        spot.setDataValue('avgRating', reviewAverage)
        if(url){
        spot.setDataValue('previewImage', url)
        }
    }

// // If "page" or "size" parameters were provided in the request query string, include them in the response
// if(page || size){
//     return res.json({
//         Spots,
//         page,
//         size
//     })
// }
return res.json({Spots})
});


// Create a new Spot
router.post('/', restoreUser, requireAuth, async(req, res)=>{
    const {address, city, state, country, lat, lng, name, description, price} = req.body;
    let ownerDataObj = await User.scope("currentUser").findByPk(req.user.id)
    let ownerDataString = JSON.stringify(ownerDataObj)
    let owner = JSON.parse(ownerDataString)
    let errorsArr = validatingSpots(address, city, state, country, lat, lng, name, description, price)
     if(errorsArr.length){
        res.status(400)

        return res.json({
          message: "Validation error",
          statusCode: 400,
          errors: errorsArr
        })
      }

    let newSpot = await Spot.create({
        ownerId: owner.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })


    if(!newSpot){
        res.status(400)
        return res.json({
            message: 'Validation Error',
            statusCode: 400,
            errors: {
                address: 'Street address is required',
                city: 'City is required',
                state: 'State is required',
                country: 'Country is required',
                lat: 'Latitude is not valid',
                lng: 'Longitude is not valid',
                name: 'Name must be less than 50 characters',
                description: 'Description is required',
                price: 'Price per day is required'
                    }
                })
        }
        res.status(201)
        res.json(newSpot)
});

//CREATE SPOTS IMAGE OF CURRENT USER
router.post('/:spotId/images', restoreUser, requireAuth, async(req, res) => {
    const {spotId, url, preview} = req.body;
    let spotIdObj = req.params;

    let spotExists = await Spot.findByPk(spotIdObj.spotId)

    if(!spotExists){
        res.status(404)
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
    let newImage = await SpotImage.scope("currentSpot").create({
        spotId: spotIdObj.spotId,
        url,
        preview
    })

    console.log(spotIdObj.spotId)

    res.status(200);
    res.json({
        spotId,
        url,
        preview,
    })
} )

//GET SPOTS OF CURRENT USER
router.get("/current", restoreUser, requireAuth, async (req, res) => {
    let userSpots = await Spot.scope('getAll').findAll({
      raw: true,
      where: {ownerId: req.user.id}
    });
    for (let spot of userSpots) {
      // add average rating
      let review = await Review.findAll({
        raw: true,
        attributes: [[Sequelize.fn("avg", Sequelize.col("stars")), "avgStarRating"]],
        where: {spotId: spot.id}
      });

      if (review) {
        spot.avgRating = review[0].avgStarRating;
        spot.avgRating.toFixed(1)
      } else {
        spot.avgRating = null;
      }
      // add preview image
      let previewImageURL = await SpotImage.findOne({
        raw: true,
        attributes: ["url"],
        where: {
          spotId: spot.id,
          preview: true
        }
      });

      if (previewImageURL) {
        spot.previewImage = previewImageURL.url;
      } else {
        spot.previewImage = null;
      }
    }
    return res.json({ Spots: userSpots });
  });

// GET DETAILS OF A SPOT BY ID
router.get('/:spotId', async (req, res) => {
    //grab all spots while having access to Reviews, without showing Reveiw data
    let spot = await Spot.findByPk(req.params.spotId)
    if(!spot){
        res.status(404)
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
            //grab all reviews
            let reviews = await Review.findAll({
                where: {
                    spotId: spot.id
                }
                    })
            //grab all spot images
            let spotImages = await spot.getSpotImages()
            //find correct spot
            let ownerObj = await User.scope("public").findByPk(spot.ownerId)
            let owner = {}
            owner.id = ownerObj.id;
            owner.firstName = ownerObj.firstName;
            owner.lastName = ownerObj.lastName

            //itterate through review to add all the star reviews
            let reviewSum = 0;
            for (let review of reviews){
                reviewSum += review.stars
            }
            let numReviews = reviews.length;
            let reviewAverageNum = reviewSum / reviews.length;
            let reviewAverage = reviewAverageNum.toFixed(1)
            //set the data into each spot
            if(!numReviews){
                numReviews = 0
            }
            spot.setDataValue('numReviews', numReviews)
            if(reviewAverage) spot.setDataValue('avgRating', reviewAverage);
            if(spotImages) spot.setDataValue('SpotImages', spotImages);
            if(owner) spot.setDataValue('Owner', owner);

    return res.json(spot)
    });

    // EDIT SPOT
    router.put("/:spotId", requireAuth, validatingSpots, async (req, res) => {
        let { spotId } = req.params;
        spotId = parseInt(spotId)

        const { address, city, state, country, lat, lng, name, description, price } = req.body
        const targetSpot = await Spot.scope('getAll').findOne({
            where: {
                id: spotId
            }
        })
        //current user must be the owner
        const ownerId = targetSpot.ownerId
        let spot = await Spot.findByPk(req.params.spotId);
        if (!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found",
                statusCode: 404,


            })

        }

        if (ownerId !== req.user.id) {
            const err = new Error("Forbidden");
            err.status = 403;
            err.error = "Forbidden"
            res.status(403)
            return res.json(err)
        }

        if (targetSpot && ownerId === req.user.id) {
            targetSpot.update({
                address,
                city,
                state,
                country,
                lat,
                lng,
                name,
                description,
                price
            })
            res.json(targetSpot)
        }
    })

    //CREATE REVIEW FOR A SPOT
    router.post('/:spotId/reviews', requireAuth, async (req, res, next) => {
        const {user} = req
        const {review, stars} = req.body

        const spot = await Spot.findByPk(req.params.spotId)

        if (!spot) {
            let err = new Error('Spot couldn\'t be found')
            err.status = 404
            return next(err)
        }

        const targetReviews = await Review.findAll({
            where: {
                spotId
            }
        })

        for (let review of targetReviews) {
            if (review.userId === currentUserId) {
                const err = new Error("User already has a review for this spot");
                err.status = 403;
                err.error = "User already has a review for this spot"
                res.status(403)
                return res.json(err)
            }
        }

        let errorArr = []
        if (!review) errorArr.push('Review text is required')
        if (!stars || stars < 1 || stars > 5) errorArr.push('Stars must be an integer from 1 to 5')

        if (errorArr.length > 0) {
            let err = new Error('Validation error')
            err.status = 400
            err.errors = errorArr
            return next(err)
        }

        let newReview = await Review.create({
            userId: user.id,
            review: review,
            stars: stars,
            spotId: spot.id
        })

        res.status(201).json(newReview)
    })

    ////GET REVIEWS BY SPOT ID
    router.get('/:spotId/reviews', async (req, res, next) => {
        const spot = await Spot.findByPk(req.params.spotId)
        if (!spot) {
            let err = new Error('Spot couldn\'t be found')
            err.status = 404
            return next(err)
        }

        let reviews = await Review.findAll({
            where: {
                spotId: req.params.spotId
            },
            include: {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }
        })

        let reviewsArr = []
        for (let review of reviews) {
            let reviewJSON = review.toJSON()
            let reviewImages = await review.getReviewImages({
                attributes: ['id', 'url']
            })

            let imageArr = []
            for (let image of reviewImages) {
                let imageJSON = image.toJSON()
                imageArr.push(imageJSON)
            }

            reviewJSON['ReviewImages'] = imageArr
            reviewsArr.push(reviewJSON)
        }

        res.json({"Reviews":reviewsArr})
    })

    // POST A BOOKING
    router.post("/:spotId/bookings", requireAuth, async (req, res) => {
        let { spotId } = req.params
        spotId = parseInt(spotId)
        const { startDate, endDate } = req.body
        const theSpot = await Spot.findOne({
            where: {
                id: spotId
            }
        })

        if (!theSpot) {
            return res.status(404).json({
                message: "Spot couldn't be found",
                statusCode: 404,


            })
        }

        const ownerId = theSpot.ownerId
        const currentUserId = req.user.id

        if (ownerId === currentUserId) {
            const err = new Error("Owner is not allowed to book his/her own spots");
            err.status = 404;
            err.error = "Owner is not allowed to book his/her own spots"
            return res.status(404).json(err)
        }

        const start = new Date(startDate)
        const end = new Date(endDate)

        if (start.getTime() > end.getTime()) {
            return res.status(400).json({
                message: "Validation error",
                statusCode: 400,
                errors: {
                    "endDate": "endDate cannot be on or before startDate"
                }
            })
        }
        const exsitBookings = await Booking.findAll(
            {
                where: {
                    spotId
                }
            }
        )
        for (let booking of exsitBookings) {
            const existingStart = booking.startDate.getTime()
            const existingEnd = booking.endDate.getTime()
            if (start.getTime() <= existingEnd && start.getTime() >= existingStart) {
                res.status(403);
                return res.json({
                    message: "Sorry, this spot is already booked for the specified dates",
                    statusCode: 403,
                    errors: {
                        startDate: "Start date conflicts with an existing booking",
                        endDate: "End date conflicts with an existing booking"
                    }
                })
            }
            if (end.getTime() <= existingEnd && end.getTime() >= existingStart) {
                res.status(403);
                return res.json({
                    message: "Sorry, this spot is already booked for the specified dates",
                    statusCode: 403,
                    errors: {
                        startDate: "Start date conflicts with an existing booking",
                        endDate: "End date conflicts with an existing booking"
                    }
                })
            }
            if (start.getTime() <= existingStart && end.getTime() >= existingEnd) {
                res.status(403);
                return res.json({
                    message: "Sorry, this spot is already booked for the specified dates",
                    statusCode: 403,
                    errors: {
                        startDate: "Start date conflicts with an existing booking",
                        endDate: "End date conflicts with an existing booking"
                    }
                })

            }

        }
        if (start.getTime() < end.getTime()) {

            const newBooking = await Booking.create({
                startDate,//the date format does not matter
                endDate,
                spotId,
                userId: currentUserId

            })
            const newId = newBooking.id
            const result = await Booking.findOne({
                where: {
                    id: newId
                }
            })
            res.json(result)
        }
    })

//GET BOOKINGS FOR A SPOT BASED ON THE SPOT ID
router.get("/:spotId/bookings", requireAuth, async (req, res) => {
    let { spotId } = req.params
    spotId = parseInt(spotId)

    const bookings = await Booking.findOne({
        where: {
            spotId
        },
        include: [{
            model: User,
            attributes: ["id", "firstName", "lastName"]
        }]
    })

    const leBooking = await Booking.findOne({
        where: {
            spotId
        },
        attributes: ["spotId", "startDate", "endDate"]
    })

    if (!bookings) {
        res.status(404);
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404,

        })
    }

    const userId = bookings.userId
    const currentUserId = req.user.id

    if (userId == currentUserId) {
        res.json({
            "Bookings": [bookings]
        })
    } else if (userId != currentUserId) {
        res.json({
            "Bookings": [leBooking]
        })
    }
    res.json(bookings)
})

    // DELETE SPOT
    router.delete("/:spotId", requireAuth, async (req, res) => {
        let { spotId } = req.params
        spotId = parseInt(spotId)

        const theSpot = await Spot.findOne({
            where: {
                id: spotId
            }
        })

        if (!theSpot) {
            const err = new Error("Spot couldn't be found");
            err.status = 404;
            err.error = "Spot couldn't be found"
            res.status(404)
            return res.json(err)

        }

        const ownerId = theSpot.ownerId
        const currentUserId = req.user.id

        if (ownerId !== currentUserId) {
            const err = new Error("Forbidden");
            err.status = 404;

            err.error = "Forbidden"
            res.status(404)
            return res.json(err)

        } else if (ownerId === currentUserId) {
            await theSpot.destroy()
            return res.status(200).json({
                message: "Successfully deleted"
            })
        }
    })



module.exports = router;
