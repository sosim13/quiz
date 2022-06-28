import React, { useEffect, useState } from 'react';
import firebase from './FireBase';
import moment from 'moment';
import 'moment/locale/ko';	//대한민국
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';
// push request
import request from 'request';
import axios from "axios";

const Push = ({ match, history }) => {

  // 로그인체크
  const ss_email = window.sessionStorage.getItem('ss_email');
  const ss_account = window.localStorage.getItem('ss_account');

  const [datas, setDatas] = useState([]);
  const [type, setType] = useState('');
  const [quiz, setQuiz] = useState('');
  const [answer, setAnswer] = useState('');
  const [email, setEmail] = useState('');
  const [link, setLink] = useState('');
  const [url, setUrl] = useState('');
  const [test1, setTest1] = useState('');
  const [test2, setTest2] = useState('');
  const [readNo, setReadNo] = useState(0);
  const [tipNo, setTipNo] = useState(5);
  const [declaration, setDeclaration] = useState(0);
  const [nickName, setNickName] = useState('');
  const [wdate, setWdate] = useState('');
  const [wtime, setWtime] = useState('');
  const userRef = firebase.database().ref('quiz_list');
 
  const loginRef = firebase.database().ref('member_list');
  const [memFirebaseId, setMemFirebaseId] = useState('');
  const [memPoint, setMemPoint] = useState(0);
  const [reg_id, setReg_id] = useState(0);
  
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
//        chkCnt = chkCnt+1;		
      }

	  if(chkCnt == 0){

		const pushData = { chkMessage, pushId, subject, msg, link, nowTime };
		pushRef.push(pushData);

		const options = {
		  'to': pushId,
		  'notification': {
			'title': subject,
			'body': msg,
			'click_action': '/push', //이 부분에 원하는 url을 넣습니다.
			'link': '/link', //이 부분에 원하는 url을 넣습니다.
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
    loginRef.orderByChild('email').equalTo(ss_account).once('value', snapshot => {
      const users = snapshot.val();
      const usersData = [];
      for(let id in users) {
        usersData.push({ ...users[id], id });
		setMemFirebaseId(id);
		setNickName(users[id].nickName);
		setMemPoint(users[id].point);
		setReg_id(users[id].reg_id);
      }
  
      setDatas(usersData);

    })
  }, []);

//  console.log(nowTime);

  const onChange = (e) => {
    e.target.name === 'type' ? setType(e.target.value) : setEmail(ss_account);
    e.target.name === 'quiz' ? setQuiz(e.target.value) : setWtime(nowTime);
    e.target.name === 'answer' ? setAnswer(e.target.value) : setWdate(nowDate);
    e.target.name === 'link' ? setLink(e.target.value) : setEmail(ss_account);
    e.target.name === 'test1' ? setTest1(e.target.value) : setEmail(ss_account);
    e.target.name === 'test2' ? setTest2(e.target.value) : setEmail(ss_account);
    
  }

  const onClickAdd = (state, realno) => {
			  
	if (type == '')
	{
		alert('어플을 선택해주세요.');
		return false;
	}
	if (quiz == '')
	{
		alert('이벤트명을 입력해주세요.');
		return false;
	}
	if (quiz == '')
	{
		alert('내용을 입력해주세요.');
		return false;
	}

    const userData = { type, quiz, answer, email, wtime, readNo, wdate, link, nickName, declaration };

    userRef.push(userData);

	// 글 등록시 포인트 10
	loginRef.child(memFirebaseId).update({
      point : memPoint+10
    });

	if(state == ''){
	    onClickBestAdd();
	}else{
		onUpdate(state, realno);
	}

	ToastsStore.success("등록완료");
	setTimeout(function(){
		window.location.replace("/quiz");
	}, 2000);
//  수정하고 목록으로 이동
//	window.location.replace("/quiz");
  }

  function onClickBestCheck(){  

	alarmRef.orderByChild('test').equalTo('ON').once('value', snapshot => {
	  const alarms = snapshot.val();
	  for(let id in alarms) {
		try {
			asFcmRequest(alarms[id].reg_id, '[테스트] 테스트입니다.','내용이 잘 보이시나요?','https://bnbd.co.kr/quiz', '1234567890')
		} catch (error) {
		  alert(error);
		}

	  }
	})
	ToastsStore.success("푸시완료");
  }

  function onClickBestAdd(){  

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
//			if(reg_id != alarms[id].reg_id){
				asFcmRequest(alarms[id].reg_id, '['+type+'] '+quiz,answer,'https://bnbd.co.kr/quiz', alarms[id].reg_id+type+quiz+answer)
//			}
		  }
	  
		})
  }


  const onUpdate = (id, realno) => {

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

  };

  const onChangeValue = () => {
	var changeValue = test1.replace('퀴즈 정답 공유 - ','').replace('퀴즈 정답 알리미 : https://play.google.com/store/apps/details?id=com.ajasmile.happyquiz','').replace(' 퀴즈','');
	var change2 = changeValue.indexOf(']');
	var change3 = changeValue.indexOf('http');
	var change4 = changeValue.indexOf(' 정답');
	var change5 = changeValue.substring(change2+2);
	var change6 = changeValue.substring(change2+2).indexOf('http');
	var change7 = changeValue.substring(change4+5);
	var change8 = changeValue.substring(0,change2).trim();
	var change9 = change5.substring(0,change6);
	var change10 = change5.substring(0,change6).indexOf('(');
	var change11 = change5.substring(0,change6);
	if(change10 > 0){
		change11 = change9.substring(0,change10);
	}


	
	console.log('1 : '+changeValue);
//	console.log('2 : '+change8);
	console.log('3타입 : '+change8);
//	console.log('4타입 : '+change10);
//	console.log(change9);
//    console.log('4 : '+changeValue.indexOf(' 정답'));
//	console.log('5링크 : '+changeValue.substring(change3,change4).trim());
	console.log('6이벤트명 : '+change5.substring(0,change6));
//	console.log('7 : '+change4);
//	console.log('8정답 : '+changeValue.substring(change4+6));
	setType(change8.replace(' 행운퀴즈','').replace('오퀴즈','오케이캐시백').replace('네이버페이','네이버').replace('신한 쏠야구퀴즈','신한쏠').replace('신한페이판 더겜성퀴즈','신한플레이').replace('신한페이판','신한플레이').replace('Hpoint','H.POINT').replace('홈플퀴즈','마이홈플러스').replace('예스24 출첵퀴즈','예스24').replace('정관장 케어나우 OX퀴즈','정관장 케어나우').trim());
	if(type != '신한페이판 더겜성퀴즈'){
		setQuiz(change11.replace('꿀 무료 적립 >풀고 무료꿀머니 적립  ','퀴즈풀고 무료꿀머니적립').trim());
	}else{
		setQuiz('더겜성퀴즈');
	}
	setAnswer(changeValue.substring(change4+6).trim());
	if(type == '네이버' || type == '기타'){
		setLink(changeValue.substring(change3,change4).trim());
	}else{
		setLink('');
	}
  }
  

  return (
   <div className="box"><br/><br/><br/><br/><br/><br/><br/><br/><br/>
	{ss_account == 'sosim13p@gmail.com' || ss_account == '50english@naver.com' ? (
      <div className="form">
	    	<div className="buttons">
			<button className="write" onClick={onClickBestCheck}>푸쉬</button>
			<button className="cancel" onClick={() => history.goBack()}>목록</button>	  
		</div>
      </div>
	) : (
		<div>잘못된 경로입니다.</div>
	)}
		<ToastsContainer className='toast' store={ToastsStore} lightBackground/>
    </div>
  );
};

export default Push;