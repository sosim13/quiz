import React, { useEffect, useState } from 'react';
import firebase from './../FireBase';
import { Link } from "react-router-dom";
import moment from 'moment';
import 'moment/locale/ko';	//대한민국
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';

const PromotionDetail = ({ match, history }) => {
  // 로그인체크
  const ss_email = window.sessionStorage.getItem('ss_email');
  const ss_account = window.localStorage.getItem('ss_account');

  // 현재 날짜
  const wtime = moment().format('YYYYMMDDHHmmss');
  const wdate = moment().format('YYYYMMDD');
  
  const [datas, setDatas] = useState([]);
  const [answerDatas, setAnswerDatas] = useState([]);
  const [pid, setPid] = useState(match.params.id);
  const [type, setType] = useState('');
  const [title, setTItle] = useState('');
  const [content, setContent] = useState('');
  const [email, setEmail] = useState(ss_account);
  const [readNo, setReadNo] = useState(0);
  const userRef = firebase.database().ref('promotionList');
  const answerRef = firebase.database().ref('promotionAnswerList');
  const [myData, setMyData] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answerUrl, setAnswerUrl] = useState("");

  const [memDatas, setMemDatas] = useState([]);
  const [nickName, setMemNickName] = useState('');
  const [memFirebaseId, setMemFirebaseId] = useState('');
  const [memPoint, setMemPoint] = useState(0);
  const memberRef = firebase.database().ref('member_list');
  
  const [chkDatas, setChkDatas] = useState([]);
  const chkRef = firebase.database().ref('promotionDetailChk');

  useEffect(() => {
    memberRef.orderByChild('email').equalTo(ss_account).once('value', snapshot => {
      const mems = snapshot.val();
      const memsData = [];
      for(let id in mems) {
        memsData.push({ ...mems[id], id });
		setMemFirebaseId(id);
		setMemNickName(mems[id].nickName);
		setMemPoint(mems[id].point);
      }
      setMemDatas(memsData);
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

	chkRef.orderByChild('wdate').equalTo(wdate).on('value', snapshot => {
      const chk = snapshot.val();
      const chkData = [];
      for(let id in chk) {        
		{chk[id].ss_account == ss_account && chkData.push(chk[id].pid) }
      }
//  console.log(chkData);
      setChkDatas(chkData);
    })
  }, []);

	

  const onClickRemove = (id) => {
	if (window.confirm("정말 삭제하시겠습니까?\n삭제시 등록포인트는 환불되지 않습니다.")) {
		
	  ToastsStore.success("삭제되었습니다.");
	  userRef.child(id).remove();	  
      window.location.replace("/promotion/"+match.params.page);
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
    const answerData = { pid, answer, answerUrl, email, nickName, wtime };

    answerRef.push(answerData);


    ToastsStore.success("댓글을 등록했습니다.");
//	window.location.replace("/promotion");
    setAnswer('');
    setAnswerUrl('');
//    setTitle('');
//    setContent('');
//    setEmail('');

  }

  const onClickAnswerRemove = (id) => {
	if (window.confirm("정말 삭제하시겠습니까?")) {
		
	  ToastsStore.success("댓글이 삭제되었습니다.");
	  answerRef.child(id).remove();	  
//      window.location.replace("/promotion");
	}    
  }

 const openLink = (link) => {
        document.location.href = link;
    }

	const onCheckData = () => {
		alert('1');
		return false;
	}

	// 글 읽으면 중복 포인트 지급 안되도록..
  const onClickChkAdd = (pid) => {

	const chkData = { pid, ss_account, wdate, wtime };

    chkRef.push(chkData);

  }

  const onUpdate = (email, id, readNo, point, link) => {
	if(nickName == ''){
		alert("회원만 이용 가능합니다.");
		return false;
	}

	if (email != ss_account)
	{	
		if(!chkDatas.includes(id)){	
			ToastsStore.success("포인트 적립 +10P");
			// 링크 클릭시 +10
			memberRef.child(memFirebaseId).update({
			  point : memPoint+10
			});

			// 중복체크
			onClickChkAdd(id);

			// 프로모션 조회시 게시글 포인트 -1
			userRef.child(id).update({
			  point : point-10
			});
		}
//		setTotalCnt(totalCnt);
    }
  };

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
			setAnswerUrl(data.url.replace('http://','https://'))
		})
		.catch(err => console.log(err))
	}


  return (
   <>
	  {datas?.map(data => <div key={data.id}>
	        
			
	    <div>
			<span className='read_title'>[{data.type}] {data.title} ({data.readNo})</span>
			<span className='writer'>{data.nickName}</span>
<br/>
<br/>
			<span className='date'>{data.utime.substring(0,4)+'-'+data.utime.substring(4,6)+'-'+data.utime.substring(6,8)+' '+data.utime.substring(8,10)+':'+data.utime.substring(10,12)}</span>
<br/>
			<p className='read_content'>
				<img src={data.url} width="100%"/>
				<br/>
				<br/><pre>{data.content}</pre></p>
		
	      { data.type == '링크형' ?
		  <p><a href={data.link} target="_blank" onClick={() => onUpdate(data.email, data.id, data.readNo, data.point, data.link)}><button className='linkBtn'>링크 바로가기
			{!chkDatas.includes(data.id) && data.email != ss_account ?  ' (+10p)'  : ' (적립완료)' }&nbsp;	
			</button></a></p>
           :				
		  <p>{data.link != '' && <a href={data.link} target="_blank"><button className='linkBtn'>링크 바로가기			
			</button></a>}</p>
		  }
		{ data.type == '참여형' ?
		  <p><Link to={`/promotion/PromotionCheck/${data.id}/${match.params.page}`}><button className='link2Btn'>참여 인증하기</button></Link></p>
           :				
		  null
		  }<br/>
        </div>
	  <hr/>
      <button className='grayBtn' onClick={() => window.location.replace("/promotion/"+match.params.page)}>목록</button>
	{myData == 1 && <>
	  <Link to={`/promotion/PromotionEdit/${pid}/${match.params.page}`}>
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
						<span className="comment_name">{answer.nickName}</span>
						<span className="comment_date">{answer.wtime == wtime ? answer.wtime.substring(8,10)+':'+answer.wtime.substring(10,12) : answer.wtime.substring(4,6)+'-'+answer.wtime.substring(6,8)}</span>
					</div><br/>			
					<span className="comment_img">
						<img src={answer.answerUrl} width="100%" />
					</span>
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
		  {/*<br/><label htmlFor="input-file"><img src={answerUrl != '' ? answerUrl : "https://res.cloudinary.com/dv8img/image/upload/c_scale,w_100/v1636694953/web/choosefile_isp9qk.png"} width="100"/></label>
				  <input type="file" onChange= {(e)=> uploadImage(e.target.files[0])} id="input-file" />*/}	
			</div>
		</div>
		</div>




      </div>
		  
      )}
		<ToastsContainer className='toast' store={ToastsStore} lightBackground/>
    </>
  );
};

export default PromotionDetail;