import React, { useEffect, useState } from 'react';
import firebase from './../FireBase';
import './MyPage.css';

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
  console.log(year+month+day);
  console.log(today);

  const [datas, setDatas] = useState([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [nickName, setNickName] = useState('');
  const [cell, setCell] = useState('');
  const [addr, setAddr] = useState('');
  const [photo, setPhoto] = useState('');
  const [point, setPoint] = useState('');
  const [message, setMessage] = useState('');
  const [wtime, setWtime] = useState('');
  const [utime, setUtime] = useState('');
  const [etime, setEtime] = useState('');
  const userRef = firebase.database().ref('member_list').orderByChild('name');

  useEffect(() => {
    userRef.once('value', snapshot => {
      const users = snapshot.val();
      const usersData = [];
      for(let id in users) {
        usersData.push({ ...users[id], id });
		console.log(users[id]);
      }
  
      setDatas(usersData);
    })
  }, []);

  const onChange = (e) => {
    
    e.target.name === 'name' ? setName(e.target.value) : setEmail(ss_email);
    e.target.name === 'nickName' ? setNickName(e.target.value) : setEmail(ss_email);
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
    const userData = { email, name, nickName, cell, addr, photo, point, wtime, utime, etime };

    userRef.push(userData);
	window.location.replace("/MyPage");
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
      <h1>마이페이지{datas.length}</h1>
      <form className='box'>
	  {datas?.map(data => <div key={data.id}>
        
		{data.email == ss_email ? (
		  <div>
          타입: {data.email}
        </div>
        ) : (
		  null
        )}
      </div>
      )}
	    <div className='row'>
          <span>이메일</span>
          <p className='email' type="text">
            {ss_email}
          </p>
        </div>
        <div className='row'>
          <span>이름</span>
          <input
            name={'name'}
            className='name'
            type="text"
            placeholder="이름을 입력하세요"
            maxLength="10"
            value={name}
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
          <button className='logout' type="button" >
            로그아웃
          </button>
        </div>
      </form>
    </div>
  );
}

export default MyPage;