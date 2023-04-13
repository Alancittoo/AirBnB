import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewSpotThunk } from "../../store/spotsReducer";
import { useHistory } from "react-router-dom";
import './createSpot.css'

function CreateNewSpot({ user }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [country, setCountry] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");
    const [image, setImage] = useState([]);
    const [image2, setImage2] = useState([]);
    const [image3, setImage3] = useState([]);
    const [image4, setImage4] = useState([]);
    const [image5, setImage5] = useState([]);
    const [price, setPrice] = useState(0);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newSpot = await dispatch(
            createNewSpotThunk({
                country,
                address,
                city,
                state,
                description,
                name,
                lat,
                lng,
                price,
                image,
            })
        );
        history.push(`/spot/${newSpot.id}`);
    };

    return (
        <>
            <h1>Creat a New Spot</h1>
            <form
                onSubmit={handleSubmit}
            >
                <h4>Where's your place located?</h4>
                <caption>
                    Guests will only get your exact address once they booked a
                    reservation.
                </caption>
                <br />
                <br />

                <label className="country-input">
                    Country
                    <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Country"
                        required
                    />
                </label>
                <br />

                <label className="address-input">
                    Street Address
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Address"
                        required
                    />
                </label>
                <br />

                <label className="city-input">
                    City
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        required
                    />
                </label>

                <label className="state-input">
                    State
                    <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="STATE"
                        required
                    />
                </label>

                <label className="state-input">
                    Latitude
                    <input
                        type="text"
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                        placeholder="STATE"
                        required
                    />
                </label>

                <label className="state-input">
                    Longitude
                    <input
                        type="text"
                        value={lng}
                        onChange={(e) => setLng(e.target.value)}
                        placeholder="STATE"
                        required
                    />
                </label>
                <hr />
                <label>
                    <h2>
                        Describe your place to guests
                    </h2>
                    <p> Mention the best features of your space, any special amentities like
                        fast wif or parking, and what you love about the neighborhood.
                    </p>
                    <textarea
                        type="text"
                        className="description-input"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </label>
                <hr />
                <label>
                    <h2>
                        Create a title for your spot
                    </h2>
                    <p>Catch guests' attention with a spot title that highlights what makes
                        your place special.</p>
                    <input
                        type="text"
                        className="spot-input"
                        placeholder="Name of your spot"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>
                <hr />
                <label>
                    <h2>
                        Set a base price for your spot
                    </h2>
                    <p> Competitive pricing can help your listing stand out and rank higher
                        in search results. </p>
                    <input
                        type="number"
                        className="price-input"
                        placeholder="Price per night (USD)"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </label>
                <hr />
                <label>
                    <h2>
                        Liven up your spot with photos
                    </h2>
                    <p>Submit a link to at least one photo to publish your spot.</p>
                    <input
                        type="text"
                        className="photo-input"
                        placeholder="Preview Image URL"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        required
                    />
                    <br />
                    <input
                        type="text"
                        className="photo-input"
                        placeholder="Image URL"
                        value={image2}
                        onChange={(e) => setImage2(e.target.value)}
                        required
                    />
                    <br />
                    <input
                        type="text"
                        className="photo-input"
                        placeholder="Image URL"
                        value={image3}
                        onChange={(e) => setImage3(e.target.value)}
                        required
                    />
                    <br />
                    <input
                        type="text"
                        className="photo-input"
                        placeholder="Image URL"
                        value={image4}
                        onChange={(e) => setImage4(e.target.value)}
                        required
                    />
                    <br />
                    <input
                        type="text"
                        className="photo-input"
                        placeholder="Image URL"
                        value={image5}
                        onChange={(e) => setImage5(e.target.value)}
                        required
                    />

                </label>
                <hr />
                <button type="submit">Create Spot</button>
            </form>
        </>
    );
}

export default CreateNewSpot;
