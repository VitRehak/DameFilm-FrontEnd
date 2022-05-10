import React from "react";
import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Nav, Container, Navbar, Button } from "react-bootstrap";
import { clearCookies, getCookie } from "../myFunctions";

const Navigation: React.FC = () => {
  return (
    <>
      <Nav variant="pills" defaultActiveKey="/">
        <Nav.Item>
          <Nav.Link eventKey="link-1" as={NavLink} to="/">
            Home
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-2" as={NavLink} to="/movies">
            Movies
          </Nav.Link>
        </Nav.Item>
        {getCookie("token") === null ? (
          <>
            <Nav.Item>
              <Nav.Link eventKey="link-4" as={NavLink} to="/login">
                Login
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link eventKey="link-5" as={NavLink} to="/register">
                Register
              </Nav.Link>
            </Nav.Item>
          </>
        ) : (
          <>
            <Nav.Item>
              <Nav.Link eventKey="link-3" as={NavLink} end to={`/profile/${getCookie("id")}`}>
                Profile
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="link-6" as={NavLink} to="/logout">
                Logout
              </Nav.Link>
            </Nav.Item>
          </>
        )}
      </Nav>
    </>
  );
};

export default Navigation;
