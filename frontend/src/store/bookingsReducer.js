import { csrfFetch } from "./csrf";

export const LOAD_BOOKINGS = "bookings/LOAD_BOOKINGS";
export const CREATE_BOOKING = "bookings/CREATE_BOOKING";
export const UPDATE_BOOKING = "bookings/UPDATE_BOOKING";
export const DELETE_BOOKING = "bookings/DELETE_BOOKING";
export const CURRENT_USER_BOOKINGS = "bookings/CURRENT_USER_BOOKINGS";

export const loadBookings = (bookings) => ({
  type: LOAD_BOOKINGS,
  bookings,
});

export const createBooking = (booking) => ({
  type: CREATE_BOOKING,
  booking,
});

export const updateBooking = (booking) => ({
  type: UPDATE_BOOKING,
  booking,
});

export const deleteBooking = (booking) => ({
  type: DELETE_BOOKING,
  booking,
});

export const loadCurrentUserBookings = (bookings) => ({
  type: CURRENT_USER_BOOKINGS,
  bookings,
});


export const getAllBookingsThunk = () => async (dispatch) => {
  const res = await csrfFetch(`/api/bookings`);
  const bookings = await res.json();
  await dispatch(loadBookings(bookings.Bookings));
};

export const thunkGetCurrentBookings = () => async (dispatch) => {
  const res = await csrfFetch("/api/bookings/current");
  const bookings = await res.json();
  await dispatch(loadCurrentUserBookings(bookings.Bookings));
};

export const thunkCreateBooking = (booking) => async (dispatch) => {
  const { spotId, ...bookingDetails } = booking;

  const res = await csrfFetch(`/api/spots/${spotId}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingDetails),
  });

  if (res.ok) {
    const newBooking = await res.json();
    dispatch(createBooking(newBooking));
    return newBooking;
  } else {
    const errors = await res.json();
    return errors;
  }
};


export const thunkUpdateBooking = (bookingId, booking) => async (dispatch) => {
  const res = await csrfFetch(`/api/bookings/${bookingId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(booking),
  });

  if (res.ok) {
    const updatedBooking = await res.json();
    dispatch(updateBooking(updatedBooking));
    return updatedBooking;
  } else {
    const errors = await res.json();
    return console.log(errors);
  }
};

export const thunkDeleteBooking = (bookingId) => async (dispatch) => {
  const res = await csrfFetch(`/api/bookings/${bookingId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    dispatch(deleteBooking(bookingId));
  } else {
    const errors = await res.json();
    return errors;
  }
};



const initialState = {};

const bookingsReducer = (state = initialState, action) => {
  let newState = {};
  switch (action.type) {
    case LOAD_BOOKINGS:
      action.bookings.forEach((booking) => (newState[booking.id] = booking));
      return newState;
    case UPDATE_BOOKING:
      newState = { ...state };
      newState[action.booking.id] = action.booking;
      return newState;
    case DELETE_BOOKING:
      newState = { ...state };
      delete newState[action.booking];
      return newState;
    case CURRENT_USER_BOOKINGS:
      action.bookings.forEach((booking) => (newState[booking.id] = booking));
      return newState
    default:
        return state;
  }
}

export default bookingsReducer
