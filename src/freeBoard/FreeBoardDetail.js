import React, { useEffect, useState } from 'react';
import firebase from './../FireBase';
import { Link } from "react-router-dom";

const FreeBoardDetail = ({ match, history }) => {
  // 로그인체크
  const ss_email = window.sessionStorage.getItem('ss_email');
  const authenticated = ss_email != null && ss_email != '';
  
  const [datas, setDatas] = useState([]);
  const [type, setType] = useState('');
  const [title, setTItle] = useState('');
  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');
  const userRef = firebase.database().ref('freeBoardList');
  const [myData, setMyData] = useState(0);
 
  useEffect(() => {
    userRef.on('value', snapshot => {
      const users = snapshot.val();
	  console.log(snapshot.val());
      const usersData = [];
      for(let id in users) {
        usersData.push({ ...users[id], id });
		{users[id].email == ss_email && setMyData(1) }
      }
  
      setDatas(usersData);
    })
  }, []);

  const onClickRemove = (id) => {
	if (window.confirm("정말 삭제하시겠습니까?")) {
	  userRef.child(id).remove();	  
      window.location.replace("/freeBoard");
	}    
  }

  return (
   <>
		{datas?.map(data => <div key={data.id}>
        
		{data.id == match.params.id ? (
	  <div>
		{/*타입: {data.type}<br />*/}
		<h4 className='board_title'>{data.title}</h4>
		<div className='information'></div>
		<span className='writer'>{data.email}</span>
        <span className='date'>{data.utime}</span>
        <p className='content'><img src={data.url} width="100%"/><br/><br/>{data.content}</p>
			<img src="https://res.cloudinary.com/dv8img/image/upload/c_thumb,w_100,g_face/v1633486673/quiz/mjykhnu0ntno8lpzoksl.png" />
        </div>
        ) : (
		  null
        )}
      </div>
		  
      )}
	  <hr/>
      <button className='grayBtn' onClick={() => history.goBack()}>목록</button>
	{myData == 1 && <>
	  <Link to={`./../FreeBoardEdit/${match.params.id}`}><button className='grayBtn'> 수정</button></Link>
	  <button className='grayBtn' onClick={() => onClickRemove(match.params.id)}>삭제</button>
     </>}
    </>
  );
};

export default FreeBoardDetail;