import React, { useEffect, useState } from 'react';
import firebase from './../FireBase';
import moment from 'moment';
import 'moment/locale/ko';	//대한민국
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';

const FreeBoardCRUD = ({ match, history }) => {
  // 로그인체크
  const ss_email = window.sessionStorage.getItem('ss_email');
  const authenticated = ss_email != null && ss_email != '';
  
  // 현재 날짜
  const nowTime = moment().format('YYYYMMDD HH:mm:ss');
//  console.log(nowTime);

  const [datas, setDatas] = useState([]);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');
  const [wtime, setWtime] = useState('');
  const [utime, setUtime] = useState('');
  const [firebaseId, setFirebaseId] = useState('');
  const userRef = firebase.database().ref('freeBoardList');
 
  useEffect(() => {
    userRef.on('value', snapshot => {
      const users = snapshot.val();
      const usersData = [];
      for(let id in users) {
        usersData.push({ ...users[id], id });
		{users[id].email == ss_email && setFirebaseId(id) }
		{users[id].email == ss_email && setTitle(users[id].title) }
		{users[id].email == ss_email && setContent(users[id].content) }
      }
  
      setDatas(usersData);
    })
  }, []);

  const onChange = (e) => {
    e.target.name === 'type' ? setType(e.target.value) : setEmail(ss_email);
    e.target.name === 'title' ? setTitle(e.target.value) : setEmail(ss_email);
    e.target.name === 'content' ? setContent(e.target.value) : setUtime(nowTime);
  }

  const onClickAdd = () => {
    const userData = { type, title, content, email, utime };

    userRef.push(userData);
	window.location.replace("/freeBoard");
//    setType('');
//    setTitle('');
//    setContent('');
//    setEmail('');

  }

  const onUpdate = (id) => {
    const [data] = datas.filter(el => el.id === id);
    userRef.child(id).update({
      title: title,
      content: content,
      utime: utime
    });

    setTitle(title);
    setContent(content);
    setUtime(utime);
	    
    ToastsStore.success("수정했습니다.");
  };


  return (
   <div className='mybox'>
	  {datas?.map(data => <div key={data.id}>
		{data.id == match.params.id2 && data.email == ss_email ? (
	    <div>
			<div className='row'>
			  <span>제목</span>
			  <input
				name={'title'}
				className='nametap'
				type="text"
				placeholder="제목"
				maxLength="10"
				value={title}
				onChange={onChange}
			  />
			</div>
			<div className='row'>
			  <span>소개</span>
			  <textarea
				name={'content'}
				className='message'
				placeholder="내용"
				maxLength="40"
				value={content}
				onChange={onChange}
			  ></textarea>
			</div>
			<div className="buttons">
				<button className="write"  onClick={() => onUpdate(firebaseId)}>수정하기</button>
				<button className="cancel" onClick={() => history.goBack()}>취소</button>
			</div>
        </div>
        ) : (
			null
        )}
      </div>		  
      )}

    
        
		
    <ToastsContainer className='toast' store={ToastsStore} lightBackground/>
    </div>
  );
};

export default FreeBoardCRUD;