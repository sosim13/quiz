import React from "react";
import { Route } from "react-router-dom";
import FreeBoardList from "./FreeBoardList";
import FreeBoardDetail from "./FreeBoardDetail"
import FreeBoardWrite from "./FreeBoardWrite"
import FreeBoardEdit from "./FreeBoardEdit"
import Pagination from '../common/Pagination';
import firebase from './../FireBase';

function index({ match }) {
 

  return (
    <>
	  <section>
      <h1>FreeBoard</h1>

      <Route exact path={`${match.path}/:page`} component={FreeBoardList} />
      <Route path={`${match.path}/FreeBoardDetial/:id/:page`} component={FreeBoardDetail} />

      <Route path={`${match.path}/FreeBoardWrite/:page`} component={FreeBoardWrite} />

      <Route path={`${match.path}/FreeBoardEdit/:id2/:page2`} component={FreeBoardEdit} />
	  </section>
    </>
  );
}

export default index;