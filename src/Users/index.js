import React from "react";
import { Route } from "react-router-dom";
import UserList from "./UserList";
import UserDetail from "./UserDetail"

function Users({ match }) {
  return (
    <>
      <h1>Users</h1>
      <Route exact path={match.path} component={UserList} />
      <Route path={`${match.path}/:id`} component={UserDetail} />
    </>
  );
}

export default Users;