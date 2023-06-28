import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { thunkUpdateBooking } from '../../store/bookingsReducer';

const UpdateBookingModal = ({ bookingId, onModalClose }) => {
  const dispatch = useDispatch();

  // state for form inputs
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedBooking = {
      startDate,
      endDate
    };

    const res = await dispatch(thunkUpdateBooking(bookingId, updatedBooking));

    if (!res.errors) {

    }
    onModalClose()
  };

  return (
    <div>
      <h1>Update Booking</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <button type="submit">Update Booking</button>
        <button onClick={onModalClose}>Cancel</button>
      </form>
    </div>
  );
};

export default UpdateBookingModal;