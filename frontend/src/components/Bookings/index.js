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

const BookingsIndex = () => {
    const dispatch = useDispatch();
    const bookings = useSelector(state => state.bookings ? Object.values(state.bookings) : []); // test out and hope
    const user = useSelector(state => state.session.user);
    const spot = useSelector(state => state.spots)
    const { closeModal } = useModal();

    useEffect(() => {
        if (user) {
            dispatch(thunkGetCurrentBookings(user.id));
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
            {bookings.map((booking) => (
                <div key={booking.id}>
                    <h2>Booking ID: {booking.id}</h2>
                    <Link to={`/spot/${booking.spotId}`}>Spot Name: {spot[booking.spotId]?.name}</Link>
                    <p>Start Date: {new Date(booking.startDate).toLocaleDateString()}</p>
                    <p>End Date: {new Date(booking.endDate).toLocaleDateString()}</p>
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
                </div>
            ))}
        </div>
    );
};

export default BookingsIndex;
