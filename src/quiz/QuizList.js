import React, { useRef, useEffect, useState } from 'react';
import firebase from './../FireBase';
import { Link } from "react-router-dom";
import { AiOutlineClose, AiFillCopy, AiTwotoneLike, AiFillDislike, AiOutlineFileText } from "react-icons/ai";
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';
import moment from 'moment';
import 'moment/locale/ko';	//대한민국
//import _ from 'lodash'

// 배열 중복제거
function multiDimensionalUnique(arr) {

    var uniques = [];
    var itemsFound = {};
	var cnt = 0;
    for(var i = 0, l = arr.length; i < l; i++) {
		cnt++;
        var stringified = JSON.stringify(arr[i]);
        if(itemsFound[stringified]) { continue; }
		
//		arr.push({'cnt':cnt});
//		console.log('cnt : '+cnt);
        uniques.push(arr[i]);
        itemsFound[stringified] = true;
    }
    return uniques;
}

const QuizList = ({ match }) => {
  // 로그인체크
  const ss_email = window.sessionStorage.getItem('ss_email');
  const ss_account = window.localStorage.getItem('ss_account');

  
  const textInput = useRef();

  const nowTime = moment().format('YYYYMMDD');

  const [datas, setDatas] = useState([]);
  const [quizChkDatas, setQuizChkDatas] = useState([]);
  const [type, setType] = useState('');
  const [quiz, setQuiz] = useState('');
  const [answer, setAnswer] = useState('');
  const [email, setEmail] = useState('');
  const [listCnt, setListCnt] = useState(0);
  const userRef = firebase.database().ref('quiz_list');
  const quizChkRef = firebase.database().ref('quiz_list_chk');



  useEffect(() => {
    userRef.orderByChild('wdate').equalTo(nowTime).on('value', snapshot => {
      const users = snapshot.val();
      const usersData = [];
      for(let id in users) {		  
//		  console.log(users[id]);
//		  usersData.push({ ...users[id], id });
		  usersData.push({ 'type':users[id].type, 'quiz':users[id].quiz, 'answer':users[id].answer, 'link':users[id].link, 'wdate':users[id].wdate});
//        usersData.push({ ...users[id], id });
      }
	  // orderBy 정렬순서

//	  usersData.sort(function(a, b) {
//		var aorder = parseInt(a.wtime.toString());
//		var border = parseInt(b.wtime.toString());
//	    return border - aorder;
//	  });

//	console.log(_.uniqBy(testData, "type"));
//	console.log(multiDimensionalUnique(usersData));
//	console.log(groupBy(usersData, 'type, quiz, answer, link'));
//var groupBy = require('json-groupby')
//var group = groupBy(usersData, properties [, collect])
//	console.log(groupBy(usersData, ['type'], ['quiz'], ['answer'], ['link']));
//	console.log(_.groupBy(usersData, 'type', 'quiz', 'answer', 'link'));
      setDatas(multiDimensionalUnique(usersData));		// usersData 를 가공해서 중복제거
    })

	quizChkRef.orderByChild('ss_account').equalTo(ss_account).on('value', snapshot => {
      const quizChk = snapshot.val();
      const quizChkData = [];
      for(let id in quizChk) {
        quizChkData.push(quizChk[id].pid, { ...id});
//        quizChkData.push({ ...quizChk[id].pid, id });
//		console.log('###################');
//		console.log(quizChk[id].pid);
      }
  
      setQuizChkDatas(quizChkData);
    })

	
  }, []);




  const onClickQuizChkAdd = (pid) => {

	const quizChkData = { pid, ss_account };

    quizChkRef.push(quizChkData);

	quizChkRef.orderByChild('ss_account').equalTo(ss_account).on('value', snapshot => {
      const quizChk = snapshot.val();
      const quizChkData = [];
      for(let id in quizChk) {
        quizChkData.push(quizChk[id].pid);
      }
  
      setQuizChkDatas(quizChkData);
    })

  }

  const onClickQuizChkRemove = (id) => {

    quizChkRef.child(id).remove();

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

	if (window.confirm("정말 삭제하시겠습니까?")) {
	  userRef.child(id).remove();   
	  ToastsStore.success(" 삭제되었습니다.");
	}
    
  }

  const onUpdate = (id) => {
//    const [user] = datas.filter(el => el.id === id);

//    userRef.child(id).update({
//      age: user.age++
//    });

  //  setDatas(datas.map(el => el.id === id ? {...el, age: el.age++} : el));
  };

  const [isOpen, setMenu] = useState('copy');  // 메뉴의 초기값을 false로 설정

   const copy = (newText) => {
	
	document.getElementById("cop").value = newText;

    const el = textInput.current
    el.select()
    document.execCommand("copy")
  }

  const handleCopyClipBoard = async (type:string, text: string, link: string, id: string) => {
    try {
//      await navigator.clipboard.writeText(text);
	  await copy(text);
	  ToastsStore.success(text+" 복사성공");

	  
	  // 조회수 +1  group by 하면서 체크 불가
//	  const [data] = datas.filter(el => el.id === id);
//      userRef.child(id).update({
//        readNo: data.readNo+1
//      });

	  setMenu(isOpen => text);
      ss_account != '' && onClickQuizChkAdd(id);

	  link != '' && window.open(link);
		  
    } catch (error) {
	  ToastsStore.success(text+" 복사실패");
      console.log('복사 실패 : '+error);
    }

	function pbcopy(data) {
		var proc = require('child_process').spawn('pbcopy'); 
		proc.stdin.write(data); proc.stdin.end();
	}

setTimeout(() => {
	if(type == "카카오톡"){
		exeDeepLink("com.kakao.talk");
	}else if(type == "오케이캐시백"){
		exeDeepLink("com.skmc.okcashbag.home_google");
	}else if(type == "네이버"){
		exeDeepLink("com.nhn.android.search");
	}else if(type == "캐시워크"){
		exeDeepLink("com.cashwalk.cashwalk");
	}else if(type == "캐시슬라이드"){
		exeDeepLink("com.nbt.moves");
	}else if(type == "옥션"){
		exeDeepLink("com.ebay.kr.auction");
	}else if(type == "우리WON멤버스"){
		exeDeepLink("com.wooribank.smart.wwms");
	}else if(type == "H.POINT"){
		exeDeepLink("kr.co.hpoint.hdgm");
	}else if(type == "신한쏠"){
		exeDeepLink("com.shinhan.sbanking");
	}else if(type == "신한플레이"){
		exeDeepLink("com.shcard.smartpay");
	}else if(type == "타임스프레드"){
		exeDeepLink("com.timespread.Timetable2");
	}else if(type == "캐시닥"){
		exeDeepLink("com.cashdoc.cashdoc");
	}else if(type == "허니스크린"){
		exeDeepLink("com.buzzvil.adhours");
	}else if(type == "토스"){
		exeDeepLink("viva.republica.toss");
	}else if(type == "리브메이트"){
		exeDeepLink("com.kbcard.kat.liivmate");
	}else if(type == "마이홈플러스"){
		exeDeepLink("com.homeplus.myhomeplus");
	}else if(type == "카카오페이지"){
		exeDeepLink("com.kakao.page");
	}else if(type == "올리고"){
		exeDeepLink("com.apro.cereal");
	}else if(type == "카운셀러"){
		exeDeepLink("com.mcnc.parecis.amore.beauticuration");
	}else if(type == "교보문고"){
		exeDeepLink("mok.android");
	}else if(type == "예스24"){
		exeDeepLink("com.yes24.commerce");
	}else if(type == "정관장 케어나우"){
		exeDeepLink("kr.co.kgc.carenow");
	}else if(type == "어댑터"){
		exeDeepLink("com.sinest.todaycoin");
	}else if(type == "패널나우"){
		exeDeepLink("com.d8aspring.panelnow");
	}else if(type == "아이퀴즈"){
		exeDeepLink("com.mrtest.iquiz");
	}else if(type == "아이퀴즈 한자"){
		exeDeepLink("com.mrtest.iquiz_hanja");
	}else{
		exeDeepLink("com.bnbd.cranberry");
	}
}, 2000);
  };


  const groupBy = function (data, key) {
    return data.reduce(function (carry, el) {
        var group = el[key];

        if (carry[group] === undefined) {

            carry[group] = []
        }
			console.log(el);
        carry[group].push(el)
        return carry
    }, {})
  }
  
  function exeDeepLink(packageName) {
    let url = "intent://"+packageName;
    window.location.href = url;
  }

  return (
    <div className='test'>
		{datas?.map((data, i) => <div key={i}>
        <div className='box'>
          <font color='blue'><b>
		{quizChkDatas.includes(data.wdate+i) == true ?   
			<input type='checkbox' id={data.wdate+i} name='chk' checked readOnly />  // defaultChecked
		:
			<input type='checkbox' id={data.wdate+i} name='chk' onChange={() => ss_account != '' && onClickQuizChkAdd(data.wdate+i) } /> 
		}

		  {data.type}</b>
		  </font>
          <br />
			{/*<Link to={`${match.url}/QuizDetial/${data.id}`}>*/}
			<span onClick={() => handleCopyClipBoard(data.type, data.answer, data.link, data.wdate+i)}><font color='red'><b>{data.quiz}</b></font></span>
			{/*</Link>*/}
          <br />
          <span className={isOpen == data.answer ? "copySucc" : ""} onClick={() => handleCopyClipBoard(data.type, data.answer, data.link, data.wdate+i)}> <AiFillCopy/>&nbsp;{data.answer}&nbsp;</span>
		  
		  <div className='shotBtn'> 
			  <Link to={`${match.url}/QuizDetial/${data.type}/${data.quiz}/${data.answer}`}><font color='gray'><AiOutlineFileText/></font></Link> 
		  </div>
        </div>	
        <hr />
		</div>
		)}
		
	  {datas.length == 0 ? (
		<div className='box'>등록된 게시물이 없습니다.</div>
	  ) : (
		null
	  )}
	
		<div>광고</div>
	<Link to={`${match.url}/QuizCRUD`}>
	{ss_account != null ? (
	  <button className='writeRedBtn'>
        글쓰기 (+10P)
      </button>
		) : (
		  <div></div>
	)}
	</Link>
		
	<Link to={`${match.url}/QuizAdd`}>
	{ss_account == 'sosim13p@gmail.com' || ss_account == '50english@naver.com' ? (
	  <button className='writeAdminBtn'>
        붙여넣기
      </button>
		) : (
		  <div></div>
	)}
	</Link>
	<input type="hidden" value="Text Copy" id="cop" ref={textInput} readOnly></input>
	<ToastsContainer className='toast' store={ToastsStore} lightBackground/>
    </div>
  );
};

export default QuizList;