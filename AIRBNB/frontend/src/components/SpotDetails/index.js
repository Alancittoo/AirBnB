import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetSpotDetail } from "../../store/spotsReducer";
import { getAllReviewsThunk, thunkDeleteReview } from "../../store/reviewReducer";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import PostReviewModal from "../Reviews/reviewModal";
import ConfirmModalReview from "../Reviews/confirmModalReview";
import "./spotDetails.css";
import { useModal } from "../../context/Modal";
import BookingModal from "../Bookings/createBooking";

const SpotIndex = () => {
  const sessionUser = useSelector((state) => state.session.user);
  const spotObj = useSelector((state) => state.spots);
  const reviewObj = useSelector((state) => state.reviews);
  const review = Object.values(reviewObj);
  const spot = Object.values(spotObj);
  const { spotId } = useParams();
  const { closeModal } = useModal();
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);


  let hasReviewd = review.find((rev) => rev.userId === sessionUser?.id);

  const closeMenu = () => setShowMenu(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(thunkGetSpotDetail(spotId));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllReviewsThunk(spotId));
  }, [dispatch]);

  const deleteReview = (e, reviewId) => {
    e.preventDefault();
    dispatch(thunkDeleteReview(reviewId));
    setShowModal(false); // Hide modal when delete is complete
  };
  const month = [
    0,
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

  return (
    <>
      {spot.map((oneSpot) => {
        console.log(oneSpot)
        return (
          <>
            <h1 className="spot-name-h1">{oneSpot.name}</h1>
            <p>
              Location: {oneSpot.city}, {oneSpot.state}, {oneSpot.country}
            </p>
            <div className="spot-images-styling">
              <div className="preview-image-div">
                <img src={oneSpot.SpotImages?.[0]?.url}></img>
              </div>
              <div className="spot-images-div">
                {oneSpot.SpotImages?.length ? (
                  oneSpot.SpotImages.slice(1).map((img) => (
                    <img className="spot-detail-images" src={img.url}></img>
                  ))
                ) : (
                  <img src=""></img>
                )}
              </div>
            </div>
            <div className="wrapper-info-reserve">
              <div className="spot-info-div">
                <h4>
                  Hosted by: {oneSpot.Owner?.firstName}{" "}
                  {oneSpot.Owner?.lastName}
                </h4>
                <p>{oneSpot.description}</p>
              </div>
              <div className="reserve-button-div">
                <div className="price-div">
                  <p>${oneSpot.price} night</p>
                  <p>★ {oneSpot.avgRating !== null && !isNaN(oneSpot.avgRating)
                    ? oneSpot.avgRating
                    : 'New'}</p>
                  <p>Reviews: {oneSpot.numReviews}</p>
                </div>
                <button
                  className="reserve-button"
                  // onClick={() => alert("Feature coming soon")}
                >
                <OpenModalMenuItem
                  itemText="Reserve"
                  buttonClassName='reserve-button'
                  modalComponent={<BookingModal spotId={oneSpot.id}/>}
                />
                  {/* Reserve */}
                </button>
              </div>
            </div>
            <hr />
            {oneSpot.avgStarRating !== 0 ? (
              <>

                <div className="review-info-block">
                  <div review-in-block-rating>★ {oneSpot.avgRating !== null && !isNaN(oneSpot.avgRating)
                    ? oneSpot.avgRating
                    : 'New'}</div>
                  <div>·</div>
                  {oneSpot.numReviews === 1 ? (
                    <div>{oneSpot.numReviews} review</div>
                  ) : (
                    <div>{oneSpot.numReviews} reviews</div>
                  )}
                </div>
                <br />
                {sessionUser?.id !== oneSpot.ownerId &&
                  sessionUser &&
                  !hasReviewd && (
                    <button className="post-your-review-btn">
                    <OpenModalMenuItem
                    className='post-your-review-btn'
                      itemText="Post Your Review"
                      modalComponent={<PostReviewModal spotId={oneSpot.id} />}
                      buttonClassName="modal-component"
                    />
                    </button>
                  )}
                <div className="spot-reviews">
                  {review.length > 0 &&
                    review.map((oneReview) => {
                      //console.log("ONEREVIE ==>", oneReview)
                      const reviewMonth = oneReview.createdAt?.split("")[6];
                      const year = oneReview.createdAt?.split("-")[0];
                      return (
                        <>
                          <div className="spot-review">
                            <p>{oneReview.User?.firstName}</p>
                            <p>
                              {month[reviewMonth]}, {year}
                            </p>
                            <p>{oneReview?.review}</p>
                            <p>★ {oneReview?.stars}</p>
                            {sessionUser?.id === oneReview.User?.id && (
                              <>
                                <button
                                  className="delete-review-in-spot"
                                  onClick={() => setShowModal(true)}
                                >
                                  <OpenModalMenuItem
                                    itemText="Delete"
                                    onItemClick={closeMenu}
                                    modalComponent=
                                    {<ConfirmModalReview
                                      onModalClose={closeModal}
                                      reviewId={oneReview.id}
                                      onDelete={(e) => deleteReview(e, oneReview.id)}
                                    />}
                                  />
                                </button>
                              </>
                            )}
                          </div>
                        </>
                      );
                    })}
                </div>
              </>
            ) : (
              <>
                <h3>★ New</h3>
                {sessionUser?.id !== oneSpot.ownerId && sessionUser && (
                  <div className='post-your-review-btn'>
                    <button>
                  <OpenModalMenuItem
                    className='post-your-review-btn'
                    itemText="Post Your Review"
                    modalComponent={
                      <PostReviewModal
                        spotId={oneSpot.id}
                        onModalClose={closeModal}
                      />
                    }
                    buttonClassName="modal-component"
                  />
                  </button>
                  </div>
                )}
              </>
            )}
          </>
        );
      })}
    </>
  );
};

export default SpotIndex;
