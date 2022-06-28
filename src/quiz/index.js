import React from "react";
import { Route } from "react-router-dom";
import QuizList from "./QuizList";
import QuizBestList from "./QuizBestList";
import QuizDetail from "./QuizDetail"
import QuizCRUD from "./QuizCRUD"
import QuizAdd from "./QuizAdd"
import firebase from './../FireBase';

function index({ match }) {
 

  return (
    <>
	  <section>
      <h1>Quiz</h1>      
      <Route exact path={match.path} component={QuizBestList} />
      <Route path={`${match.path}/QuizDetial/:type/:quiz/:answer`} component={QuizDetail} />
      <Route path="/quiz/QuizList" component={QuizList} />
      <Route path="/quiz/QuizCRUD" component={QuizCRUD} />
	  <Route path="/quiz/QuizAdd" component={QuizAdd} />
	  </section>
    </>
  );
}

export default index;