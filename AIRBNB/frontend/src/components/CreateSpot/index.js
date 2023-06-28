import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkCreateSpot, thunkCreateImg } from "../../store/spotsReducer";
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
    const [image, setImage] = useState('');
    const [image2, setImage2] = useState('');
    const [image3, setImage3] = useState('');
    const [image4, setImage4] = useState('');
    const [image5, setImage5] = useState('');
    const [price, setPrice] = useState(0);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const errors = {};

        if (!description || description > 30) {
            errors.description = "Description needs a minimum of 30 characters";
        }

        // if (!lat || isNaN(lat)) {
        //   errors.lat = "Latitude is required and must be a number";
        // }

        // if (!lng || isNaN(lng)) {
        //   errors.lng = "Longitude is required and must be a number";
        // }

        if (!address) {
            errors.address = "Address is required";
        }

        if (!price || isNaN(price)) {
            errors.price = "Price is required";
        }

        if (image.length === 0) {
            errors.image = "Image is required";
        }

        if (!country) {
            errors.country = "Country is required";
        }

        if (!name) {
            errors.name = "Name is required";
        }

        if (!city) {
            errors.city = "City is required";
        }

        if (!state) {
            errors.state = "State is required";
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        setErrors(errors);

        if (Object.keys(errors).length === 0) {
            dispatch(
                thunkCreateSpot({
                    country,
                    address,
                    city,
                    state,
                    lat: Number(lat),
                    lng: Number(lng),
                    description,
                    name,
                    price: Number(price),
                    image
                })
            )
                .then((newSpot) => {
                    const newImages = [image, image2, image3, image4, image5]
                    for (let i = 0; i < newImages.length; i++) {
                        // console.log('IMAGES', newImages[i])
                        // console.log('Increment', i)
                        dispatch(thunkCreateImg(newSpot.id, {url: newImages[i], preview: 1}))
                    }
                    history.push(`/spot/${newSpot.id}`)
                })

                .catch(async (res) => {
                    const data = await res.json();
                    // console.log("Error response data:", data);
                });
        }
    };

    return (
        <>
            <h1>Create a New Spot</h1>

            <form className="create-spot-form"
                onSubmit={handleSubmit}
            >
                <h4>Where's your place located?</h4>
                <p>
                    Guests will only get your exact address once they booked a
                    reservation.
                </p>
                <br />
                <br />
                {errors.country && (<p className="error-message">{errors.country}</p>)}

                <label className="country-input">
                    Country
                    <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Country"
                    // required
                    />
                </label>
                <br />

                {errors.address && (<p className="error-message">{errors.address}</p>)}

                <label className="address-input">
                    Street Address
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Address"
                    // required
                    />
                </label>
                <br />

                {errors.city && (<p className="error-message">{errors.city}</p>)}

                <label className="city-input">
                    City
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                    // required
                    />
                </label>

                {errors.state && (<p className="error-message">{errors.state}</p>)}

                <label className="state-input">
                    State
                    <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="STATE"
                    // required
                    />
                </label>

                {errors.lat && <p className="error-message">{errors.lat}</p>}

                <label className="state-input">
                    Latitude
                    <input
                        type="text"
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                        placeholder="0"
                    // required
                    />
                </label>

                {errors.lng && <p className="error-message">{errors.lng}</p>}

                <label className="state-input">
                    Longitude
                    <input
                        type="text"
                        value={lng}
                        onChange={(e) => setLng(e.target.value)}
                        placeholder="0"
                    // required
                    />
                </label>
                <hr />
                <label className="description-label">
                    <h2>
                        Describe your place to guests
                    </h2>
                    <p> Mention the best features of your space, any special amentities like
                        fast wif or parking, and what you love about the neighborhood.
                    </p>

                    {errors.description && (<p className="error-message">{errors.description}</p>)}

                    <textarea
                        type="text"
                        className="description-input"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    // required
                    />
                </label>
                {/* <hr /> */}
                <label>
                    <h2>
                        Create a title for your spot
                    </h2>
                    <p>Catch guests' attention with a spot title that highlights what makes
                        your place special.</p>
                    {errors.name && (<p className="error-message">{errors.name}</p>)}
                    <input
                        type="text"
                        className="spot-input"
                        placeholder="Name of your spot"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    // required
                    />
                </label>
                <hr />
                <label>
                    <h2>
                        Set a base price for your spot
                    </h2>
                    <p> Competitive pricing can help your listing stand out and rank higher
                        in search results. </p>

                    {errors.price && <p className="error-message">{errors.price}</p>}

                    <input
                        type="number"
                        placeholder="Price per night (USD)"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    // required
                    />
                </label>
                <hr />
                <label>
                    <h2>
                        Liven up your spot with photos
                    </h2>
                    <p>Submit a link to at least one photo to publish your spot.</p>

                    {errors.image && <p className="error-message">{errors.image}</p>}

                    <input
                        type="text"
                        className="photo-input"
                        placeholder="Preview Image URL"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                    // required
                    />
                    <br />
                    <input
                        type="text"
                        className="photo-input"
                        placeholder="Image URL"
                        value={image2}
                        onChange={(e) => setImage2(e.target.value)}
                    />
                    <br />
                    <input
                        type="text"
                        className="photo-input"
                        placeholder="Image URL"
                        value={image3}
                        onChange={(e) => setImage3(e.target.value)}
                    />
                    <br />
                    <input
                        type="text"
                        className="photo-input"
                        placeholder="Image URL"
                        value={image4}
                        onChange={(e) => setImage4(e.target.value)}
                    />
                    <br />
                    <input
                        type="text"
                        className="photo-input"
                        placeholder="Image URL"
                        value={image5}
                        onChange={(e) => setImage5(e.target.value)}
                    />

                </label>
                <button className='create-spot' type="submit">Create Spot</button>
            </form>
        </>
    );
}

export default CreateNewSpot;
