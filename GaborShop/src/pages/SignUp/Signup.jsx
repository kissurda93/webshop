import axios from "axios";
import { useState, useEffect } from "react";
import ShowInputError from "../../components/Message/ShowInputError";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setMessage } from "../../components/Message/messageSlice";
import { fetchUser } from "../../layouts/UserLayout/fetchUser";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [data, setData] = useState({});
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [inputError, setInputError] = useState({ errors: {} });
  const dispatch = useDispatch();
  const navTo = useNavigate();
  const [loading, setLoading] = useState(false);

  async function getCountries() {
    try {
      const countries = await axios.get(
        `${import.meta.env.VITE_API_URL}/countries`
      );
      setCountries(countries.data);
    } catch (error) {
      console.warn(error);
    }
  }

  useEffect(() => {
    if (Cookies.get("user_token")) return navTo("/profile");
    getCountries();
  }, []);

  const handleChange = (event) =>
    setData({ ...data, [event.target.name]: event.target.value });

  async function handleLocationChange(event, nextLocation) {
    try {
      if (nextLocation === "states") {
        setStates([]);
        setCities([]);
      } else {
        setCities([]);
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

      const locations = await axios.get(
        `${import.meta.env.VITE_API_URL}/${nextLocation}/${valueID}`
      );

      if (nextLocation === "states") {
        setStates(locations.data);
      } else {
        setCities(locations.data);
      }
    } catch (error) {
      console.warn(error);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setInputError({ errors: {} });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/register`,
        data
      );
      if (response.status === 201) {
        Cookies.set("user_token", response.data.token);
        dispatch(fetchUser());
        dispatch(setMessage(response.data.message));
        navTo("/profile");
      }
    } catch (error) {
      if (error.response.data.errors) {
        setInputError(error.response.data);
      } else {
        dispatch(setType("failed"));
        dispatch(setMessage(error.response.data.message));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-form-layout-container">
      <section className="user-form-section">
        <h2>Please Sign Up</h2>
        <form className="user-form" onSubmit={handleSubmit}>
          <label id="name">
            Name
            <input name="name" type="text" onChange={handleChange} />
            <ShowInputError status={inputError} inputName="name" />
          </label>
          <label id="email">
            Email
            <input name="email" type="email" onChange={handleChange} />
            <ShowInputError status={inputError} inputName="email" />
          </label>
          <label id="password">
            Password
            <input name="password" type="password" onChange={handleChange} />
            <ShowInputError status={inputError} inputName="password" />
          </label>
          <label>
            Password Confirmation
            <input
              name="password_confirmation"
              type="password"
              onChange={handleChange}
            />
          </label>
          {countries.length !== 0 && (
            <label id="country">
              Country
              <select
                name="country"
                defaultValue={"default"}
                onChange={(event) => handleLocationChange(event, "states")}
              >
                <option value={"default"} disabled>
                  -- select a country --
                </option>
                {countries.map((country) => {
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
              <ShowInputError status={inputError} inputName="country" />
            </label>
          )}
          {states.length !== 0 && (
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
                {states.map((state) => {
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
              <ShowInputError status={inputError} inputName="state" />
            </label>
          )}
          {cities.length !== 0 && (
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
                {cities.map((city) => {
                  return (
                    <option key={city.id} value={city.name}>
                      {city.name}
                    </option>
                  );
                })}
              </select>
              <ShowInputError status={inputError} inputName="city" />
            </label>
          )}
          {data.country !== undefined && (
            <label>
              Address
              <input name="address" type="text" onChange={handleChange} />
              <ShowInputError status={inputError} inputName="address" />
            </label>
          )}
          <button type="submit" disabled={loading}>
            {loading ? "..." : "Sign Up"}
          </button>
        </form>
        <p>
          Or <Link to={"/signin"}> Sign In </Link> if you have an account!
        </p>
      </section>
    </div>
  );
}
