import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { thunkDeleteBooking, thunkGetCurrentBookings } from '../../store/bookingsReducer';
import './Bookings.css'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import { useModal } from '../../context/Modal';
import ConfirmModalBooking from './ConfirmModalBooking';
import UpdateModalBooking from './UpdateModalBooking';
import { thunkGetAllSpots } from '../../store/spotsReducer';
import './Bookings.css'

const BookingsIndex = () => {
    const dispatch = useDispatch();
    const bookings = useSelector(state => state.bookings ? Object.values(state.bookings) : []); // test out and hope
    const user = useSelector(state => state.session.user);
    const spot = useSelector(state => state.spots)
    const { closeModal } = useModal();

    function formatDate(dateString) {
        const [year, month, day] = dateString.split('T')[0].split('-');
        return `${year}-${month}-${day}`;
    }

    const isBookingInProgress = (booking) => {
        const now = new Date();
        const startDate = new Date(booking.startDate);
        const endDate = new Date(booking.endDate);

        return now >= startDate && now <= endDate;
    }

    const isBookingCompleted = (booking) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const endDate = new Date(booking.endDate);

        return endDate < today;
    }

    useEffect(() => {
        if (user) {
            dispatch(thunkGetCurrentBookings(user.id));
            dispatch(thunkGetAllSpots())
        }
    }, [dispatch, user]);

    if (!bookings) {
        return null;
    }

    const deleteBooking = (e, bookingId) => {
        e.preventDefault()
        dispatch(thunkDeleteBooking(bookingId))
    }

    return (
        <div>
            <h1>Your Bookings</h1>
            {bookings.length > 0 ? (
             bookings.map((booking) => (
                <div key={booking.id}>
                    <h2>Booking ID: {booking.id}</h2>
                    <Link to={`/spot/${booking.spotId}`}>Spot Name: {spot[booking.spotId]?.name}</Link>
                    <p>Start Date: {formatDate(booking.startDate)}</p>
                    <p>End Date: {formatDate(booking.endDate)}</p>
                    {isBookingInProgress(booking) ? (
                        <p style={{ textDecoration: "underline" }}>Booking is already in progress</p>
                    ) : isBookingCompleted(booking) ? (
                        <p style={{ textDecoration: "underline" }}>This booking was completed.</p>
                    ) : (
                        <>
                            <button className="delete-review-in-spot">
                                <OpenModalMenuItem
                                    itemText="Cancel"
                                    modalComponent=
                                    {<ConfirmModalBooking
                                        onModalClose={closeModal}
                                        bookingId={booking.id}
                                        onDelete={deleteBooking}
                                    />}
                                />
                            </button>
                            <button className="delete-review-in-spot">
                                <OpenModalMenuItem
                                    itemText="Update"
                                    modalComponent=
                                    {<UpdateModalBooking
                                        onModalClose={closeModal}
                                        bookingId={booking.id}
                                    />}
                                />
                            </button>
                        </>
                    )}
                </div>
            ))
            ) : (
                <div>
                    <p>No bookings available. Click on a spot and reserve it to see your booking here!</p>
                </div>
            )}
        </div>
    );
};

export default BookingsIndex;
