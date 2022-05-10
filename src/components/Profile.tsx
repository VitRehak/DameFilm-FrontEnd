import React, { useContext, useEffect, useState } from "react";
import { clearCookies, getCookie, UpdateContext } from "../myFunctions";
import { User } from "../dataTypes";
import { ZonedDateTime } from "@js-joda/core";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import LogInModal from "./modals/LogInModal";
import UpdateUserModal from "./modals/UpdateUserModal";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState<User>();
  const [updateShow, setUpdateShow] = useState<boolean>(false);
  const forceUpdate = useContext<any>(UpdateContext);

  const updateUserState = (changes: User) => {
    setUser((previusUser) => ({ ...previusUser, ...changes }));
  };

  useEffect(() => {
    const fetchData = async () => {
      const user: User = await axios
        .get(`http://localhost:8080/auth/profile/${id}`, {
          headers: { mode: "cors" },
        })
        .then((response) => response.data)
        .catch((err) => {
          console.log(err);
        });
      setUser(user);
    };
    fetchData();
  }, []);

  const deleteUser = () => {
    const userId = getCookie("id");
    const token = getCookie("token");
    axios
      .delete(`http://localhost:8080/auth/delete/${userId}`, {
        headers: { mode: "cors", Authorization: `Bearer ${token}` },
      })
      .then((response) => response.data)
      .catch((err) => {
        console.log(err);
      });
    clearCookies();
    navigate("/");
    forceUpdate();
  };

  return (
    <>
      <h1>Profile</h1>
      {user !== undefined ? (
        <>
          <h3>{user.username}</h3>
          <h5>
            {user.firstname} {user.lastname}
          </h5>
          <div>{user.email}</div>
          <small>Joined us: {user.dateOfRegistration}</small>
        </>
      ) : (
        <></>
      )}

      <div>
        {getCookie("id") === id ? (
          <>
            <Button
              onClick={() => setUpdateShow(true)}
              variant="warning"
              className="mx-1 mt-2"
            >
              Update
            </Button>
            <Button onClick={deleteUser} variant="danger" className="mx-1 mt-2">
              Delete
            </Button>
          </>
        ) : (
          <></>
        )}

        <UpdateUserModal
          show={updateShow}
          onHide={() => setUpdateShow(false)}
          updateUserState={updateUserState}
        />
      </div>
    </>
  );
};

export default Profile;
