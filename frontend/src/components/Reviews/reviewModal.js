import { useState } from "react";
import { useDispatch } from "react-redux";
import { createReviewThunk } from "../../store/reviewReducer";
import { useModal } from "../../context/Modal";
import "./reviewModal.css";

const PostReviewModal = ({ spotId, onModalClose }) => {
  const dispatch = useDispatch();

  const [stars, setStars] = useState([false, false, false, false, false]);
  const [reviewStar, setReviewStar] = useState(0);
  const [review, setReview] = useState("");
  const name = spotId;
  const { closeModal } = useModal();

  const handleStarHover = (index) => {
    const newStars = new Array(5).fill(false);
    for (let i = 0; i <= index; i++) {
      newStars[i] = true;
    }
    setStars(newStars);
  };

  const handleStarClick = (index) => {
    const newStars = new Array(5).fill(false);
    for (let i = 0; i <= index; i++) {
      newStars[i] = true;
    }
    setStars(newStars);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      createReviewThunk({
        spotId,
        stars: stars.filter((star) => star).length, // Count number filled stars
        review,
      })
    );
    closeModal();
  };

  return (
    <>
      <div className="create-review-main-div">
        <h1>How was your stay at {name.name}? </h1>
        <textarea
          placeholder="Leave your review here..."
          rows="15"
          cols="100"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          required
        ></textarea>
        <div className="rating-div">
          <div
            onMouseEnter={() => handleStarHover(0)}
            onClick={() => handleStarClick(0)}
          >
            {stars[0] ? <span>★</span> : <span>☆</span>}
          </div>
          <div
            onMouseEnter={() => handleStarHover(1)}
            onClick={() => handleStarClick(1)}
          >
            {stars[1] ? <span>★</span> : <span>☆</span>}
          </div>
          <div
            onMouseEnter={() => handleStarHover(2)}
            onClick={() => handleStarClick(2)}
          >
            {stars[2] ? <span>★</span> : <span>☆</span>}
          </div>
          <div
            onMouseEnter={() => handleStarHover(3)}
            onClick={() => handleStarClick(3)}
            >
              {stars[3] ? <span>★</span> : <span>☆</span>}
          </div>
          <div
            onMouseEnter={() => handleStarHover(4)}
            onClick={() => handleStarClick(4)}
            >
              {stars[4] ? <span>★</span> : <span>☆</span>}
          </div>
          <span className="stars-text">Stars</span>
        </div>
        <div className="submit-review-div">
          <button onClick={handleSubmit} className="submit-review-button">
            Submit Your Review
          </button>
        </div>
      </div>
    </>
  );
};

export default PostReviewModal;
