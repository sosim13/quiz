import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import firebase from './../FireBase';
import { authService, firebaseInstance  } from './../FireBase';
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';
import moment from 'moment';
import 'moment/locale/ko';	//대한민국

function MyPage({ user }) {
  
  // 로그인체크
  const ss_email = window.sessionStorage.getItem('ss_email');
  const ss_account = window.localStorage.getItem('ss_account');
  const ss_reg_id = window.sessionStorage.getItem('ss_reg_id');
  const ss_reg_type = window.sessionStorage.getItem('ss_reg_type');

  // 현재 날짜
  const nowTime = moment().format('YYYYMMDDHHmmss');

  const [datas, setDatas] = useState([]);
  const [firebaseId, setFirebaseId] = useState('');
  const [email, setEmail] = useState('');
  const [nickName, setNickName] = useState('');
  const [name, setName] = useState('');
  const [cell, setCell] = useState('');
  const [addr, setAddr] = useState('');
  const [photo, setPhoto] = useState('');
  const [point, setPoint] = useState(0);
  const [message, setMessage] = useState('');
  const [wtime, setWtime] = useState(nowTime);
  const [utime, setUtime] = useState(nowTime);
  const [reg_id, setReg_id] = useState(ss_reg_id);
  const [reg_type, setReg_type] = useState(ss_reg_type);
  const memberRef = firebase.database().ref('member_list');
  const [nickDatas, setNickDatas] = useState([]);

  const [cnt, setCnt] = useState(0);
  const onIncrease = () => {
    setCnt(cnt + 1);
  }

  useEffect(() => {
    memberRef.on('value', snapshot => {
      const users = snapshot.val();
      const usersData = [];
      const usersData2 = [];
      for(let id in users) {
        usersData.push({ ...users[id], id });
	    {users[id].email == ss_account && setFirebaseId(id) }
		{users[id].email == ss_account && setEmail(users[id].email) }
		{users[id].email == ss_account && setNickName(users[id].nickName) }
		{users[id].email == ss_account && setName(users[id].name) }
		{users[id].email == ss_account && setCell(users[id].cell) }
		{users[id].email == ss_account && setAddr(users[id].addr) }
		{users[id].email == ss_account && setPhoto(users[id].photo) }
		{users[id].email == ss_account && setPoint(users[id].point) }
		{users[id].email == ss_account && setMessage(users[id].message) }
		{users[id].email == ss_account && setWtime(users[id].wtime) }
		{users[id].email == ss_account && setUtime(users[id].utime) }
		{users[id].email == ss_account && onIncrease() }
		{users[id].email != ss_account && usersData2.push(users[id].nickName) }
      }

      setDatas(usersData);
	  setNickDatas(usersData2);
//	  console.log(usersData2);
    })
  }, []);

  const onChange = (e) => {
    e.target.name === 'nickName' ? setNickName(e.target.value) : setEmail(ss_account);
    e.target.name === 'name' ? setName(e.target.value) : setEmail(ss_account);
    e.target.name === 'cell' ? setCell(e.target.value) : setEmail(ss_account);
    e.target.name === 'addr' ? setAddr(e.target.value) : setEmail(ss_account);
    e.target.name === 'photo' ? setPhoto(e.target.value) : setEmail(ss_account);
    e.target.name === 'point' ? setPoint(e.target.value) : setEmail(ss_account);
    e.target.name === 'message' ? setMessage(e.target.value) : setEmail(ss_account);
    e.target.name === 'wtime' ? setWtime(e.target.value) : setEmail(ss_account);
    e.target.name === 'utime' ? setUtime(e.target.value) : setEmail(ss_account);
  }

  const onClickAdd = () => {

	if (nickName == '')
	{
		alert('닉네임을 입력해주세요.');
		return false;
	}
	if ( nickDatas.includes(nickName) )
	{
		alert('이미 사용중인 닉네임입니다.');
		return false;
	}
	if (name == '')
	{
		alert('이름을 입력해주세요.');
		return false;
	}

	if (cell == '')
	{
		alert('휴대폰번호를 입력해주세요.');
		return false;
	}
	if (addr == '')
	{
		alert('주소를 입력해주세요.');
		return false;
	}

    const userData = { email, name, nickName, cell, addr, photo, point, message, wtime, utime, reg_id, reg_type };

	setEmail(email) 
	setName(name)
	setNickName(nickName) 
	setCell(cell)
	setAddr(addr)
	setPhoto(photo)
	setPoint(point)
	setMessage(message)

    memberRef.push(userData);
    ToastsStore.success("저장했습니다.");
//	window.location.replace("/MyPage");
  }

  const onUpdate = (id) => {

	if (nickName == '')
	{
		alert('닉네임을 입력해주세요.');
		return false;
	}
	if ( nickDatas.includes(nickName) )
	{
		alert('이미 사용중인 닉네임입니다.');
		return false;
	}
	if (name == '')
	{
		alert('이름을 입력해주세요.');
		return false;
	}

	if (cell == '')
	{
		alert('휴대폰번호를 입력해주세요.');
		return false;
	}
	if (addr == '')
	{
		alert('주소를 입력해주세요.');
		return false;
	}

    const [data] = datas.filter(el => el.id === id);

    memberRef.child(id).update({
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
	window.localStorage.clear();
	window.location.replace("/");
  }

  return (
	  <section>
    <div className='mybox'>
      <h1>마이페이지</h1>
	  {cnt == 0 ? (
	  <div>
			<div className='row'>
			  <span>이메일</span>
			  <p className='email' type="text">
				{ss_account}
			  </p>
			</div>
			<div className='row'>
			  <span>포인트</span>
			  <p className='email' type="text">
				{point == '' ? 0 : point}
			  </p>
			</div>		    
			<div className='row'>
			  <span>닉네임</span>
			  <input
				name={'nickName'}
				className='nametap'
				type="text"
				placeholder="닉네임을 입력하세요"
				maxLength="5"
				value={nickName}
				onChange={onChange}
			  />
			</div>
		  { nickDatas.includes(nickName) == true ? (
			<div className='useNick'>이미 사용중인 닉네입입니다.</div>
		  ) : (
		    null
		  )}
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
				maxLength="15"
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
				maxLength="100"
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
				  <>
       <div>
			<div className='row'>
			  <span>이메일</span>
			  <p className='email' type="text">
				{ss_account}
			  </p>
			</div>
			<div className='row'>
			  <span>포인트</span>
			  <p className='email' type="text">
				{point == '' ? 0 : point}
			  </p>
			</div>		    
			<div className='row'>
			  <span>닉네임</span>
			  <input
				name={'nickName'}
				className='nametap'
				type="text"
				placeholder="닉네임을 입력하세요"
				maxLength="5"
				value={nickName}
				onChange={onChange}
			  />
			</div>
				  
		  { nickDatas.includes(nickName) == true ? (
			<div className='useNick'>이미 사용중인 닉네입입니다.</div>
		  ) : (
		    null
		  )}
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
				maxLength="15"
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
				maxLength="100"
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
			  <Link to="/consult/1">
			<div className='row'>
			  <button className='longBtn' onClick={() => onUpdate(firebaseId)}>
				<strong>1:1 문의하기</strong>
			  </button>
			</div>
			  </Link>
				  </>
     )}
		<ToastsContainer className='toast' store={ToastsStore} lightBackground/>
    </div>
			</section>
  );
}

export default MyPage;