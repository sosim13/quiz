import React from "react";
import { Route } from "react-router-dom";
import NoticeList from "./NoticeList";
import NoticeDetail from "./NoticeDetail"
import NoticeWrite from "./NoticeWrite"
import NoticeEdit from "./NoticeEdit"
import Pagination from '../common/Pagination';
import firebase from './../FireBase';

function index({ match }) {
 

  return (
    <>
	  <section>
      <h1>Notice</h1>

      <Route exact path={`${match.path}/:page`} component={NoticeList} />
      <Route path={`${match.path}/NoticeDetial/:id/:page`} component={NoticeDetail} />

      <Route path={`${match.path}/NoticeWrite/:page`} component={NoticeWrite} />

      <Route path={`${match.path}/NoticeEdit/:id2/:page2`} component={NoticeEdit} />
	  </section>
    </>
  );
}

export default index;