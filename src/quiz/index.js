import React from "react";
import { Route } from "react-router-dom";
import QuizList from "./QuizList";
import QuizDetail from "./QuizDetail"
import QuizCRUD from "./QuizCRUD"
import firebase from './../FireBase';
import './Quiz.css';

function index({ match }) {
 

  return (
    <>
      <h1>Quiz</h1>
      
      <Route exact path={match.path} component={QuizList} />
      <Route path={`${match.path}/QuizDetial/:id`} component={QuizDetail} />
      <Route path="/quiz/QuizCRUD" component={QuizCRUD} />
    </>
  );
}

export default index;