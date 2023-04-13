import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetAllSpots } from "../../store/spotsReducer";
import "./spots.css";
import { Link } from "react-router-dom";

const SpotsIndex = () => {
  const spotsObj = useSelector((state) => state.spots);
  const spots = Object.values(spotsObj);
  //console.log("image check", spots);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(thunkGetAllSpots());
  }, [dispatch]);

  return (
    <>
    <br/>
    <br/>

      <div className="wrapper-div">
        {spots.map((spot) => {
          return (
            <>
              <div className="spots-div">
                <Link className='tool' to={`/spot/${spot.id}`}>
                  {spot.previewImage !== "No Preview Image Available" ? (
                    <img className="tooltip" src={spot.previewImage}></img>
                  ) : (
                    <img  src="https://ftcollinshomes.com/wp-content/uploads/2015/06/nophotoavailable.png"></img>
                  )}
                  <div className="spot-wrapper-div">
                    <div className="spot-info">
                      <div key={spot.id} className="spot-location">
                        {/* {spot.name},  */}
                        {spot.city},
                        {spot.state}
                      </div>
                      <div>
                        ${spot.price} night
                      </div>
                    </div>

                    <div>
                      <p>★ {" "}
                      {spot.avgRating !== "No Reviews exist for this spot"
                        ? spot.avgRating
                        : "New"}
                        </p>
                    </div>
                  </div>
                </Link>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
};

export default SpotsIndex;
