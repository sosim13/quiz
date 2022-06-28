import React, { Component, useEffect, useState, Linking, useCallback } from 'react';
import { Link } from "react-router-dom";
import firebase from './FireBase';
//import { AiOutlineClose, AiFillCopy, AiTwotoneLike, AiFillDislike, AiOutlineFileText } from "react-icons/ai";
import { AiFillBulb, AiOutlineCarryOut, AiOutlineQuestionCircle, AiOutlineExclamation, AiFillAndroid, AiOutlineDollar } from "react-icons/ai";
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';
import moment from 'moment';
import 'moment/locale/ko';	//대한민국
import { IconContext } from "react-icons";


const Home = ({ match }) => {

  // 로그인체크
  const ss_email = window.sessionStorage.getItem('ss_email');
  const ss_account = window.localStorage.getItem('ss_account');
  const authenticated = ss_account != null && ss_account != '';
  const [memDatas, setMemDatas] = useState([]);
 
  const loginRef = firebase.database().ref('member_list');
  const [memFirebaseId, setMemFirebaseId] = useState('');
  const [memNickName, setMemNickName] = useState('');
  const [memPoint, setMemPoint] = useState(0);
  const [memAddr, setMemAddr] = useState(0);

  useEffect(() => {
	if(match.params.id != null){
      window.sessionStorage.setItem('ss_reg_id', match.params.id);
      window.sessionStorage.setItem('ss_reg_type', match.params.type);
	}


    loginRef.orderByChild('email').equalTo(ss_account).once('value', snapshot => {
      const users = snapshot.val();
      const usersData = [];
      for(let id in users) {
        usersData.push({ ...users[id], id });
		setMemFirebaseId(id);
		setMemNickName(users[id].nickName);
		setMemPoint(users[id].point);
		setMemAddr(users[id].addr)
      }
  
      setMemDatas(usersData);
    })
  }, []);

  const [datas, setDatas] = useState([]);
  const [email, setEmail] = useState(ss_account);
  const userRef = firebase.database().ref('attendance');
  const wdate = moment().format('YYYYMMDD');
  const wtime = moment().format('YYYYMMDDHHmmss');

  useEffect(() => {
    userRef.orderByChild('wdate').equalTo(wdate).once('value', snapshot => {
      const users = snapshot.val();
      const usersData = [];
      for(let id in users) {
		  {users[id].email == ss_account && usersData.push({ ...users[id], id })};
      }
      setDatas(usersData);
    })
  }, []);

  const onClickAdd = () => {

	if (!authenticated)
	{
		alert('출석체크를 하시려면 로그인 해주세요.');
		return false;
	}
	if (memNickName == '')
	{
		alert('마이페이지에서 닉네임을 설정해주세요.');
		return false;
	}
    const userData = { email, wdate, wtime };

    userRef.push(userData);   
	ToastsStore.success("출석체크완료");

	// 글 등록시 포인트 10
	loginRef.child(memFirebaseId).update({
      point : memPoint+10
    });

	userRef.orderByChild('wdate').equalTo(wdate).once('value', snapshot => {
      const users = snapshot.val();
      const usersData = [];
      for(let id in users) {
		  {users[id].email == ss_account && usersData.push({ ...users[id], id })};
      }
      setDatas(usersData);
    })
  }

  const redireactApp = () => {
    exeDeepLink();
    checkInstallApp();
  };

  function checkInstallApp() {
    function clearTimers() {
      clearInterval(check);
      clearTimeout(timer);
    }

    function isHideWeb() {
      if (document.webkitHidden || document.hidden) {
        clearTimers();
      }
    }
    const check = setInterval(isHideWeb, 200);

    const timer = setTimeout(function() {
      redirectStore();
    }, 500);
  }

  const redirectStore = () => {
    const ua = navigator.userAgent.toLowerCase();

    if (window.confirm("스토어로 이동하시겠습니까?")) {
      window.location.href =
        ua.indexOf("android") > -1
          ? "https://play.google.com/store/apps/details?id=com.skmc.okcashbag.home_google"
          : "https://apps.apple.com/kr/app/com.skmc.okcashbag.home_google";
    }
  };

  function exeDeepLink() {
    let url = "intent://com.skmc.okcashbag.home_google";
    window.location.href = url;
  }


    return (
		<div>
		<section>
			<h1>HOME</h1>

		{datas.length == 0 ? (
			<div className="banner" onClick={() => onClickAdd()}>
				<IconContext.Provider value={{ className: 'react-icons' }}><AiOutlineCarryOut  size="20"/></IconContext.Provider> 출석체크 (+10P)
			</div>
		) : (
			<div className="banner">
				<IconContext.Provider value={{ className: 'react-icons' }}><AiOutlineCarryOut  size="20"/></IconContext.Provider> {wdate.substring(4, 6)+'월 '+wdate.substring(6,8)+'일'} 출석체크 완료
			</div>
		)}
			<div className="banner">
				<Link to="/notice/1"><IconContext.Provider value={{ className: 'react-icons' }}><AiOutlineExclamation size="20"/></IconContext.Provider> 공지사항</Link>
			</div>
			<div className="banner">
				<Link to="/quiz"><IconContext.Provider value={{ className: 'react-icons' }}><AiFillBulb size="20"/></IconContext.Provider> 퀴즈정답확인하기</Link>
			</div>
		
		{ss_account == 'sosim13p@gmail.com' ? (
			<>
			  <div className="banner">
				<Link to="/message"><IconContext.Provider value={{ className: 'react-icons' }}><AiFillAndroid size="20"/></IconContext.Provider> 관리자</Link>
			  </div>
			  <div className="banner">
				<Link to="/accountbook"><IconContext.Provider value={{ className: 'react-icons' }}><AiOutlineDollar size="20"/></IconContext.Provider> 가계부</Link>
			  </div>
			  <div className="banner">
				<Link to="/denkenbook"><IconContext.Provider value={{ className: 'react-icons' }}><AiOutlineDollar size="20"/></IconContext.Provider> 덴켄</Link>
			  </div>
			</>
			) : (
			  null
			)}
			<div className="banner">
				<Link to="/manual"><IconContext.Provider value={{ className: 'react-icons' }}><AiOutlineQuestionCircle size="20"/></IconContext.Provider> 사용방법</Link>
			</div>
		
		{ss_account == 'sosim13p@gmail.com' ? (
			<>
			  <div className="banner">
				<Link to="/push"><IconContext.Provider value={{ className: 'react-icons' }}><AiOutlineQuestionCircle size="20"/></IconContext.Provider> 푸시테스트</Link>
			</div>

			<div className="banner"  onClick={() => redireactApp()}>링크실행</div>
			<div className="banner">
				<Link to="/t4">지도</Link>
			</div>
			</>
			) : (
			  null
			)}
		{/*
			<div className="banner">
				<Link to="/push/febrLGsIRYg:APA91bGxhmWsktG__eHvGfS2lw5CmNNkZaraChF6ZDETxOBP7-PwjSpQAw7gCspe-2faTklChgdbFJon6yuQejCR2Cb3rtAvlMmjr6Lk2v3J8K5Fqat9xLuREOPaFl1xNOYih-hPSmKA/제목/내용/*"><IconContext.Provider value={{ className: 'react-icons' }}><AiOutlineQuestionCircle size="20"/></IconContext.Provider> 푸시테스트</Link>
			</div>

			<div className="banner"  onClick={() => redireactApp()}>링크실행</div>
			<div className="banner">
				<Link to="/t4">지도</Link>
			</div>
		    <div className="coopang">
			<a href="https://coupa.ng/caInfB" target="_blank" referrerpolicy="unsafe-url">
				<img src="https://ads-partners.coupang.com/banners/77171?subId=&traceId=V0-301-969b06e95b87326d-I77171&w=320&h=100" alt="" />
			</a>
			</div>*/}
		</section>
		<ToastsContainer className='toast' store={ToastsStore} lightBackground/>
		</div>
    );
};
 
export default Home;