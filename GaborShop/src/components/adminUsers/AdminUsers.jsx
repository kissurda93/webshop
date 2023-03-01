import "./adminUsers.css";
import { useSelector } from "react-redux";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import AdminSingleUser from "./AdminSingleUser";

export default function AdminUsers() {
  const { users } = useSelector((state) => state.adminData);
  const [user, setUser] = useState({});
  const [userEmail, setUserEmail] = useState("");
  const [showUser, setShowUser] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const userFromRedux = users.find((user) => user.email == userEmail);
    setUser(userFromRedux);
    setShowUser(true);
  };

  const handleChange = (e) => {
    setUserEmail(e.target.value);
  };

  const handleClickOnUser = (e) => {
    const userFromRedux = users.find((user) => user.id == e.target.dataset.id);
    setUser(userFromRedux);
    setShowUser(true);
  };

  return (
    <>
      <section className="filters">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="relative-container">
            <input
              type="text"
              placeholder="Enter the user email address"
              name="search"
              onChange={handleChange}
            />
            <button type="submit">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
        </form>
      </section>
      <section className="admin-user-list">
        {users.length !== 0 &&
          users.map((user) => {
            return (
              <div key={user.id} data-id={user.id} onClick={handleClickOnUser}>
                {user.name} {"-->"} {user.email}
              </div>
            );
          })}
      </section>
      {showUser && <AdminSingleUser user={user} setShowUser={setShowUser} />}
    </>
  );
}
