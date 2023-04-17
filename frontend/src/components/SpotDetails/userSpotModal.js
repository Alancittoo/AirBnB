import { useDispatch } from "react-redux";
import { deleteSpotThunk } from "../../store/spotsReducer";
import './confirmModalUserSpot.css'

const UserSpotModal = ({ spotId, onModalClose, onDelete }) => {
    const dispatch = useDispatch()

    const handleConfirm = () => {
    onModalClose();
    dispatch(deleteSpotThunk(spotId));
  };

  return (
    <div className="confirmModalSpot-div">
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to delete this spot?</p>
      <div className="confirmModalSpot-buttons">
        <button className="confirmModalSpot-yes" onClick={handleConfirm}>
          Yes (Delete Spot)
        </button>
        <button className="confirmModalSpot-no" onClick={onModalClose}>
          No (Keep Spot)
        </button>
      </div>
    </div>
  );
};

export default UserSpotModal;
