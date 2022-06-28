import React, { useEffect, useState } from 'react';
import firebase from './../FireBase';
import moment from 'moment';
import 'moment/locale/ko';	//대한민국
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';
import { AiOutlineQuestionCircle } from "react-icons/ai";

const PromotionCRUD = ({ match, history }) => {
  // 로그인체크
  const ss_email = window.sessionStorage.getItem('ss_email');
  const ss_account = window.localStorage.getItem('ss_account');
  
  // 현재 날짜
  const nowTime = moment().format('YYYYMMDDHHmmss');
//  console.log(nowTime);

  const [datas, setDatas] = useState([]);
  const [type, setType] = useState('');
  const [point, setPoint] = useState(0);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
//  const [nickName, setNickName] = useState('');
  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');
  const [wtime, setWtime] = useState('');
  const [utime, setUtime] = useState('');
  const [url, setUrl] = useState("");
  const [readNo, setReadNo] = useState(0);
  const userRef = firebase.database().ref('promotionList');

  const [memDatas, setMemDatas] = useState([]);
  const [memFirebaseId, setMemFirebaseId] = useState('');
  const [nickName, setMemNickName] = useState('');
  const [memPoint, setMemPoint] = useState(0);
  const memberRef = firebase.database().ref('member_list');

  const [isOpen, setMenu] = useState(false);  // 메뉴의 초기값을 false로 설정
  const toggleMenu = () => {
	setMenu(isOpen => !isOpen); // on,off 개념 boolean
  }

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

  const onChange = (e) => {
    e.target.name === 'type' ? setType(e.target.value) : setEmail(ss_account);
    e.target.name === 'title' ? setTitle(e.target.value) : setWtime(nowTime);
    e.target.name === 'link' ? setLink(e.target.value) : setWtime(nowTime);
    e.target.name === 'content' ? setContent(e.target.value) : setUtime(nowTime);
    e.target.name === 'point' ? setPoint(e.target.value) : setEmail(ss_account);
  }

  const onClickAdd = () => {

	if (nickName == '')
	{
		alert('마이페이지에서 닉네임을 먼저 설정해주세요.');
		return false;
	}
	
	if (point == '')
	{
		alert('사용하실 포인트를 입력해주세요.');
		return false;
	}
	if(type == '참여형'){
	if (point < 1000)
	{
		alert('참여형은 1000포인트 이상만 등록 가능합니다.');
		return false;
	}
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
    const userData = { type, title, nickName, link, content, point, email, wtime, utime, url, readNo };

    userRef.push(userData);

	// 프로모션 등록시 포인트 차감
    memberRef.child(memFirebaseId).update({
      point : memPoint-point
    });

    ToastsStore.success("등록했습니다.");
	setTimeout(function(){
		window.location.replace("/promotion/1");
	}, 2000);	
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
		  <span>구분</span>
		  <select name='type' onChange={onChange}>
	  	    <option value='조회형'>조회형</option>
	  	    <option value='참여형'>참여형</option>
	  	    <option value='링크형'>링크형</option>
	      </select>
		  &nbsp;&nbsp;&nbsp;<AiOutlineQuestionCircle size="20"  onClick={()=>toggleMenu()}/>
		</div>
        <div className='row'>			
		  <span>포인트</span>
		  <input
			name={'point'}
			className='nametap'
			type="text"
			placeholder="사용할포인트"
			maxLength="10"
			value={point}
			onChange={onChange}
		  />
		</div>
		<div className='row'>			
		  <span></span>
		  {nickName}님의 사용가능한 포인트 :&nbsp;<font color="blue">{memPoint}</font>&nbsp;
		  <div id="light" className={isOpen ? "white_content" : "hide_content"}>
			<b>* 프로모션 구분</b><br/>
			1. 조회형<br/>
			조회형은 게시글을 클릭할때마다 1포인트씩 차감되며 해당 <br/>
			게시글을 홍보할 수 있습니다.<br/>
			EX) 마스크를 잘 쓰고 다닙시다.<br/>
			<br/>
			2. 참여형<br/>
			참여형은 게시자의 미션을 수행하고 이미지로 인증하면<br/>
			100포인트씩 차감 됩니다.<br/>
			참여형도 게시글을 클릭할때마다 1포인트씩 차감됩니다.<br/>
			(부정 참여자는 신고해주시면 해당 포인트 복원 됨)<br/>
			EX) 인스타그램 팔로워 하고 스크린샷 남겨주세요.<br/>
			<br/>
			3. 링크형<br/>
			링크는 게시글을 읽고 링크를 클릭하면 1포인트씩 차감되며<br/>
			링크 클릭시 추가로 10포인트가 차감되는 방식입니다.<br/>
			링크는 하루가 지나면 또 클릭 할 수 있고 포인트 역시 차감됩니다.<br/>
			EX) 블로그나 까페 또는 본인의 SNS 링크등록하여 클릭시 해당 페이지로 이동됨.<br/>
		  </div>
		  <div id="fade" className="black_overlay"></div>
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
			maxLength="20000"
			value={content}
			onChange={onChange}
		  ></textarea>
		</div>
	{ type == '링크형' || type == '참여형' ?
        <div className='row'>
		  <span>링크</span>
		  <input
			name={'link'}
			className='nametap'
			type="text"
			placeholder="링크"
			maxLength="100"
			value={link}
			onChange={onChange}
		  />
		</div>
			  : null }
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
			<button className="cancel"onClick={() => window.location.replace("/promotion/"+match.params.page)}>취소</button>
		</div>
		<div className="buttons">
			*등록한 포인트가 모두 소진되면 노출되지 않습니다.<br/>
		</div>
      </div>
    <ToastsContainer className='toast' store={ToastsStore} lightBackground/>
    </div>
  );
};

export default PromotionCRUD;