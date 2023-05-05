import { csrfFetch } from "./csrf";

export const LOAD_REVIEWS = "reviews/LOAD_REVIEWS";
export const CREATE_REVIEW = "reviews/CREATE_REVIEW";
export const DELETE_REVIEW = "reviews/DELETE_REVIEW";
export const CURRENT_USER_REVIEWS = "reviews/CURRENT_USER_REVIEWS";

export const loadReviews = (reviews) => ({
  type: LOAD_REVIEWS,
  reviews,
});

export const createReview = (review) => ({
  type: CREATE_REVIEW,
  review,
});

export const deleteReview = (review) => ({
  type: DELETE_REVIEW,
  review,
});

export const loadCurrentUserReviews = (reviews) => ({
  type: CURRENT_USER_REVIEWS,
  reviews,
});


export const getAllReviewsThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
  const reviews = await res.json();
  await dispatch(loadReviews(reviews.Reviews));
};

export const thunkGetCurrentReviews = () => async (dispatch) => {
  const res = await csrfFetch("/api/reviews/current");
  const reviews = await res.json();
  await dispatch(loadCurrentUserReviews(reviews.Reviews));
};

export const thunkCreateReview = (review) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${review.spotId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(review),
  });

  if (res.ok) {
    const newReview = await res.json();
    dispatch(createReview(newReview));
    return newReview;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const thunkDeleteReview = (reviewId) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    dispatch(deleteReview(reviewId));
  } else {
    const errors = await res.json();
    return errors;
  }
};



const initialState = {};

const reviewsReducer = (state = initialState, action) => {
  let newState = {};
  switch (action.type) {
    case LOAD_REVIEWS:
      action.reviews.forEach((review) => (newState[review.id] = review));
      return newState;
    case CREATE_REVIEW:
      newState = { ...state };
      newState[action.review.id] = action.review;
      return newState;
    case DELETE_REVIEW:
      newState = { ...state };
      delete newState[action.review];
      return newState;
    case CURRENT_USER_REVIEWS:
      action.reviews.forEach((review) => (newState[review.id] = review));
      return newState;
    default:
      return state;
  }
};

export default reviewsReducer;
