import React, { useEffect, useState } from 'react';
import firebase from './../FireBase';
import moment from 'moment';
import 'moment/locale/ko';	//대한민국
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';

const QuizCRUD = ({ match, history }) => {

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
  const [readNo, setReadNo] = useState(0);
  const [tipNo, setTipNo] = useState(0);
  const [declaration, setDeclaration] = useState(0);
  const [nickName, setNickName] = useState('');
  const [wdate, setWdate] = useState('');
  const [wtime, setWtime] = useState('');
  const userRef = firebase.database().ref('quiz_list');
  const [beforeDatas, setBeforeDatas] = useState([]);
  const [dataCheck, setDataCheck] = useState('');
 
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



  // 현재 날짜
  const nowTime = moment().format('YYYYMMDDHHmmss');
  const nowDate = moment().format('YYYYMMDD');

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

	userRef.orderByChild('wdate').equalTo(nowDate).on('value', snapshot => {
      const befores = snapshot.val();
	  const beforesData = [];
      for(let id in befores) {		  
	    {befores[id].email == ss_account && beforesData.push(befores[id].type.trim()+befores[id].quiz.trim()+befores[id].answer.trim()) }
      }
	  
	  setDataCheck(beforesData);
    })
  }, []);
	

  const onChange = (e) => {
    e.target.name === 'type' ? setType(e.target.value) : setEmail(ss_account);
    e.target.name === 'quiz' ? setQuiz(e.target.value) : setWtime(nowTime);
    e.target.name === 'answer' ? setAnswer(e.target.value) : setWdate(nowDate);
    e.target.name === 'link' ? setLink(e.target.value) : setEmail(ss_account);
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

    const userData = { type, quiz, answer, email, wtime, readNo, wdate, link, nickName, tipNo };

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

	ToastsStore.success("등록되었습니다.\n등록된 글은 심사후에 노출됩니다.");
	setTimeout(function(){
		window.location.replace("/quiz");
	}, 3000);
  }




  function onClickBestCheck(){  

    var dataCheckValue = dataCheck.includes(type+quiz+answer);

    if(dataCheckValue){
	  alert('동일한 내용을 중복으로 등록할 수 없습니다.\n심사중인 경우 쓰셨던 글이 목록에 보이지 않을 수 있습니다.\n심사 후 노출되오니 잠시만 기다려주세요.');
	  return false;
	}

	let cnt = '';
	let realno = 0;
	var isDisabled = false;

	bestRef.orderByChild('wdate').equalTo(nowDate).on('value', snapshot => {
      const bests = snapshot.val();
	  const bestsData = [];

      for(let id in bests) {		
		  if(bests[id].type.trim() == type.trim() && bests[id].quiz.trim() == quiz.trim() && bests[id].answer.trim() == answer.trim()){
			  bestsData.push({ ...bests[id], id });
			  cnt = id;
			  realno = bests[id].tipNo;
			  console.log("id : "+id+"bests[id].type : "+bests[id].type+"type : "+type);
//			  alert("id : "+bests[id].email+"/ ss_account : "+ss_account);
		  }
      }

		if (isDisabled) {  //<-( 1 ) 수행가능여부 검사
//		  console.log("처리중");
		  return false;
		} else {
//		  console.log("처리중2");
		  isDisabled = true; //<-( 2 ) 실행 불가능하도록 flag 변경
		  onClickAdd(cnt, realno);
		  isDisabled = false;    //(3)수행가능하도록 열어준다. settimeout을통해 X초 뒤에 풀어주는것도 방법이다.
		}
    })
    
  }

  function onClickBestAdd(){  
    const bestData = { type, quiz, answer, email, wtime, readNo, wdate, link, nickName, tipNo, declaration };
	bestRef.push(bestData)    
  }


  const onUpdate = (id, realno) => {

	bestRef.child(id).update({
	  tipNo: realno+1
	});

	if(realno >= 3){
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
			if(reg_id != alarms[id].reg_id){
				asFcmRequest(alarms[id].reg_id, '['+type+'] '+quiz,answer,'https://bnbd.co.kr/quiz', alarms[id].reg_id+type+quiz+answer)
			}
		  }
	  
		})
	
	}

  };


  

  return (
   <div className="box">
      <div className="form">
	    <select name='type' onChange={onChange}>
	  	  <option value=''>어플선택</option>
	  	  <option value='네이버'>네이버</option>
	  	  <option value='오케이캐시백'>오케이캐시백</option>
	  	  <option value='캐시워크'>캐시워크</option>			  
	  	  <option value='캐시슬라이드'>캐시슬라이드</option>			  
	  	  <option value='타임스프레드'>타임스프레드</option>	
	  	  <option value='토스'>토스</option>  
	  	  <option value='리브메이트'>리브메이트</option>
	  	  <option value='우리WON멤버스'>우리WON멤버스</option>
	  	  <option value='신한쏠'>신한쏠</option>
	  	  <option value='신한플레이'>신한플레이</option>
	  	  <option value='옥션'>옥션</option>
	  	  <option value='H.POINT'>H.POINT</option>
	  	  <option value='허니스크린'>허니스크린</option>
	  	  <option value='마이홈플러스'>마이홈플러스</option>
	  	  <option value='카카오페이지'>카카오페이지</option>
	  	  <option value='올리고'>올리고</option>
	  	  <option value='카운셀러'>카운셀러</option>
	  	  <option value='교보문고'>교보문고</option>
	  	  <option value='예스24'>예스24</option>	  
	  	  <option value='정관장 케어나우'>정관장 케어나우</option>
	  	  <option value='패널나우'>패널나우</option>
	  	  <option value='기타'>기타</option>
	    </select>

        <input onChange={onChange} name='quiz' placeholder='이벤트명' value={quiz} maxLength='24'></input>
        <input onChange={onChange} name='answer' placeholder='정답' value={answer} maxLength='24'></input>
	{type == '네이버' || type == '기타' ?
        <input onChange={onChange} name='link' placeholder='링크' value={link} maxLength='2000'></input>
	  : null }
		<div className="buttons">
			<button className="write" onClick={onClickBestCheck}>글쓰기</button>
			<button className="cancel" onClick={() => history.goBack()}>취소</button>
		</div>
	    <div><br/>
	      이벤트명은 문제를 적는 칸이 아니고 어떤 퀴즈인지 알 수 있도록 주체사명을 적어주세요.<br/>
	      ex) 서울시청이 주관하는 퀴즈<br/>
	      문제 : 서울시청에서 주관하는 행사명은 무엇일까요?<br/> (흰트 : ㅌㅅㅌ)<br/>
	      정답 : 테스트<br/><br/>

	      (작성요령)<br/>
		  이벤트명 : 서울시청<br/>
		  정답 : 테스트<br/><br/>
		  <font color="red">(불법 광고나 허위 게시글은 아이디 영구차단)</font>
	    </div>
      </div>
		<ToastsContainer className='toast' store={ToastsStore} lightBackground/>
    </div>
  );
};

export default QuizCRUD;