import React, { useEffect, useState } from 'react';
import firebase from './../FireBase';

const QuizCRUD = ({ match, history }) => {
  // 로그인체크
  const ss_email = window.sessionStorage.getItem('ss_email');
  const authenticated = ss_email != null && ss_email != '';

  const [datas, setDatas] = useState([]);
  const [type, setType] = useState('');
  const [quiz, setQuiz] = useState('');
  const [answer, setAnswer] = useState('');
  const [email, setEmail] = useState('');
  const [url, setUrl] = useState('');
  const [wtime, setWtime] = useState('');
  const userRef = firebase.database().ref('quiz_list');

  const onChange = (e) => {
    e.target.name === 'type' ? setType(e.target.value) : setEmail(ss_email);
    e.target.name === 'quiz' ? setQuiz(e.target.value) : setWtime(ss_email);
    e.target.name === 'answer' ? setAnswer(e.target.value) : setEmail(ss_email);
  }

  const onClickAdd = () => {
    const userData = { type, quiz, answer, email };

    userRef.push(userData);
	window.location.replace("/quiz");
    setType('');
    setQuiz('');
    setAnswer('');
    setEmail('');
    setUrl('');
    setWtime('');
  }
  

  return (
   <div className="box">
      <div className="form">
	    <select name='type' onChange={onChange}>
	  	  <option value='선택'>선택</option>
	  	  <option value='토스'>토스</option>
	  	  <option value='오퀴즈'>오퀴즈</option>	  
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
        <input onChange={onChange} name='quiz' placeholder='이벤트명' value={quiz} maxlength='24'></input>
        <input onChange={onChange} name='answer' placeholder='정답' value={answer} maxlength='24'></input>
		<div className="buttons">
			<button className="write" onClick={onClickAdd}>글쓰기</button>
			<button className="cancel" onClick={() => history.goBack()}>취소</button>
		</div>
	    <div><br/>
	      이벤트명은 문제를 적는 칸이 아니고 어떤 퀴즈인지 알 수 있도록 주체사명을 적어주세요.<br/>
	      ex) 서울시청이 주관하는 퀴즈<br/>
	      문제 : 서울시청에서 주관하는 행사명은 무엇일까요?<br/> (흰트 : ㅌㅅㅌ)<br/>
	      정답 : 테스트<br/><br/>

	      (작성요령)<br/>
		  이벤트명 : 서울시청<br/>
		  정답 : 테스트<br/>
	    </div>
      </div>
    </div>
  );
};

export default QuizCRUD;