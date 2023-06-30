import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { thunkUpdateBooking } from '../../store/bookingsReducer';

const UpdateBookingModal = ({ bookingId, onModalClose }) => {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    const updatedBooking = {
      startDate,
      endDate
    };
    console.log(bookingId, updatedBooking)

    const res = await dispatch(thunkUpdateBooking(bookingId, updatedBooking));

    if (!res.errors) {

    }
    onModalClose()
  };

  return (
    <div className='Update-Booking'>
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
      {errorMessage && <p style={{color: "red"}}>{errorMessage}</p>}

        <button className="delete-review-in-spot" type="submit">Update Booking</button>
        <button className="delete-review-in-spot"onClick={onModalClose}>Cancel</button>
      </form>
    </div>
  );
};

export default UpdateBookingModal;
