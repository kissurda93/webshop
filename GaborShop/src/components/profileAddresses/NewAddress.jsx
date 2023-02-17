import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useSelector, useDispatch } from "react-redux";
import { setNewAddress } from "../../layouts/UserLayout/userSlice";

const emptyLocations = { countries: [], states: [], cities: [] };

export default function NewAddress() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState({});
  const [locations, setLocations] = useState(emptyLocations);
  const [loading, setLoading] = useState(false);
  const { id } = useSelector((state) => state.user.userInfo);

  async function getCountries() {
    try {
      if (locations.countries.length === 0) {
        const countries = await axios.get(
          `${import.meta.env.VITE_API_URL}/countries`
        );

        setLocations({ ...locations, countries: countries.data });
      }
    } catch (error) {
      console.warn(error);
    }
  }

  async function handleLocationChange(event, nextLocation) {
    try {
      if (nextLocation === "states") {
        setLocations({ ...locations, states: [], cities: [] });
      } else {
        setLocations({ ...locations, cities: [] });
      }

      const values = event.target.value;
      const valuesArray = values.split("///");
      const [valueName, valueID] = valuesArray;

      setData({
        ...data,
        state: "",
        city: "",
        [event.target.name]: valueName,
      });

      const nextLocations = await axios.get(
        `${import.meta.env.VITE_API_URL}/${nextLocation}/${valueID}`
      );

      if (nextLocation === "states") {
        setLocations({ ...locations, states: nextLocations.data });
      } else {
        setLocations({ ...locations, cities: nextLocations.data });
      }
    } catch (error) {
      console.warn(error);
    }
  }

  const handleChange = (event) =>
    setData({ ...data, [event.target.name]: event.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const postRequest = await axios.post(
        `${import.meta.env.VITE_API_URL}/new-address`,
        { ...data, id },
        {
          headers: { Authorization: `Bearer ${Cookies.get("user_token")}` },
        }
      );
      if (postRequest.status === 200) {
        dispatch(setNewAddress(postRequest.data[0]));
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
      setData({});
      setLocations(emptyLocations);
      setShowModal(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setShowModal(true);
          getCountries();
        }}
      >
        Add New Address
      </button>
      {showModal && locations.countries.length !== 0 && (
        <div
          className="overlay"
          onClick={() => {
            setShowModal(false);
            setLocations(emptyLocations);
            setData({});
          }}
        >
          <form
            className="address-form"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
          >
            <label>
              Country
              <select
                name="country"
                defaultValue={"default"}
                onChange={(event) => handleLocationChange(event, "states")}
              >
                <option value={"default"} disabled>
                  -- select a country --
                </option>
                {locations.countries.map((country) => {
                  return (
                    <option
                      key={country.id}
                      value={`${country.name}///${country.id}`}
                    >
                      {country.name}
                    </option>
                  );
                })}
              </select>
            </label>
            {locations.states.length !== 0 && (
              <label>
                State
                <select
                  name="state"
                  defaultValue={"default"}
                  onChange={(event) => handleLocationChange(event, "cities")}
                >
                  <option value={"default"} disabled>
                    -- select a state --
                  </option>
                  {locations.states.map((state) => {
                    return (
                      <option
                        key={state.id}
                        value={`${state.name}///${state.id}`}
                      >
                        {state.name}
                      </option>
                    );
                  })}
                </select>
              </label>
            )}
            {locations.cities.length !== 0 && (
              <label>
                City
                <select
                  name="city"
                  defaultValue={"default"}
                  onChange={handleChange}
                >
                  <option value={"default"} disabled>
                    -- select a city --
                  </option>
                  {locations.cities.map((city) => {
                    return (
                      <option key={city.id} value={city.name}>
                        {city.name}
                      </option>
                    );
                  })}
                </select>
              </label>
            )}
            <label>
              Address
              <input name="address" type="text" onChange={handleChange} />
            </label>
            {data.state !== undefined && data.address !== undefined && (
              <button type="submit" disabled={loading}>
                {loading ? "..." : "Add Address"}
              </button>
            )}
          </form>
        </div>
      )}
    </>
  );
}
