import React, { useEffect, useState } from "react";
import { useBoolean } from "../../../base/hooks";
import { Table } from "react-bootstrap";
import * as usersService from "../../../services/manageUsersService";
import StandardButton from "../../shared/forms/StandardButton/StandardButton";
import UserForm from "../UserForm/UserForm";
import "./users-list.scss";
import IconButton from "../../shared/forms/IconButton/IconButton";
import { PencilFill, TrashFill } from "react-bootstrap-icons";
import { colors } from "../../../config/colors";
import ConfirmationPopup from "../../shared/ConfirmationPopup/ConfirmationPopup";
import {
  errorNoti,
  successNoti,
} from "../../../base/Notification/Notification";
import { getErrorMessage } from "../../../utils/generalUtils";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useBoolean(true);
  const [userFormPopupOpen, setUserFormPopupOpen] = useBoolean(false);
  const [isEditMode, setIsEditMode] = useBoolean(false);
  const [userOldData, setUserOldData] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useBoolean(false);

  const getUsers = async () => {
    try {
      setLoading.on();
      const filters = {};
      const userList = await usersService.getUsers(filters);
      setUsers(userList);
    } catch (e) {
    } finally {
      setLoading.off();
    }
  };

  const deleteUser = async (userId) => {
    try {
      setLoading.on();
      await usersService.deleteUser(userId);
      successNoti("User Deleted");
      getUsers();
    } catch (e) {
      errorNoti(getErrorMessage(e));
    } finally {
      setLoading.off();
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="users-list">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="sub-heading">Users List</h3>
        <StandardButton
          text="Add User"
          className="btn-sm"
          color="btn-primary"
          onClick={() => setUserFormPopupOpen.on()}
        />
      </div>
      <Table hover bordered responsive className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th className="text-center actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td className="text-center">
                <div className="d-flex justify-content-around align-items-center">
                  <IconButton
                    Icon={PencilFill}
                    onClick={() => {
                      setIsEditMode.on();
                      setUserOldData(user);
                      setUserFormPopupOpen.on();
                    }}
                    iconProps={{ color: "#444444" }}
                  />
                  <IconButton
                    Icon={TrashFill}
                    onClick={() => {
                      setShowDeletePopup.on();
                    }}
                    iconProps={{ color: colors.danger }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <UserForm
        show={userFormPopupOpen}
        hide={() => {
          setUserFormPopupOpen.off();
          setIsEditMode.off();
          setUserOldData.apply(null);
        }}
        isEditMode={isEditMode}
        oldData={userOldData}
      />
      <ConfirmationPopup
        isOpen={showDeletePopup}
        title="Are you sure you want to delete?"
        onConfirm={() => {
          deleteUser();
          setShowDeletePopup.off();
        }}
        onCancel={() => {
          setShowDeletePopup.off();
        }}
        danger
      />
    </div>
  );
};

export default UsersList;