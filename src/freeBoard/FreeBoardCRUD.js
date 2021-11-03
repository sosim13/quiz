import React, { useEffect, useState } from 'react';
import firebase from './../FireBase';

const FreeBoardCRUD = ({ match, history }) => {
  // 로그인체크
  const ss_email = window.sessionStorage.getItem('ss_email');
  const authenticated = ss_email != null && ss_email != '';

  const [datas, setDatas] = useState([]);
  const [type, setType] = useState('');
  const [quiz, setQuiz] = useState('');
  const [answer, setAnswer] = useState('');
  const [email, setEmail] = useState('');
  const userRef = firebase.database().ref('quiz_list');

  const onChange = (e) => {
    e.target.name === 'type' ? setType(e.target.value) : setEmail(ss_email);
    e.target.name === 'quiz' ? setQuiz(e.target.value) : setEmail(ss_email);
    e.target.name === 'answer' ? setAnswer(e.target.value) : setEmail(ss_email);
  }

  const onClickAdd = () => {
    const userData = { type, quiz, answer, email };

    userRef.push(userData);
	window.location.replace("/freeBoard");
    setType('');
    setQuiz('');
    setAnswer('');
    setEmail('');

  }
  

  return (
   <div>
      <div className="form">
	    <select name='type' onChange={onChange}>
	  	  <option value='선택'>선택</option>
	  	  <option value='토스'>토스</option>
	  	  <option value='OK캐시백'>OK캐시백</option>	  
	  	  <option value='캐시워크'>캐시워크</option>			  
	  	  <option value='타임스프레드'>타임스프레드</option>
	  	  <option value='캐시슬라이드'>캐시슬라이드</option>
	  	  <option value='옥션'>옥션</option>
	  	  <option value='리브메이트'>리브메이트</option>
	  	  <option value='우리WON멤버스'>우리WON멤버스</option>
	  	  <option value='신한쏠야구'>신한쏠야구</option>
	  	  <option value='네이버페이'>네이버페이</option>
	  	  <option value='기타'>기타</option>
	    </select>
        <input onChange={onChange} name='quiz' placeholder='문제' value={quiz}></input>
        <input onChange={onChange} name='answer' placeholder='정답' value={answer}></input>
		<div className="buttons">
			<button className="write" onClick={onClickAdd}>글쓰기</button>
			<button className="cancel" onClick={() => history.goBack()}>취소</button>
		</div>
      </div>
    </div>
  );
};

export default FreeBoardCRUD;