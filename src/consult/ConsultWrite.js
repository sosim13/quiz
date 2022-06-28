import React, { useEffect, useState } from 'react';
import firebase from './../FireBase';
import moment from 'moment';
import 'moment/locale/ko';	//대한민국
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';
// push request
import request from 'request';
import axios from "axios";

const ConsultCRUD = ({ match, history }) => {
  // 로그인체크
  const ss_email = window.sessionStorage.getItem('ss_email');
  const ss_account = window.localStorage.getItem('ss_account');
  
  // 현재 날짜
  const nowTime = moment().format('YYYYMMDDHHmmss');
//  console.log(nowTime);

  // axios 푸시
  const axios = require('axios')
  function asFcmRequest(pushId, subject,msg,link,chkMessage) {
	  
	const options = {
	  'to': pushId,
	  'data': {
		'title': subject,
		'body': msg,
		'tag': link,
	  },
	}

	const request = {
	url: 'https://fcm.googleapis.com/fcm/send',
	  headers: {
		Authorization: 'key=AAAAMjvVL9Y:APA91bFmhTC4IJ32zy4XyPASEqjeYZXxM2ZsgFBtTWr7P7YgyKOshNsDDQgZOhSLpAwYfyErvEW9skRiiWAHGW1I5YWJsyWAOw1oNbZfi1Gt6xT8pn61Z-oZpZR3qJiQiEZhNkTmm8IG',
		'Content-Type': 'application/json'
	  },
	  method: 'post',
	  data: options
	}
	return axios(request);	
  }
  // axios 푸시 끝

  const [datas, setDatas] = useState([]);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [nickName, setNickName] = useState('');
  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');
  const [wtime, setWtime] = useState('');
  const [utime, setUtime] = useState('');
  const [url, setUrl] = useState("");
  const [readNo, setReadNo] = useState(0);
  const userRef = firebase.database().ref('consultList');
  const loginRef = firebase.database().ref('member_list');
  // push 알림 리스트 가져오기
  const alarmRef = firebase.database().ref('member_alarm');

  useEffect(() => {
    loginRef.on('value', snapshot => {
      const users = snapshot.val();
      const usersData = [];
      for(let id in users) {
        usersData.push({ ...users[id], id });
		{users[id].email == ss_account && setNickName(users[id].nickName) }
      }
  
      setDatas(usersData);
    })
  }, []);

  const onChange = (e) => {
    e.target.name === 'type' ? setType(e.target.value) : setEmail(ss_account);
    e.target.name === 'title' ? setTitle(e.target.value) : setWtime(nowTime);
    e.target.name === 'content' ? setContent(e.target.value) : setUtime(nowTime);
  }

  const onClickAdd = () => {

	if (nickName == '')
	{
		alert('마이페이지에서 닉네임을 먼저 설정해주세요.');
		return false;
	}
	if (title == '')
	{
		alert('제목을 입력해주세요.');
		return false;
	}
	if (content == '')
	{
		alert('내용을 입력해주세요.');
		return false;
	}
    const userData = { type, title, nickName, content, email, wtime, utime, url, readNo };

    userRef.push(userData);
	alarmRef.orderByChild('email').equalTo('50english@naver.com').once('value', snapshot => {
	  const alarms = snapshot.val();
	  for(let id in alarms) {
			asFcmRequest(alarms[id].reg_id, '['+nickName+' 1:1문의] ('+type+') '+title,content,'https://bnbd.co.kr/consult/1', 'consult by system')
	  }
  
	})


    ToastsStore.success("등록했습니다.");
	setTimeout(function(){
		window.location.replace("/consult/1");
	}, 1000);
//	window.location.replace("/consult/1");
//    setType('');
//    setTitle('');
//    setContent('');
//    setEmail('');

  }

// 클라우디너리 이미지 업로드
  const uploadImage = (image) => {

		const data = new FormData()
		data.append("file", image)
		data.append("upload_preset", "quizReact")
		data.append("cloud_name","dv8img")
		fetch("https://api.cloudinary.com/v1_1/dv8img/upload",{
			method:"post",
			body: data
		})
			.then(resp => resp.json())
			.then(data => {
			setUrl(data.url.replace('http://','https://'))
		})
		.catch(err => console.log(err))
	}


  return (
   <div className='mybox'>
      <div className="form">
		{/*<select name='type' onChange={onChange}>
	  	  <option value='선택'>선택</option>
	  	  <option value='토스'>토스</option>
	  	  <option value='OK캐시백'>OK캐시백</option>	  
	  	  <option value='캐시워크'>캐시워크</option>			  
	  	  <option value='타임스프레드'>타임스프레드</option>
	  	  <option value='캐시슬라이드'>캐시슬라이드</option>
	  	  <option value='옥션'>옥션</option>
	  	  <option value='리브메이트'>리브메이트</option>
	  	  <option value='우리WON멤버스'>우리WON멤버스</option>
	  	  <option value='신한쏠야구'>신한쏠야구</option>
	  	  <option value='네이버페이'>네이버페이</option>
	  	  <option value='기타'>기타</option>
	    </select>*/}
		
        <div className='row'>
		  <span>문의종류</span>
		  <select name='type' onChange={onChange}>
			  <option value=''>선택</option>
			  <option value='사용문의'>사용문의</option>
			  <option value='오류문의'>오류문의</option>
			  <option value='포인트문의'>포인트문의</option>
			  <option value='건의사항'>건의사항</option>
			  <option value='의견사항'>의견사항</option>
			  <option value='기타'>기타</option>
			</select>
		</div>		
        <div className='row'>
		  <span>제목</span>
		  <input
			name={'title'}
			className='nametap'
			type="text"
			placeholder="제목"
			maxLength="30"
			value={title}
			onChange={onChange}
		  />
		</div>
	    <div className='row'>
		  <span>내용</span>
		  <textarea
			name={'content'}
			className='message'
			placeholder="내용"
			maxLength="2000"
			value={content}
			onChange={onChange}
		  ></textarea>
		</div>
        <div className='row'>
		  <span>이미지</span>
		  
		</div>
		<div>
		  <span className=''>
		<label htmlFor="input-file"><img src={url != '' ? url : "https://res.cloudinary.com/dv8img/image/upload/c_scale,w_265/v1636694953/web/choosefile_isp9qk.png"} width="265"/></label>
		  <input type="file" onChange= {(e)=> uploadImage(e.target.files[0])} id="input-file" />	
		</span>
		</div>
		<div className="buttons">
			<button className="write" onClick={onClickAdd}>글쓰기</button>
			<button className="cancel"onClick={() => window.location.replace("/consult/"+match.params.page)}>취소</button>
		</div>
      </div>
    <ToastsContainer className='toast' store={ToastsStore} lightBackground/>
    </div>
  );
};

export default ConsultCRUD;