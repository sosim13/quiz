import React from "react";
import { Route } from "react-router-dom";
import ConsultList from "./ConsultList";
import ConsultDetail from "./ConsultDetail"
import ConsultWrite from "./ConsultWrite"
import ConsultEdit from "./ConsultEdit"
import Pagination from '../common/Pagination';
import firebase from './../FireBase';

function index({ match }) {
 

  return (
    <>
	  <section>
      <h1>1:1 문의하기</h1>

      <Route exact path={`${match.path}/:page`} component={ConsultList} />
      <Route path={`${match.path}/ConsultDetial/:id/:page`} component={ConsultDetail} />

      <Route path={`${match.path}/ConsultWrite/:page`} component={ConsultWrite} />

      <Route path={`${match.path}/ConsultEdit/:id2/:page2`} component={ConsultEdit} />
	  </section>
    </>
  );
}

export default index;