import { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import { Link } from "react-router-dom";
import LoginFormModal from "../LoginFormModal";
import ConfirmModalReview from "./confirmModalReview";
import { useModal } from "../../context/Modal";
import { thunkGetCurrentReviews, thunkDeleteReview } from "../../store/reviewReducer";
import './review.css'

const ReviewIndex = () => {
  const reviewsObj = useSelector((state) => state.reviews);
  const reviews = Object.values(reviewsObj);
  const [showMenu, setShowMenu] = useState(false);
  const {closeModal} = useModal()
  const [showModal, setShowModal] = useState(false);


  const closeMenu = () => setShowMenu(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(thunkGetCurrentReviews());
  }, [dispatch]);

  const month = [
    'empty',
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const deleteReview = (e, reviewId) => {
    e.preventDefault()
    dispatch(thunkDeleteReview(reviewId))
    setShowModal(false); // Hide modal when delete is complete
  }


  return (
    <>
      <h1>Manage Reviews</h1>
      {reviews.length > 0 ? (
        reviews.map((review) => {
        // console.log("CURRENTREVIEW =>", review);
        const reviewMonth = review.createdAt.split("")[6];
        const year = review.createdAt.split("-")[0];
        return (
          <>
            <div className="review-block">
              <h2>{review.Spot?.name}</h2>
              <p>
                {month[reviewMonth]}, {year}
              </p>
              <p>{review?.review}</p>
              <button className="delete-review-in-spot" >
              <OpenModalMenuItem
              itemText="Delete"
              onItemClick={closeMenu}
              modalComponent=
              {<ConfirmModalReview
              onModalClose={closeModal}
              reviewId={review.id}
              onDelete={deleteReview}
              />}
            />
            </button>
            </div>
          </>
        );
      })
) : (
    <div>
        <p>No reviews yet. Click on a spot you don't own to leave a review!</p>
    </div>
)}

    </>
  );
};

export default ReviewIndex;


// <button
//               className="delete-review-button"

//               onClick={(e) => deleteReview(e, review.id)}>Delete</button>
