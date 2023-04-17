import { csrfFetch } from "./csrf";

export const LOAD_REVIEWS = "reviews/LOAD_REVIEWS";
export const LOAD_REVIEW_DETAIL = "reviews/LOAD_REVIEW_DETAIL";
export const CREATE_REVIEW = "reviews/CREATE_REVIEW";
export const DELETE_REVIEW = "reviews/DELETE_REVIEW";
export const CURRENT_USER_REVIEWS = "reviews/CURRENT_USER_REVIEWS";

export const loadReviewsAction = (reviews) => ({
  type: LOAD_REVIEWS,
  reviews,
});

export const createReviewAction = (review) => ({
  type: CREATE_REVIEW,
  review,
});

export const deleteReviewAction = (review) => ({
  type: DELETE_REVIEW,
  review,
});

export const loadCurrentUserReviewsAction = (reviews) => ({
  type: CURRENT_USER_REVIEWS,
  reviews,
});




export const getAllReviewsThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
  const reviews = await res.json();
  await dispatch(loadReviewsAction(reviews.Reviews));
};

export const createReviewThunk = (review) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${review.spotId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(review),
  });

  if (res.ok) {
    const newReview = await res.json();
    dispatch(createReviewAction(newReview));
    return newReview;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const deleteReviewThunk = (reviewId) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    dispatch(deleteReviewAction(reviewId));
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const getCurrentUserReviewsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/reviews/current");
  const reviews = await res.json();
  await dispatch(loadCurrentUserReviewsAction(reviews.Reviews));
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
