import { useState } from "react";
import { useDispatch } from "react-redux";
import { thunkCreateReview, thunkGetCurrentReviews } from "../../store/reviewReducer";
import { useModal } from "../../context/Modal";
import "./reviewModal.css";

const PostReviewModal = ({ spotId, onModalClose }) => {
  const dispatch = useDispatch();

  const [stars, setStars] = useState([false, false, false, false, false]);
  const [clickedStars, setClickedStars] = useState([false, false, false, false, false]);
  const [hoverStars, setHoverStars] = useState([false, false, false, false, false]);
  // const [reviewStar, setReviewStar] = useState(0);
  const [review, setReview] = useState("");
  const name = spotId;
  const { closeModal } = useModal();

  const handleStarHover = (index) => {
    const newStars = new Array(5).fill(false);
    for (let i = 0; i <= index; i++) {
      newStars[i] = true;
    }
    setHoverStars(newStars);
  };

  const handleStarLeave = () => {
    setHoverStars(clickedStars);
  };

  const handleStarClick = (index) => {
    const newStars = new Array(5).fill(false);
    for (let i = 0; i <= index; i++) {
      newStars[i] = true;
    }
    setClickedStars(newStars);
    setHoverStars(newStars)
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      thunkCreateReview({
        spotId,
        stars: clickedStars.filter((star) => star).length, // Count number filled stars
        review,
      })
    ).then(() => {
      dispatch(thunkGetCurrentReviews(spotId));  // grabs reviewws again hopefully
    });
    // dispatch(thunkGetCurrentReviews())
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
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              onMouseEnter={() => handleStarHover(i)}
              onMouseLeave={handleStarLeave}
              onClick={() => handleStarClick(i)}
            >
              {hoverStars[i] ? <span>★</span> : <span>☆</span>}
            </div>
          ))}
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
