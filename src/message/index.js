import React, { useEffect, useState } from 'react';
import firebase from './../FireBase';
import moment from 'moment';
import 'moment/locale/ko';	//대한민국
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';
// push request
import request from 'request';
import axios from "axios";

import { AiOutlineClose, AiTwotoneLike, AiFillDislike } from "react-icons/ai";

const Message = () => {
  // 로그인체크
  const ss_email = window.sessionStorage.getItem('ss_email');
  const authenticated = ss_email != null && ss_email != '';

  const [datas, setDatas] = useState([]);
  const [type, setType] = useState('');
  const [quiz, setQuiz] = useState('');
  const [answer, setAnswer] = useState('');
  const [email, setEmail] = useState('sosim13p@gmail.com');
  const [wdate, setWdate] = useState('');
  const [wtime, setWtime] = useState('');
  const [readNo, setReadNo] = useState(0);
  const [link, setLink] = useState('');
  const [nickName, setNickName] = useState('곰돌이');
  const [tipNo, setTipNo] = useState(5);
  const [declaration, setDeclaration] = useState(0);
  const userRef = firebase.database().ref('message');
  
  const bestRef = firebase.database().ref('quiz_best');
  const [bestDatas, setBestDatas] = useState([]);
  
  // push 알림 리스트 가져오기
  const alarmRef = firebase.database().ref('member_alarm');
  // push 발송이력
  const pushRef = firebase.database().ref('push_history');

  // 현재 날짜
  const nowTime = moment().format('YYYYMMDDHHmmss');
  const nowDate = moment().format('YYYYMMDD');

   // axios 푸시
  const axios = require('axios')
  function asFcmRequest(pushId, subject,msg,link,chkMessage) {

    let chkCnt = 0;
    pushRef.orderByChild('chkMessage').equalTo(chkMessage).once('value', snapshot => {
      const pushs = snapshot.val();
      for(let id in pushs) {
        chkCnt = chkCnt+1;		
      }

	  if(chkCnt == 0){

		const pushData = { chkMessage, pushId, subject, msg, link, nowTime };
		pushRef.push(pushData);

		const options = {
		  'to': pushId,
		  'data': {
			'title': subject,
			'body': msg,
			'tag': link, //이 부분에 원하는 url을 넣습니다.
		  }
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
    })

  }
  // axios 푸시 끝 

  useEffect(() => {
    userRef.on('value', snapshot => {
      const users = snapshot.val();
      const usersData = [];
      for(let id in users) {
        usersData.push({ ...users[id], id });
//        console.log(users[id].Text);
//        console.log(users[id].Title);
      }
  
      setDatas(usersData);
    })
  }, []);

  const onChange = (e) => {
    e.target.name === 'Title' ? setQuiz(e.target.value) : setEmail(ss_email);
    e.target.name === 'Text' ? setAnswer(e.target.value) : setEmail(ss_email);
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
    userRef.child(id).remove();
  }

  const onUpdate = (id) => {
    const [user] = datas.filter(el => el.id === id);

    userRef.child(id).update({
      age: user.age++
    });

    setDatas(datas.map(el => el.id === id ? {...el, age: el.age++} : el));
  };

  function onClickBestAdd(dataId, dataType, dataQuiz, dataAnswer){  
	
	console.log("# : "+dataType);
	console.log("# : "+dataQuiz);
	console.log("# : "+dataAnswer);

	var type = "";
	var quiz = "";
	var answer = "";
	var wtime = "";
	var wdate = "";
	
	setType(dataType);
	{dataQuiz.indexOf("(") > 0 ? 
		setQuiz(dataQuiz.split("]")[1].split("(")[0].replace(" ","").replace("-","").replace(" 퀴즈","").replace("오늘의","오늘의 퀴즈"))
	: 
		setQuiz(dataQuiz.split("]")[1].replace(" ","").replace("-","").replace(" 퀴즈","").replace("꿀 무료 적립 >","").replace("오늘의","오늘의 퀴즈"))
	}
	setAnswer(dataAnswer);	
	setWtime(nowTime);
	setWdate(nowDate);

	type = dataType;
	{dataQuiz.indexOf("(") > 0 ? 
		quiz = dataQuiz.split("]")[1].split("(")[0].replace(" ","").replace("-","").replace(" 퀴즈","")
	: 
		quiz = dataQuiz.split("]")[1].replace(" ","").replace("-","").replace(" 퀴즈","").replace("꿀 무료 적립 >","")
	}
	answer = dataAnswer;
	wtime = nowTime;
	wdate = nowDate;


	console.log("1 : "+type);
	console.log("2 : "+quiz);
	console.log("3 : "+answer);
	console.log(nowDate);


//	return false;

    const bestData = { type, quiz, answer, email, wtime, readNo, wdate, link, nickName, tipNo, declaration };
	bestRef.push(bestData);
	
		var type_name = '';
		if(type == '네이버'){
			type_name = 'naver';
		}else if(type == '캐시슬라이드'){
			type_name = 'cashslid';
		}else if(type == '리브메이트'){
			type_name = 'livemate';
		}else if(type == '신한플레이'){
			type_name = 'shinhanplay';
		}else if(type == '허니스크린'){
			type_name = 'honeyscreen';
		}else if(type == '카운셀러'){
			type_name = 'counseller';
		}else if(type == '카카오페이지'){
			type_name = 'kakaopage';
		}else if(type == '오케이캐시백'){
			type_name = 'okcashbag';
		}else if(type == '타임스프레드'){
			type_name = 'timespred';
		}else if(type == '우리WON멤버스'){
			type_name = 'woori';
		}else if(type == '옥션'){
			type_name = 'action';
		}else if(type == '마이홈플러스'){
			type_name = 'myhomeplus';
		}else if(type == '교보문구'){
			type_name = 'kyobo';
		}else if(type == '케어나우'){
			type_name = 'carenow';
		}else if(type == '캐시워크'){
			type_name = 'cashwork';
		}else if(type == '토스'){
			type_name = 'toss';
		}else if(type == '신한쏠'){
			type_name = 'shinhanssol';
		}else if(type == 'H.POINT'){
			type_name = 'hpoint';
		}else if(type == '올리고'){
			type_name = 'oligo';
		}else if(type == '예스24'){
			type_name = 'yes24';
		}else if(type == '어댑터'){
			type_name = 'adapter';
		}else if(type == '패널나우'){
			type_name = 'pannelnow';
		}else if(type == '기타'){
			type_name = 'etc';
		}

		
		alarmRef.orderByChild(type_name).equalTo('ON').once('value', snapshot => {
		  const alarms = snapshot.val();
		  for(let id in alarms) {
			asFcmRequest(alarms[id].reg_id, '['+type+'] '+quiz,answer,'https://bnbd.co.kr/quiz', alarms[id].reg_id+type+quiz+answer)
		  }
	  
		})
		

		userRef.child(dataId).remove();
  }

  return (
    <div>
	  <h1>관리자</h1>
      {datas?.map(data => <div key={data.id}>
        <div className='box'>
          타입: {data.Text.replace("네이버 클릭 적립","네이버]").split("]")[0].replace(" 퀴즈","").replace("신한 쏠야구퀴즈","신한쏠").replace("신한페이판 위드퀴즈","신한플레이").replace("오퀴즈","오케이캐시백")} {data.wtime}
          <br />			  
	      문제: {data.Text.indexOf("(") > 0 ? data.Text.replace("네이버 클릭 적립","네이버]").split("]")[1].split("(")[0].replace(" ","").replace("-","").replace(" 퀴즈","") : data.Text.replace("네이버 클릭 적립","네이버]").split("]")[1].replace(" ","").replace("-","").replace(" 퀴즈","").replace("꿀 무료 적립 >","") }
          <br />
          정답: {data.Title.replace("[퀴즈 등록] 정답: ", "").replace("정답: ", "")}
        </div>
        <hr />
		<div className="messageBtn">
			<button className="write" onClick={() => onClickBestAdd(data.id, data.Text.replace("네이버 클릭 적립","네이버]").split("]")[0].replace(" 퀴즈","").replace("신한 쏠야구퀴즈","신한쏠").replace("신한페이판 위드퀴즈","신한플레이").replace("오퀴즈","오케이캐시백"), data.Text, data.Title.replace("[퀴즈 등록] 정답: ", "").replace("정답: ", ""))}>등록</button>
			<button className="cancel" onClick={() => onClickRemove(data.id)}>삭제</button>
		</div>
      </div>
      )}
    </div>
  );
};

export default Message;