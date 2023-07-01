const express = require('express');
const { User, Spot, Review, ReviewImage, SpotImage, Booking, sequelize } = require('../../db/models');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrorsBookings } = require('../../utils/validation');
const router = express.Router();


const validateCreateBooking = [
    check("startDate")
      .exists({ checkFalsy: true })
      .withMessage("Start Date is required"),
    check("endDate")
      .exists({ checkFalsy: true })
      .withMessage("End date is required"),
      handleValidationErrorsBookings
  ];

  router.get("/current", requireAuth, async (req, res) => {
    let currentUserId = req.user.id;
    currentUserId = parseInt(currentUserId);

    // console.log(currentUserId)

    const bookings = await Booking.findAll({
        where: {
            userId: currentUserId
        },
        include: [
            {
                model: Spot,
                attributes:{exclude:["updatedAt","createdAt"]},
                include: [{ model: SpotImage }]
            }
        ]
    })

    const bookingList = []

    bookings.forEach(booking => {
        bookingList.push(booking.toJSON())
    });

    bookingList.forEach(booking => {
        booking.Spot.SpotImages.forEach(image => {
            if (image.preview === true) {
                booking.Spot.previewImage = image.url
            }
        })

        if (!booking.Spot.previewImage) {
            booking.Spot.previewImage = "no preview image found"
        }
        delete booking.Spot.SpotImages
    })

    res.json({
        "Bookings":bookingList
    })
})

// PUT /api/bookings/:bookingId
router.put('/:bookingId', validateCreateBooking, async (req, res) => {
  let currentBooking = await Booking.findOne({
    where: {id: req.params.bookingId}
  });

  if (!currentBooking) {
    return res.status(404).json({
      "message": "Booking couldn't be found",
      "statusCode": 404})
    } else {
      let currentEnd = new Date(currentBooking.endDate).getTime();
      let {startDate, endDate} = req.body;
      newStart = new Date(startDate).getTime();
      newEnd = new Date(endDate).getTime();
      let bookingJSON = currentBooking.toJSON();
    if (bookingJSON.userId === req.user.id) {
      // find all bookings for the current spot
      let today = new Date().getTime();
      let everyBooking = await Booking.findAll({
        raw: true,
        where: {spotId: currentBooking.spotId}
      })

      everyBooking = everyBooking.filter(booking => booking.id !== currentBooking.id);
        //making sure dates are correct
      if (newEnd < newStart) {
        return res.status(400).json({
          "message": "Validation error",
          "statusCode": 400,
          "errors": {
            "endDate": "endDate cannot come before startDate"
          }
        })
        //cant be same days, so more than 2 days
      } else if (newEnd === newStart){
        return res.status(400).json({
          "message": "Validation error",
          "statusCode": 400,
          "errors": {
            "endDate": "endDate cannot be the same as startDate"
          }
        })
        //Error response with status 403 is given when a booking already exists for the spot on the specified dates
      } else if (currentEnd < today) {
        return res.status(403).json({
          "message": "Past bookings can't be modified",
          "statusCode": 403
        })
      } else {
        // iterate bookings and covering all cases to make sure meets requirements
        for (let i = 0; i < everyBooking.length; i++) {
          let booking = everyBooking[i];
          let start = new Date(booking.startDate).getTime();
          let end = new Date(booking.endDate).getTime();
          if ((newStart === start) && (newEnd === end)) {
            return res.status(403).json({
              "message": "Sorry, this spot's already booked those dates",
              "statusCode": 403,
              "errors": {
                "startDate": "Start date conflicts with an existing booking",
                "endDate": "End date conflicts with an existing booking"
              }})
          } else if ((newStart < newEnd) && (newStart >= start) && (newEnd <= end)) {
            return res.status(403).json({
              "message": "Sorry, this spot's already booked those dates",
              "statusCode": 403,
              "errors": {
                 "startDate": "Start date conflicts with an existing booking",
                 "endDate": "End date conflicts with an existing booking"}})
          } else if ((newStart >= start) && (newStart <= end)) {
            return res.status(403).json({
              "message": "Sorry, this spot's already booked those dates",
              "statusCode": 403,
              "errors": {
                "startDate": "Start date conflicts with an existing booking"}})
          } else if ((newEnd >= start) && (newEnd <= end)) {
            return res.status(403).json({
              "message": "Sorry, this spot's already booked those dates",
              "statusCode": 403,
              "errors": {
                "endDate": "End date conflicts with an existing booking"}})
          } else if ((newStart < start) && (newEnd > end)) {
            return res.status(403).json({
              "message": "Sorry, this spot's already booked those dates",
              "statusCode": 403,
              "errors": {
                 "startDate": "Start date conflicts with an existing booking",
                 "endDate": "End date conflicts with an existing booking"}})
          }
        }
            currentBooking.update({startDate, endDate})
            return res.json(currentBooking);
      }
    } else {
      return res.status(404).json("You are not authorized to update this booking.")
    }
  }
})

// DELETE /api/bookings/:bookingId
router.delete('/:bookingId', requireAuth, async(req,res) => {
  let booking = await Booking.findOne({
    // raw: true,
    where: {id: req.params.bookingId}
  });
  if (!booking) {
    res.status(404);
    return res.json({
      "message": "Booking couldn't be found",
      "statusCode": 404
    })
  } else {
    let bookingStart = new Date(booking.startDate).getTime();
    let bookingEnd = new Date(booking.endDate).getTime();
    if (booking.userId === req.user.id) {
      let today = new Date().getTime();
      if ((bookingStart <= today) && (bookingEnd >= today)) {
        res.status(400);
        return res.json({
          "message": "Bookings that have been started can't be deleted",
          "statusCode": 403
        })
      } else {
        await booking.destroy();
        return res.json({
          "message": "Successfully deleted",
          "statusCode": 200
        })
      }
    } else {
      res.status(404);
      return res.json("You are not authorized to delete this booking")
    }
  }
})


module.exports = router;
