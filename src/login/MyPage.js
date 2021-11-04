import React, { useEffect, useState } from 'react';
import firebase from './../FireBase';
import { authService, firebaseInstance  } from './../FireBase';
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';


function MyPage({ user }) {
  
  // 로그인체크
  const ss_email = window.sessionStorage.getItem('ss_email');
  const authenticated = ss_email != null && ss_email != '';

  // 현재 날짜
  const today = new Date();
  const year = today.toLocaleDateString('en-US', {
    year: 'numeric',
  });
  const month = today.toLocaleDateString('en-US', {
    month: '2-digit',
  });
  const day = today.toLocaleDateString('en-US', {
    day: '2-digit',
  });
//  console.log(year+month+day);
//  console.log(today);

  const [datas, setDatas] = useState([]);
  const [firebaseId, setFirebaseId] = useState('');
  const [email, setEmail] = useState('');
  const [nickName, setNickName] = useState('');
  const [name, setName] = useState('');
  const [cell, setCell] = useState('');
  const [addr, setAddr] = useState('');
  const [photo, setPhoto] = useState('');
  const [point, setPoint] = useState('');
  const [message, setMessage] = useState('');
  const [wtime, setWtime] = useState('');
  const [utime, setUtime] = useState('');
  const [etime, setEtime] = useState('');
  const userRef = firebase.database().ref('member_list');

  const [nickName2, setNickName2] = useState('');
  const [cnt, setCnt] = useState(0);
  const onIncrease = () => {
    setCnt(cnt + 1);
  }

  useEffect(() => {
    userRef.once('value', snapshot => {
      const users = snapshot.val();
      const usersData = [];
      for(let id in users) {
        usersData.push({ ...users[id], id });
		
		{users[id].email == ss_email && console.log(id) }
		{users[id].email == ss_email && setFirebaseId(id) }
		{users[id].email == ss_email && setEmail(users[id].email) }
		{users[id].email == ss_email && setNickName(users[id].nickName) }
		{users[id].email == ss_email && setName(users[id].name) }
		{users[id].email == ss_email && setCell(users[id].cell) }
		{users[id].email == ss_email && setAddr(users[id].addr) }
		{users[id].email == ss_email && setPhoto(users[id].photo) }
		{users[id].email == ss_email && setPoint(users[id].point) }
		{users[id].email == ss_email && setMessage(users[id].message) }
		{users[id].email == ss_email && setWtime(users[id].wtime) }
		{users[id].email == ss_email && setUtime(users[id].utime) }
		{users[id].email == ss_email && setEtime(users[id].etime) }
		{users[id].email == ss_email && onIncrease() }
      }
  
      setDatas(usersData);
    })
  }, []);

  const onChange = (e) => {
    e.target.name === 'nickName' ? setNickName(e.target.value) : setEmail(ss_email);
    e.target.name === 'name' ? setName(e.target.value) : setEmail(ss_email);
    e.target.name === 'cell' ? setCell(e.target.value) : setEmail(ss_email);
    e.target.name === 'addr' ? setAddr(e.target.value) : setEmail(ss_email);
    e.target.name === 'photo' ? setPhoto(e.target.value) : setEmail(ss_email);
    e.target.name === 'point' ? setPoint(e.target.value) : setEmail(ss_email);
    e.target.name === 'message' ? setMessage(e.target.value) : setEmail(ss_email);
    e.target.name === 'wtime' ? setWtime(e.target.value) : setEmail(ss_email);
    e.target.name === 'utime' ? setUtime(e.target.value) : setEmail(ss_email);
    e.target.name === 'etime' ? setEtime(e.target.value) : setEmail(ss_email);
  }

  const onClickAdd = () => {
    const userData = { email, name, nickName, cell, addr, photo, point, message, wtime, utime, etime };

    userRef.push(userData);
	window.location.replace("/MyPage");
  }

  const onUpdate = (id) => {
    const [data] = datas.filter(el => el.id === id);
console.log(data);
    userRef.child(id).update({
      nickName: nickName,
      name: name,
      cell: cell,
      addr: addr,
      photo: photo,
      message: message,
      utime: utime
    });

    setNickName(nickName);
    setName(name);
    setCell(cell);
    setAddr(addr);
    setPhoto(photo);
    setMessage(message);
    setUtime(utime);
	    
    ToastsStore.success("수정했습니다.");
//    setDatas(datas.map(el => el.id === id ? {...el, nickName: el.nickName} : el));
  };

  

  // 로그아웃
  const onLogOutClick = () => {
    authService.signOut();
	
	console.log("로그아웃");
	window.sessionStorage.setItem('ss_email', '');
	window.location.replace("/");
  }

  return (
    <div className='mybox'>
      <h1>마이페이지</h1>
	  {cnt === 0 ? (
	  <div>
			<div className='row'>
			  <span>이메일</span>
			  <p className='email' type="text">
				{ss_email}
			  </p>
			</div>
			<div className='row'>
			  <span>포인트</span>
			  <p className='email' type="text">
				0
			  </p>
			</div>		    
			<div className='row'>
			  <span>닉네임</span>
			  <input
				name={'nickName'}
				className='nametap'
				type="text"
				placeholder="닉네임을 입력하세요"
				maxLength="10"
				value={nickName}
				onChange={onChange}
			  />
			</div>
			<div className='row'>
			  <span>이름</span>
			  <input
				name={'name'}
				className='nametap'
				type="text"
				placeholder="이름을 입력하세요"
				maxLength="10"
				value={name}
				onChange={onChange}
			  />
			</div>
			<div className='row'>
			  <span>휴대폰번호</span>
			  <input
				name={'cell'}
				className='nametap'
				type="text"
				placeholder="휴대폰번호를 입력하세요"
				maxLength="10"
				value={cell}
				onChange={onChange}
			  />
			</div>
			<div className='row'>
			  <span>주소</span>
			  <input
				name={'addr'}
				className='nametap'
				type="text"
				placeholder="주소을 입력하세요"
				maxLength="10"
				value={addr}
				onChange={onChange}
			  />
			</div>
			<div className='row'>
			  <span>소개</span>
			  <textarea
				name={'message'}
				className='message'
				placeholder="소개를 해주세요"
				maxLength="40"
				value={message}
				onChange={onChange}
			  ></textarea>
			</div>
			<div className='row'>
			  <button className='save' onClick={onClickAdd}>
				저장하기
			  </button>
			  <button className='logout' type="button" onClick={onLogOutClick}>
				로그아웃
			  </button>
			</div>
        </div>
     ) : (
       <div>
			<div className='row'>
			  <span>이메일</span>
			  <p className='email' type="text">
				{email}
			  </p>
			</div>
			<div className='row'>
			  <span>포인트</span>
			  <p className='email' type="text">
				{point}
			  </p>
			</div>		    
			<div className='row'>
			  <span>닉네임</span>
			  <input
				name={'nickName'}
				className='nametap'
				type="text"
				placeholder="닉네임을 입력하세요"
				maxLength="10"
				value={nickName}
				onChange={onChange}
			  />
			</div>
			<div className='row'>
			  <span>이름</span>
			  <input
				name={'name'}
				className='nametap'
				type="text"
				placeholder="이름을 입력하세요"
				maxLength="10"
				value={name}
				onChange={onChange}
			  />
			</div>
			<div className='row'>
			  <span>휴대폰번호</span>
			  <input
				name={'cell'}
				className='nametap'
				type="text"
				placeholder="휴대폰번호를 입력하세요"
				maxLength="10"
				value={cell}
				onChange={onChange}
			  />
			</div>
			<div className='row'>
			  <span>주소</span>
			  <input
				name={'addr'}
				className='nametap'
				type="text"
				placeholder="주소을 입력하세요"
				maxLength="10"
				value={addr}
				onChange={onChange}
			  />
			</div>
			<div className='row'>
			  <span>소개</span>
			  <textarea
				name={'message'}
				className='message'
				placeholder="소개를 해주세요"
				maxLength="40"
				value={message}
				onChange={onChange}
			  ></textarea>
			</div>
			<div className='row'>
			  <button className='save' onClick={() => onUpdate(firebaseId)}>
				수정하기
			  </button>
			  <button className='logout' type="button" onClick={onLogOutClick}>
				로그아웃
			  </button>
			</div>
        </div>
     )}
		<ToastsContainer className='toast' store={ToastsStore} lightBackground/>
    </div>
  );
}

export default MyPage;