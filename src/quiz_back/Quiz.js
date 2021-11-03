import React, { useEffect, useState } from 'react';
import firebase from './../FireBase';
import './Quiz.css';
import { AiOutlineClose, AiTwotoneLike, AiFillDislike } from "react-icons/ai";

const Quiz = () => {
  // 로그인체크
  const ss_email = window.sessionStorage.getItem('ss_email');
  const authenticated = ss_email != null && ss_email != '';

  const [datas, setDatas] = useState([]);
  const [type, setType] = useState('');
  const [quiz, setQuiz] = useState('');
  const [answer, setAnswer] = useState('');
  const [email, setEmail] = useState('');
  const userRef = firebase.database().ref('quiz_list');

  useEffect(() => {
    userRef.on('value', snapshot => {
      const users = snapshot.val();
      const usersData = [];
      for(let id in users) {
        usersData.push({ ...users[id], id });
      }
  
      setDatas(usersData);
    })
  }, []);

  const onChange = (e) => {
    e.target.name === 'type' ? setType(e.target.value) : setEmail(ss_email);
    e.target.name === 'quiz' ? setQuiz(e.target.value) : setEmail(ss_email);
    e.target.name === 'answer' ? setAnswer(e.target.value) : setEmail(ss_email);
  }

  const onClickAdd = () => {
    const userData = { type, quiz, answer, email };

    userRef.push(userData);
    setType('');
    setQuiz('');
    setAnswer('');
    setEmail('');
  }

  const onClickRemove = (id) => {
    userRef.child(id).remove();
  }

  const onUpdate = (id) => {
//    const [user] = datas.filter(el => el.id === id);

//    userRef.child(id).update({
//      age: user.age++
//    });

  //  setDatas(datas.map(el => el.id === id ? {...el, age: el.age++} : el));
  };

  return (
    <div>
      {datas?.map(data => <div key={data.id}>
        <div>
          타입: {data.type}
          <br />
          문제: {data.quiz}
          <br />
          정답: {data.answer} 
        </div>		
		{data.email == ss_email ? (
		  <button className='delBtn' onClick={() => onClickRemove(data.id)}><AiOutlineClose/></button>
        ) : (
		  null
        )}	
		
        <hr />
      </div>
      )}
      <div className="form">
	    <select name='type' onChange={onChange}>
	  	  <option value='선택'>선택</option>
	  	  <option value='토스'>토스</option>
	  	  <option value='OK캐시백'>OK캐시백</option>
	    </select>
        <input onChange={onChange} name='quiz' placeholder='문제' value={quiz}></input>
        <input onChange={onChange} name='answer' placeholder='제정답' value={answer}></input>
        <button className='writeBtn' onClick={onClickAdd}>등록하기</button>
      </div>
    </div>
  );
};

export default Quiz;