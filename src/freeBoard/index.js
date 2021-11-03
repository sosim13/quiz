import React from "react";
import { Route } from "react-router-dom";
import FreeBoardList from "./FreeBoardList";
import FreeBoardDetail from "./FreeBoardDetail"
import FreeBoardCRUD from "./FreeBoardCRUD"
import firebase from './../FireBase';
import './FreeBoard.css';

function index({ match }) {
 

  return (
    <>
      <h1>FreeBoard</h1>

      <Route exact path={match.path} component={FreeBoardList} />
      <Route path={`${match.path}/FreeBoardDetial/:id`} component={FreeBoardDetail} />
      <Route path="/freeBoard/FreeBoardCRUD" component={FreeBoardCRUD} />
    </>
  );
}

export default index;