import React, { useEffect, useState } from 'react';
import firebase from './../FireBase';
import { Link } from "react-router-dom";
import { AiOutlineClose, AiFillCopy } from "react-icons/ai";

const FreeBoardList = ({ match }) => {
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

	if (window.confirm("정말 삭제하시겠습니까?")) {
	  userRef.child(id).remove();
	}
    
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
        <div className='box'>
          <font color='blue'>{data.type}</font>
          <br />
          <Link to={`${match.url}/FreeBoardDetial/${data.id}`}>{data.quiz}</Link>
          <br />
          <AiFillCopy/> {data.answer}
        </div>	
        <hr />		
		{data.email == ss_email ? (
		  <button className='delBtn' onClick={() => onClickRemove(data.id)}><AiOutlineClose/></button>
        ) : (
		  null
        )}		
      </div>
      )}
	<Link to={`${match.url}/FreeBoardCRUD`}>
	  <button className='writeRedBtn'>
        글쓰기
      </button>
	</Link>
    </div>
  );
};

export default FreeBoardList;