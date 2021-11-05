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
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');
  const userRef = firebase.database().ref('freeBoardList');

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
    e.target.name === 'title' ? setTitle(e.target.value) : setEmail(ss_email);
    e.target.name === 'content' ? setContent(e.target.value) : setEmail(ss_email);
  }

  const onClickAdd = () => {
    const userData = { type, title, content, email };

    userRef.push(userData);
    setType('');
    setTitle('');
    setContent('');
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
			{/*<font color='blue'>{data.type}</font><br />*/}
			
		  <img src={data.url != null ? data.url.replace("/upload/","/upload/c_thumb,w_100,g_face/") : null} />

				
          <Link to={`${match.url}/FreeBoardDetial/${data.id}`}>{data.title}</Link>
          <br />
          <Link to={`${match.url}/FreeBoardDetial/${data.id}`}>{data.content}</Link>
        </div>	
        <hr />		
		{/*data.email == ss_email ? (
		  <button className='delBtn' onClick={() => onClickRemove(data.id)}><AiOutlineClose/></button>
        ) : (
		  null
        )*/}		
      </div>
      )}
	  {datas.length == 0 ? (
		<div className='box'>등록된 게시물이 없습니다.</div>
	  ) : (
		null
	  )}
	<Link to={`${match.url}/FreeBoardWrite`}>
	  <button className='writeRedBtn'>
        글쓰기
      </button>
	</Link>
    </div>
  );
};

export default FreeBoardList;