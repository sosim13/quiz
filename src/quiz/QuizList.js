import React, { useEffect, useState } from 'react';
import firebase from './../FireBase';
import { Link } from "react-router-dom";
import { AiOutlineClose, AiFillCopy, AiTwotoneLike, AiFillDislike, AiTwotoneAlert } from "react-icons/ai";
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';

const QuizList = ({ match }) => {
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

  const [isOpen, setMenu] = useState('copy');  // 메뉴의 초기값을 false로 설정

  const handleCopyClipBoard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);    
	  ToastsStore.success(text+" 복사성공");
	  setMenu(isOpen => text);
    } catch (error) {
	  ToastsStore.success(text+" 복사실패");
      console.log('복사 실패:'+error);
    }
  };
  

  return (
    <div>
		{datas?.map(data => <div key={data.id}>
        <div className='box'>
          <font color='blue'><b><input type='checkbox' name='chk' value='' /> {data.type}</b></font>
          <br />
			{/*<Link to={`${match.url}/QuizDetial/${data.id}`}>*/}
			<font color='red'>{data.quiz}</font>
			{/*</Link>*/}
          <br />
          <span className={isOpen == data.answer ? "copySucc" : ""} onClick={() => handleCopyClipBoard(data.answer)}> <AiFillCopy/>&nbsp;{data.answer}&nbsp;</span>
		  <ToastsContainer className='toast' store={ToastsStore} lightBackground/>
		  <div className='shotBtn'> <Link to={`${match.url}/QuizDetial/${data.id}`}><font color='gray'><AiTwotoneAlert/></font></Link> </div>
			{/*<div className='shotBtn'> <font color='gray'><AiFillDislike/></font> </div>
		  <div className='shotBtn'> <font color='gray'><AiTwotoneLike/></font> </div>*/}
        </div>	
        <hr />		
		{data.email == ss_email ? (
		  <button className='delBtn' onClick={() => onClickRemove(data.id)}><AiOutlineClose/></button>
        ) : (
		  null
        )}
		</div>
		)}
		
	  {datas.length == 0 ? (
		<div className='box'>등록된 게시물이 없습니다.</div>
	  ) : (
		null
	  )}
	
		<div>광고</div>
	<Link to={`${match.url}/QuizCRUD`}>
	{ss_email != null ? (
	  <button className='writeRedBtn'>
        글쓰기
      </button>
		) : (
		  <div></div>
	)}
	</Link>
    </div>
  );
};

export default QuizList;