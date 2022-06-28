import React from "react";
import { Route } from "react-router-dom";
import PromotionList from "./PromotionList";
import PromotionDetail from "./PromotionDetail"
import PromotionCheck from "./PromotionCheck"
import PromotionWrite from "./PromotionWrite"
import PromotionEdit from "./PromotionEdit"
import Pagination from '../common/Pagination';
import firebase from './../FireBase';

function index({ match }) {
 

  return (
    <>
	  <section>
      <h1>Promotion</h1>

      <Route exact path={`${match.path}/:page`} component={PromotionList} />
      <Route path={`${match.path}/PromotionDetial/:id/:page`} component={PromotionDetail} />
      <Route path={`${match.path}/PromotionCheck/:id/:page`} component={PromotionCheck} />

      <Route path={`${match.path}/PromotionWrite/:page`} component={PromotionWrite} />

      <Route path={`${match.path}/PromotionEdit/:id2/:page2`} component={PromotionEdit} />
	  </section>
    </>
  );
}

export default index;