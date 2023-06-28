import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkCreateBooking } from '../../store/bookingsReducer';
import { thunkGetAllSpots } from '../../store/spotsReducer';
import { useModal } from '../../context/Modal';
import { useEffect } from 'react';
import './Bookings.css'


const BookingModal = ({ spotId }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [errorMessage, setErrorMessage] = useState("");
  const user = useSelector(state => state.session.user);
  const spots = useSelector(state => Object.values(state.spots))
  const spot = spots.find(spot => spot.id === spotId);

  // useEffect(() => {
  //   if (user) {
  //     dispatch(thunkGetAllSpots())
  //   }
  // }
  // )

  const userId = useSelector(state => state.session.user.id);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (newStartDate < now || newEndDate < now) {
      setErrorMessage("Booking dates can't be in the past.");
      return;
    }
    if (newStartDate == now || newEndDate == now){
      setErrorMessage("Booking dates can't be current date.");
      return;
    }

    const booking = {
      spotId,
      userId,
      startDate: newStartDate,
      endDate: newEndDate
    };

    const res = await dispatch(thunkCreateBooking(booking));
    if (!res.errors) {
      closeModal();
    } else {
      setErrorMessage(res.errors);
    }
  };

  return (
    <div className="create-booking-main-div" style={{borderRadius: "55px", }}>
      <h1>Book your stay at {spot && spot.name}</h1>
      {console.log(spots.name)}
      <div className='create-booking-inputs'>
      <input
        style={{margin: "10px"}}
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      {errorMessage && <p>{errorMessage}</p>}
      <button onClick={handleSubmit} style={{margin: "10px"}} className="delete-review-in-spot">
        Book
      </button>
      </div>
    </div>
  );
};

export default BookingModal;
