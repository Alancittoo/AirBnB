import { useDispatch } from "react-redux";
import { deleteReviewThunk, getCurrentUserReviewsThunk } from "../../store/reviewReducer";
import "./confirmModalReview.css";

const ConfirmModalReview = ({ reviewId, onModalClose, onDelete }) => {
    const dispatch = useDispatch()

    const handleConfirm = () => {
    onModalClose();
    dispatch(deleteReviewThunk(reviewId));
  };

  return (
    <div className="confirmModalReview-div">
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to delete this review?</p>
      <div className="confirmModalReview-buttons">
        <button className="confirmModalReview-yes" onClick={handleConfirm}>
          Yes (Delete Review)
        </button>
        <button className="confirmModalReview-no" onClick={onModalClose}>
          No (Keep Review)
        </button>
      </div>
    </div>
  );
};

export default ConfirmModalReview;
