import React from "react";
import { Route } from "react-router-dom";
import FreeBoardList from "./FreeBoardList";
import FreeBoardDetail from "./FreeBoardDetail"
import FreeBoardWrite from "./FreeBoardWrite"
import FreeBoardEdit from "./FreeBoardEdit"
import firebase from './../FireBase';

function index({ match }) {
 

  return (
    <>
      <h1>FreeBoard</h1>

      <Route exact path={match.path} component={FreeBoardList} />
      <Route path={`${match.path}/FreeBoardDetial/:id`} component={FreeBoardDetail} />
      <Route path="/freeBoard/FreeBoardWrite" component={FreeBoardWrite} />
      <Route path={`${match.path}/FreeBoardEdit/:id2`} component={FreeBoardEdit} />
    </>
  );
}

export default index;