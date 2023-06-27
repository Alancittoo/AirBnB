import { useDispatch } from "react-redux";
import { thunkDeleteBooking } from "../../store/bookingsReducer";
// import "./confirmModalReview.css";

const ConfirmModalBooking = ({ bookingId, onModalClose, onDelete }) => {
    const dispatch = useDispatch()

    const handleConfirm = () => {
    onModalClose();
    dispatch(thunkDeleteBooking(bookingId));
  };

  return (
    <div className="confirmModalReview-div">
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to delete this review?</p>
      <div className="confirmModalReview-buttons">
        <button className="confirmModalReview-yes" onClick={handleConfirm}>
          Yes (Delete Booking)
        </button>
        <button className="confirmModalReview-no" onClick={onModalClose}>
          No (Keep Booking)
        </button>
      </div>
    </div>
  );
};

export default ConfirmModalBooking;
