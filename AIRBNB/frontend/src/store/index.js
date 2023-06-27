import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import spotsReducer from "./spotsReducer";
import reviewsReducer from "./reviewReducer";
import bookingsReducer from "./bookingsReducer";

//MONEY MAKER
const rootReducer = combineReducers({
  session: sessionReducer,
  spots: spotsReducer,
  reviews: reviewsReducer,
  bookings: bookingsReducer
});

let enhancer;

if (process.env.NODE_ENV === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require("redux-logger").default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;

// {bookings.map((booking) => (
//   <div key={booking.id}>
//       <h2>Booking ID: {booking.id}</h2>
//       <p>Spot ID: {booking.spotId}</p>
//       <p>Start Date: {new Date(booking.startDate).toLocaleDateString()}</p>
//       <p>End Date: {new Date(booking.endDate).toLocaleDateString()}</p>
//   </div>
// ))}
