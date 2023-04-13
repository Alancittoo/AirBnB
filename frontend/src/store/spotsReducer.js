import { csrfFetch } from "./csrf";
export const LOAD_SPOTS = "spots/LOAD_SPOTS";
export const LOAD_SPOT_DETAIL = "spots/LOAD_SPOT_DETAIL";
export const CREATE_NEW_SPOT = "spots/CREATE_NEW_SPOT";
export const CREATE_IMAGE_SPOT = "spots/CREATE_IMAGE_SPOT";
export const CURRENT_SPOTS = "spots/CURRENT_SPOTS";
export const DELETE_SPOT = "spots/DELETE_SPOT";
export const UPDATE_SPOT = "spots/UPDATE_SPOT";

export const loadSpotsAction = (spots) => ({
  type: LOAD_SPOTS,
  spots,
});

export const loadSpotDetailAction = (spot) => ({
  type: LOAD_SPOT_DETAIL,
  spot,
});

export const createNewSpotAction = (spot) => ({
  type: CREATE_NEW_SPOT,
  spot,
});

export const createNewImageAction = (spotId) => ({
  type: CREATE_IMAGE_SPOT,
  spotId,
});

export const loadCurrentSpotsAction = (spots) => ({
  type: CURRENT_SPOTS,
  spots,
});

export const deleteSpotAction = (spotId) => ({
  type: DELETE_SPOT,
  spotId,
});

export const editSpotAction = (spots) => ({
  type: UPDATE_SPOT,
  spots,
});

export const thunkGetAllSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots");
  const spots = await res.json();
  await dispatch(loadSpotsAction(spots.Spots));
};

export const getSpotDetailThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`);
  const spot = await res.json();
  await dispatch(loadSpotDetailAction(spot));
};

export const getCurrentSpotsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots/current");
  const spots = await res.json();
  await dispatch(loadCurrentSpotsAction(spots.Spots));
};

export const updateSpotThunk =
  ({ country, address, city, state, lat, lng, description, name, price, spotId }) =>
  async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        country,
        address,
        city,
        state,
        lat,
        lng,
        description,
        name,
        price,
      }),
    });
    if (res.ok) {
      const updatedSpot = await res.json();
      dispatch(editSpotAction(updatedSpot));
      return updatedSpot;
    } else {
      const errors = await res.json();
      return errors;
    }
  };

export const createNewSpotThunk =
  ({
    country,
    address,
    city,
    state,
    lat,
    lng,
    description,
    name,
    price,
    image,
  }) =>
  async (dispatch) => {
    const res = await csrfFetch("/api/spots", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        country,
        address,
        city,
        state,
        lat,
        lng,
        description,
        name,
        price,
      }),
    });
    const newSpot = await res.json();
    const res2 = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: image, preview: true }),
    });
    if (res2.ok) {
      dispatch(createNewSpotAction(newSpot));
      // history.push(`/spot/${id}`)
      return newSpot;
    } else {
      const errors = await res.json();
      return errors;
    }
  };

export const deleteSpotThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    dispatch(deleteSpotAction(spotId));
  } else {
    const errors = await res.json();
    return errors;
  }
};

const initialState = {};

const spotsReducer = (state = initialState, action) => {
  let newState = {};
  switch (action.type) {
    case LOAD_SPOTS:
      action.spots.forEach((spot) => (newState[spot.id] = spot));
      return newState;
    case LOAD_SPOT_DETAIL:
      newState[action.spot.id] = action.spot;
      return newState;
    case CREATE_NEW_SPOT:
      newState = { ...state };
      newState[action.spot.id] = action.spot;
      return newState;
    case CURRENT_SPOTS:
      action.spots.forEach((spot) => (newState[spot.id] = spot));
      return newState;
    case UPDATE_SPOT:
      return { ...state, [action.spots.id]: action.spots };
    case DELETE_SPOT:
      newState = { ...state };
      delete newState[action.spotId];
      return newState;
    default:
      return state;
  }
};

export default spotsReducer;
