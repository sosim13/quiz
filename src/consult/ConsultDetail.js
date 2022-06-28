import React, { useEffect, useState } from 'react';
import firebase from './../FireBase';
import { Link } from "react-router-dom";
import moment from 'moment';
import 'moment/locale/ko';	//대한민국
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';

const ConsultDetail = ({ match, history }) => {
  // 로그인체크
  const ss_email = window.sessionStorage.getItem('ss_email');
  const ss_account = window.localStorage.getItem('ss_account');

  // 현재 날짜
  const wtime = moment().format('YYYYMMDDHHmmss');
  
  const [datas, setDatas] = useState([]);
  const [memDatas, setMemDatas] = useState([]);
  const [answerDatas, setAnswerDatas] = useState([]);
  const [pid, setPid] = useState(match.params.id);
  const [type, setType] = useState('');
  const [title, setTItle] = useState('');
  const [content, setContent] = useState('');
  const [email, setEmail] = useState(ss_account);
  const [nickName, setNickName] = useState('');
  const [readNo, setReadNo] = useState(0);
  const userRef = firebase.database().ref('consultList');
  const answerRef = firebase.database().ref('consultAnswerList');
  const [myData, setMyData] = useState(0);
  const [answer, setAnswer] = useState('');
  const loginRef = firebase.database().ref('member_list');

  useEffect(() => {
    loginRef.orderByChild('email').equalTo(ss_account).once('value', snapshot => {
      const users = snapshot.val();
      const usersData = [];
      for(let id in users) {
        usersData.push({ ...users[id], id });
		setNickName(users[id].nickName)
      }
//  console.log(usersData);
      setMemDatas(usersData);
    })
  }, []);

  
 
  useEffect(() => {
    userRef.orderByKey().equalTo(pid).on('value', snapshot => {
      const users = snapshot.val();

      const usersData = [];
	  let count = 0;
      for(let id in users) {
		count++;
        usersData.push({ ...users[id], id });
		{users[id].email == ss_account && setMyData(1) }
      }

      setDatas(usersData);
    })

	answerRef.orderByChild('pid').equalTo(pid).on('value', snapshot => {
      const answers = snapshot.val();

      const answersData = [];
	  let count = 0;
      for(let id in answers) {
		count++;
        answersData.push({ ...answers[id], id });
      }

      setAnswerDatas(answersData);
    })
  }, []);

	

  const onClickRemove = (id) => {
	if (window.confirm("정말 삭제하시겠습니까?")) {
		
	  ToastsStore.success("삭제되었습니다.");
	  userRef.child(id).remove();	  
      window.location.replace("/consult/"+match.params.page);
	}    
  }

  const onChange = (e) => {
    setAnswer(e.target.value);
  }

  const onClickAdd = () => {

	if (nickName == '')
	{
		alert('마이페이지에서 닉네임을 먼저 설정해주세요.');
		return false;
	}
	if (answer == '')
	{
		alert('댓글을 입력해주세요.');
		return false;
	}
    const answerData = { pid, answer, email, nickName, wtime };

    answerRef.push(answerData);


    ToastsStore.success("댓글을 등록했습니다.");
//	window.location.replace("/consult");
    setAnswer('');
//    setTitle('');
//    setContent('');
//    setEmail('');

  }

  const onClickAnswerRemove = (id) => {
	if (window.confirm("정말 삭제하시겠습니까?")) {
		
	  ToastsStore.success("댓글이 삭제되었습니다.");
	  answerRef.child(id).remove();	  
//      window.location.replace("/consult");
	}    
  }


  return (
   <>
	  {datas?.map(data => <div key={data.id}>
	  
        
			
	    <div>
			<span className='board_title'>{data.title} [{data.readNo}]</span>
			<span className='writer'>{data.nickName}</span>
<br/>
<br/>
			<span className='date'>{data.utime.substring(0,4)+'-'+data.utime.substring(4,6)+'-'+data.utime.substring(6,8)+' '+data.utime.substring(8,10)+':'+data.utime.substring(10,12)}</span>
			<p className='content'>
		<img src={data.url} width="100%"/>
			<pre>{data.content}</pre>
        </p>
			<br/>
        </div>
	  <hr/>
      <button className='grayBtn' onClick={() => window.location.replace("/consult/"+match.params.page)}>목록</button>
	{myData == 1 && <>
	  <Link to={`/consult/ConsultEdit/${pid}/${match.params.page}`}>
		<button className='grayBtn'> 수정</button>
	  </Link>
	  <button className='grayBtn' onClick={() => onClickRemove(pid)}>삭제</button>
     </>}
		
	
		<div className="answer_layout">
		<div className="answer_board">
			<p className="comments_title">댓글</p>
			{answerDatas?.map(answer => <div key={answer.id}>
			<ul className="contents">
				<li className="comment_box">
					<div className="information">
						<span className="comment_img">
						</span>
						<span className="comment_name">{answer.nickName}</span>
						<span className="comment_date">{answer.wtime == wtime ? answer.wtime.substring(8,10)+':'+answer.wtime.substring(10,12) : answer.wtime.substring(4,6)+'-'+answer.wtime.substring(6,8)}</span>
					</div>
					<p className="comment_content">{answer.answer}</p>
					<div className="comment_btnBox">
				{/*<button className="edit">수정</button>*/}
				{answer.email == ss_account ? (
						<button className="edit" onClick={() => onClickAnswerRemove(answer.id)}>X</button>
					) : null }
					</div>
				</li>
			</ul>
			</div>
			)}
			<div className="comments_inputBox">
				<input name="answer" className="comments_input" type="text" placeholder="댓글을 입력하세요." value={answer} onChange={onChange} />
				<button className="comments_button" onClick={onClickAdd}>등록</button>
			</div>
		</div>
		</div>




      </div>
		  
      )}
		<ToastsContainer className='toast' store={ToastsStore} lightBackground/>
    </>
  );
};

export default ConsultDetail;