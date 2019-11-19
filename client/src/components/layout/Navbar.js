import React, { Fragment, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import authContext from "../../context/auth/authContext";
import contactContext from "../../context/contact/contactContext";

const Navbar = () => {
  const { isAuth, logout, user, loadUser } = useContext(authContext);
  const { clearContacts } = useContext(contactContext);

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  const onLogout = () => {
    logout();
    clearContacts();
  };

  const authLinks = (
    <Fragment>
      <li>Hello {user && user.name}</li>
      <li>
        <a onClick={onLogout} href="#!">
          <i className="fas fa-sign-out-alt" />{" "}
          <span className="hide-sm">Logout</span>
        </a>
      </li>
    </Fragment>
  );

  const guestLinks = (
    <Fragment>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </Fragment>
  );

  return (
    <div className="navbar bg-primary">
      <h1>
        <Link to="/">
          <i className="fas fa-id-card-alt" /> Contact Keeper
        </Link>
      </h1>
      <ul>{isAuth ? authLinks : guestLinks}</ul>
    </div>
  );
};

export default Navbar;
