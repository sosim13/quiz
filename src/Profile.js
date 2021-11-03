import React, { useEffect, useState } from 'react';
import firebase from './FireBase';

function Profile({ user }) {
  
  // 로그인체크
  const ss_email = window.sessionStorage.getItem('ss_email');
  const authenticated = ss_email != null && ss_email != '';

  const [datas, setDatas] = useState([]);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [answer, setAnswer] = useState('');
  const [email, setEmail] = useState('');
  const userRef = firebase.database().ref('member_list');

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

  return (
    <section>
      <h1>마이페이지</h1>
      <form className='box'>
	{/*<div className='row'>
          <span>사진</span>
          <ImageInput
            profile=''
            imgOnChange=''
            imgOnRemove=''
          />
        </div>*/}
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
            /*value={profile.name}*/
            /*onChange={onChange}*/
          />
        </div>
        <div className='row'>
          <span>소개</span>
          <textarea
            name={'message'}
            className='message'
            placeholder="소개를 해주세요"
            maxLength="40"
            /*value={profile.message}*/
            /*onChange={onChange}*/
          ></textarea>
        </div>
        <div className='row'>
          <button className='save' type="submit">
            저장하기
          </button>
          <button className='logout' type="button" >
            로그아웃
          </button>
        </div>
      </form>
    </section>
  );
}

export default Profile;