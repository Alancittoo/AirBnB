import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetCurrentSpots, deleteSpotThunk } from "../../store/spotsReducer";
import { Link } from "react-router-dom";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import "./userSpots.css";
import UserSpotModal from "./userSpotModal";
import { useModal } from "../../context/Modal";


const UserSpots = () => {
  const [showMenu, setShowMenu] = useState(false);

  const spotsObj = useSelector((state) => state.spots);
  const spots = Object.values(spotsObj);
  const { closeModal } = useModal();

  const closeMenu = () => setShowMenu(false);


  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(thunkGetCurrentSpots());
  }, [dispatch]);

  const deleteSpot = (e, spotId) => {
    e.preventDefault();
    dispatch(deleteSpotThunk(spotId));
  };

  return (
    <>
      <h1>Manage Your Spots</h1>
      <div className="wrapper-div-user-spot">
        {spots.map((spot) => {
          return (
            <>
              <div className="spots-div">
                <Link to={`/spot/${spot.id}`}>
                  {spot.previewImage !== "No Preview Image Available" ? (
                    <img src={spot.previewImage}></img>
                  ) : (
                    <img src=""></img>
                  )}
                  <div className="spot-wrapper-div">
                    <div className="spot-info">
                      <div key={spot.id} className="spot-location">
                        {spot.name}, {spot.city}, {spot.state}
                      </div>
                      <div>${spot.price} night</div>
                    </div>

                    <div>
                      ★{" "}
                      {spot.avgRating !== null && !isNaN(spot.avgRating)
                        ? spot.avgRating
                        : 'New'}
                    </div>
                  </div>
                </Link>
                <Link to={`/spots/${spot.id}/edit`}>
                  <button className="delete-review-in-spot">Update</button>
                </Link>
                <button className="delete-review-in-spot"><OpenModalMenuItem
                                    itemText="Delete"
                                    onItemClick={closeMenu}
                                    modalComponent=
                                    {<UserSpotModal
                                      onModalClose={closeModal}
                                      spotId={spot.id}
                                      onDelete={(e) => deleteSpot(e, spot.id)}
                                    />}
                                  /></button>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
};

export default UserSpots;
