import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkCreateBooking } from '../../store/bookingsReducer';
import { useModal } from '../../context/Modal';
// import './bookingModal.css';

const BookingModal = ({ spotId }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const userId = useSelector(state => state.session.user.id);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const booking = {
      spotId,
      userId,
      startDate,
      endDate,
    };

    const res = await dispatch(thunkCreateBooking(booking));
    if (!res.errors) {
        // console.log("CREATEBOOKING PASS")
        closeModal();
    } else {
        // console.log("CREATEBOOKING FAIL")
    }
  };

  return (
    <div className="create-booking-main-div">
      <h1>Book your stay at {spotId.name}</h1>

      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />

      <button onClick={handleSubmit} className="submit-booking-button">
        Book
      </button>
    </div>
  );
};

export default BookingModal;
