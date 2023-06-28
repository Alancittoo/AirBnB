import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import  Navigation  from "./components/Navigation";
import SpotsIndex from "./components/Spots";
import SpotIndex from "./components/SpotDetails";
import UserSpots from "./components/SpotDetails/usersSpot";
import CreateNewSpot from "./components/CreateSpot";
import EditSpot from "./components/UpdateSpot/index";
import ReviewIndex from "./components/Reviews";
import BookingsIndex from "./components/Bookings";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path={"/"}>
            <SpotsIndex />
          </Route>
          <Route exact path={"/spot/:spotId"}>
            <SpotIndex />
          </Route>
          <Route exact path={"/spots/current"}>
            <UserSpots />
          </Route>
          <Route exact path={"/spots/new"}>
            <CreateNewSpot />
          </Route>
          <Route exact path={"/spots/:spotId/edit"}>
            <EditSpot />
          </Route>
          <Route exact path={"/reviews/current"}>
            <ReviewIndex />
          </Route>
          <Route exact path={"/bookings/current"}>
            <BookingsIndex />
          </Route>
          <Route>Page Not found</Route>
        </Switch>
      )}
    </>
  );
}

export default App;
