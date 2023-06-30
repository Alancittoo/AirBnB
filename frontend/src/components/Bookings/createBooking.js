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

    if (!startDate || !endDate) {
      setErrorMessage("Please select both a start and end date.");
      return;
    }

    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (newStartDate.toISOString().slice(0, 10) <= now.toISOString().slice(0, 10) || newEndDate.toISOString().slice(0, 10) <= now.toISOString().slice(0, 10)) {
      if (newStartDate.toISOString().slice(0, 10) === now.toISOString().slice(0, 10) || newEndDate.toISOString().slice(0, 10) === now.toISOString().slice(0, 10)) {
        setErrorMessage("Booking dates can't be current date.");
      } else {
        setErrorMessage("Booking dates can't be in the past.");
      }
      return;
    }

    if (newEndDate.toISOString().slice(0, 10) < newStartDate.toISOString().slice(0, 10)) {
      setErrorMessage("End date can't be earlier than start date.");
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
      <label style={{marginRight: '10px'}}>Start Date</label>
      <input
        style={{margin: "10px"}}
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <label style={{marginRight: '10px'}}>End Date</label>
      <input
        type="date"
        style={{margin: "10px"}}
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      {errorMessage && <p style={{color: "red"}}>{errorMessage}</p>}
      <br/>
      <button onClick={handleSubmit} style={{margin: "10px"}} className="delete-review-in-spot">
        Book
      </button>
      </div>
    </div>
  );
};

export default BookingModal;
