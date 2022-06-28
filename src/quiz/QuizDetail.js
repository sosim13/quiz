import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import firebase from './../FireBase';
import { AiOutlineClose, AiFillCopy, AiTwotoneLike, AiFillDislike, AiTwotoneAlert } from "react-icons/ai";
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';
import moment from 'moment';
import 'moment/locale/ko';	//대한민국

const QuizDetail = ({ match, history }) => {
  // 로그인체크
  const ss_email = window.sessionStorage.getItem('ss_email');
  const ss_account = window.localStorage.getItem('ss_account');

  const [memDatas, setMemDatas] = useState([]);
  const [memFirebaseId, setMemFirebaseId] = useState('');
  const [memNickName, setMemNickName] = useState('');
  const [memPoint, setMemPoint] = useState('');
  const memberRef = firebase.database().ref('member_list');

  useEffect(() => {
    memberRef.orderByChild('email').equalTo(ss_account).once('value', snapshot => {
      const mems = snapshot.val();
      const memData = [];
      for(let id in mems) {
        memData.push({ ...mems[id], id });
		setMemFirebaseId(id);
		setMemNickName(mems[id].nickName);
		setMemPoint(mems[id].point);
      }
  
      setMemDatas(memberRef);
    })
  }, []);

  const nowTime = moment().format('YYYYMMDD');
  
  const [datas, setDatas] = useState([]);
  const [quizTipDatas, setQuizTipDatas] = useState([]);
  const [type, setType] = useState('');
  const [quiz, setQuiz] = useState('');
  const [answer, setAnswer] = useState('');
  const [email, setEmail] = useState('');
  const [tipNo, setTipNo] = useState('');
  const userRef = firebase.database().ref('quiz_list');
  const quizTipRef = firebase.database().ref('quiz_list_tip');

  const [paramAnser, setParamAnser] = useState(match.params.answer.replace('*','').trim());
  
 
  useEffect(() => {
    userRef.orderByChild('wdate').equalTo(nowTime).once('value', snapshot => {
      const users = snapshot.val();
      const usersData = [];
      for(let id in users) {
//		  console.log(users[id]);
        usersData.push({ ...users[id], id });
      }
  
      setDatas(usersData);

    })

	quizTipRef.orderByChild('ss_account').equalTo(ss_account).on('value', snapshot => {
      const quizTip = snapshot.val();
      const quizTipData = [];
      for(let id in quizTip) {
        quizTipData.push(quizTip[id].pid);
    }
//  console.log(quizTipData);
      setQuizTipDatas(quizTipData);
    })
  }, []);

	
  const [isOpen, setMenu] = useState('copy');  // 메뉴의 초기값을 false로 설정

  const handleCopyClipBoard = async (text: string, link: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);    
	  ToastsStore.success(text+" 복사성공");

	  // 조회수 +1  group by 하면서 체크 부가
//	  const [data] = datas.filter(el => el.id === id);
//      userRef.child(id).update({
//        readNo: data.readNo+1
//      });

	  setMenu(isOpen => text);

	  link != '' && window.open(link);
		  
    } catch (error) {
	  ToastsStore.success(text+" 복사실패");
      console.log('복사 실패 : '+error);
    }
  };

  const onClickRemove = (id) => {

	if (window.confirm("정말 삭제하시겠습니까?")) {

		// 글 삭제시 포인트 -10
      memberRef.child(memFirebaseId).update({
        point : memPoint-10
      });

	  userRef.child(id).remove();
	  ToastsStore.success("삭제되었습니다.");
      window.location.replace("/quiz");
	}
    
  }

  // 신고건수가 5건 이상이면 글 노출 안되도록
  const onUpdate = (id) => {
    const [user] = datas.filter(el => el.id === id);

    userRef.child(id).update({
      wdate: '00000000'
    });

    setDatas(datas.map(el => el.id === id ? {...el, age: el.age++} : el));
  };

  const onClickQuizTipAdd = (pid, tipNo) => {

	if (window.confirm("정말 신고하시겠습니까?\n(취소불가)")) {
	
		const quizTipData = { pid, ss_account };

		quizTipRef.push(quizTipData);

	    // 신고건수 +1
	    const [data] = datas.filter(el => el.id === pid);
        userRef.child(pid).update({
          declaration: data.declaration+1
        });
	
		if (tipNo >= 5)
		{
			onUpdate(pid);
			console.log("누적 신고로 인해 글 삭제");
		}

		ToastsStore.success("신고되었습니다.\n(포인트 +1)");

		userRef.orderByChild('wdate').equalTo(nowTime).once('value', snapshot => {
		  const users = snapshot.val();
		  const usersData = [];
		  for(let id in users) {
//			  console.log(users[id]);
			usersData.push({ ...users[id], id });
		  }
	  
		  setDatas(usersData);

		})

		quizTipRef.orderByChild('ss_account').equalTo(ss_account).on('value', snapshot => {
		  const quizTip = snapshot.val();
		  const quizTipData = [];
		  for(let id in quizTip) {
			quizTipData.push(quizTip[id].pid);
		    setTipNo(quizTip[id].tipNo);
		  }
	  
		  setQuizTipDatas(quizTipData);
		})
	}

  }

  const onClickQuizTipDel = (pid) => {

	ToastsStore.success("이미 신고된 상태입니다. (취소불가)");

  }

  return (
   <>
	  <h2>퀴즈 등록 히스토리<br/> <font color="gray">(불법광고, 오타 및 부정확한 정보는 신고해주세요.)</font></h2>
	  {datas?.map(data => <div key={data.id}>
		{data.type.trim() == match.params.type.trim() && data.quiz.trim() == match.params.quiz.trim() && data.answer.trim() == paramAnser ? (
		<div>
			<div className='box'>
			  <font color='blue'><b>
			  {data.type}</b>
			  </font> [{data.nickName}] {data.wtime.substring(8,10)+':'+data.wtime.substring(10,12)}
			  <br />
				{/*<Link to={`${match.url}/QuizDetial/${data.id}`}>*/}
				<font color='red'><b>{data.quiz}</b></font>
				{/*</Link>*/}
			  <br />
			  <span className={isOpen == data.answer ? "copySucc" : ""} onClick={() => handleCopyClipBoard(data.answer, data.link, data.id)}> <AiFillCopy/>&nbsp;{data.answer}&nbsp;</span>
			  
			{/*
			 <div className='shotBtn'> {data.declaration}&nbsp;
				  {quizTipDatas.includes(data.id) ? (
				  <span onClick={() => onClickQuizTipDel(data.id)}>
					<font color='#ce1035'>
					  <AiTwotoneAlert/>
					</font>
				  </span> 
					  ) : (
				  <span onClick={() => onClickQuizTipAdd(data.id, data.declaration)}>
					<font color='#000'>
					  <AiTwotoneAlert/>
					</font>
				  </span> 
					  )}
			  </div>
			*/}	
			
			</div>
				{data.email == ss_account ? (
			  <button className='delBtn' onClick={() => onClickRemove(data.id)}><AiOutlineClose/></button>
			) : (
			  null
			)}	
			<hr />	
		</div>
		) : (
		  null
        )}
      </div>
      )}


      <button className='grayBtn' onClick={() => history.goBack()}>Back</button>
		<ToastsContainer className='toast' store={ToastsStore} lightBackground/>
    </>
  );
};

export default QuizDetail;