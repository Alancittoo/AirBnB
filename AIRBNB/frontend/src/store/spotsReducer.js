import { csrfFetch } from "./csrf";
export const LOAD_SPOTS = "spots/LOAD_SPOTS";
export const LOAD_SPOT_DETAIL = "spots/LOAD_SPOT_DETAIL";
export const CREATE_NEW_SPOT = "spots/CREATE_NEW_SPOT";
export const CREATE_IMAGE_SPOT = "spots/CREATE_IMAGE_SPOT";
export const CURRENT_SPOTS = "spots/CURRENT_SPOTS";
export const DELETE_SPOT = "spots/DELETE_SPOT";
export const UPDATE_SPOT = "spots/UPDATE_SPOT";
export const SEARCH_SPOTS = "spots/SEARCH_SPOTS"

export const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  spots,
});

export const loadSpotDetail = (spot) => ({
  type: LOAD_SPOT_DETAIL,
  spot,
});

export const createNewSpot = (spot) => ({
  type: CREATE_NEW_SPOT,
  spot,
});

export const createNewImage = (spotId) => ({
  type: CREATE_IMAGE_SPOT,
  spotId,
});

export const loadCurrentSpots = (spots) => ({
  type: CURRENT_SPOTS,
  spots,
});

export const deleteSpot = (spotId) => ({
  type: DELETE_SPOT,
  spotId,
});

export const editSpot = (spots) => ({
  type: UPDATE_SPOT,
  spots,
});

export const searchSpots = (searchResults) => ({
  type: SEARCH_SPOTS,
  searchResults,
});

export const thunkCreateImg = (spotId, img) => async (dispatch) => {
  console.log('spotId', spotId)
  console.log('spotId', spotId)
  const res = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: 'POST',
    headers: {
      'Content-Type' : "application/json",

    },
    "body": JSON.stringify(img)
  })
  if (res.ok){
  const spot = await res.json()
  return spot
  }
}

export const thunkGetAllSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots");
  const spots = await res.json();
  await dispatch(loadSpots(spots.Spots));
};

export const thunkGetSpotDetail = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`);
  const spot = await res.json();
  await dispatch(loadSpotDetail(spot));
};

export const thunkGetCurrentSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots/current");
  const spots = await res.json();
  await dispatch(loadCurrentSpots(spots.Spots));
};

export const thunkCreateSpot =
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
    // const res2 = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ url: image, preview: true }),
    // });
    // if (res2.ok) {
    //   dispatch(createNewSpot(newSpot));
    //   // history.push(`/spot/${id}`)
    //   return newSpot;
    // } else {
    //   const errors = await res.json();
    //   return errors;
    // }
    return newSpot
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
      dispatch(editSpot(updatedSpot));
      return updatedSpot;
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
    dispatch(deleteSpot(spotId));
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const thunkSearchSpots = (searchTerm) => (dispatch, getState) => {
  if (!searchTerm) {
    dispatch(searchSpots([]))
    return console.log("empty");
  }

  const spots = Object.values(getState().spots);
  // console.log("SPOTS IN SEARCH", spots)

  // spots.forEach((spot) => {
  //   console.log('spot.name:', spot.name);
  //   console.log('searchTerm:', searchTerm);
  //   console.log('Comparison:', spot.name && spot.name.toLowerCase().includes(searchTerm.toLowerCase()));
  // });

  const searchResults = spots.filter(spot =>
    spot.name && spot.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // console.log("SEARCH RES", searchResults)
  dispatch(searchSpots(searchResults.length ? searchResults : ['No Results Found']));
  return "Search WOrked!"
};

const initialState = { searchResults: [], searchStatus: 'idle' };

const spotsReducer = (state = initialState, action) => {
  let newState = {};
  switch (action.type) {
    case SEARCH_SPOTS:
      return { ...state, searchResults: action.searchResults, searchStatus: action.searchResults.length ? 'found' : 'not found' };
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



// export const createNewSpotThunk =
  // ({
  //   country,
  //   address,
  //   city,
  //   state,
  //   lat,
  //   lng,
  //   description,
  //   name,
  //   price,
  // }) =>
  // async (dispatch) => {
  //   const res = await csrfFetch("/api/spots", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       country,
  //       address,
  //       city,
  //       state,
  //       lat,
  //       lng,
  //       description,
  //       name,
  //       price,
  //     }),
  //   });
  //   const newSpot = await res.json();
  //   if (res.ok) {
  //     dispatch(createNewSpot(newSpot));
  //     // history.push(`/spot/${id}`)
  //     return newSpot;
  //   } else {
  //     const errors = await res.json();
  //     return errors;
  //   }
  // };

  // export const thunkCreateImg = (spotId, img) => async (dispatch) => {
  //   console.log('spotId', spotId)
  //   console.log('img', img)
  //   const res = await csrfFetch(`/api/spot/${spotId}/images`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type' : "application/json",

  //     },
  //     "body": JSON.stringify(img)
  //   })
  //   if (res.ok){
  //   const spot = await res.json()
  //   return spot
  //   }
  // }
