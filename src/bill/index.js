import React from "react";
import { Route } from "react-router-dom";
import BillList from "./BillList";
import BillDetail from "./BillDetail"
import BillWrite from "./BillWrite"
import BillEdit from "./BillEdit"
import firebase from './../FireBase';

function index({ match }) {
 

  return (
    <>
	  <section>
      <h1>영수증리뷰</h1>
      <Route exact path={`${match.path}/:page`} component={BillList} />
      <Route path={`${match.path}/BillDetial/:id/:page`} component={BillDetail} />
      <Route  path={`${match.path}/BillWrite/:page`} component={BillWrite} />
      <Route path={`${match.path}/BillEdit/:id2/:page2`} component={BillEdit} />
	  </section>
    </>
  );
}

export default index;