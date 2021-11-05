import React, { useEffect, useState } from 'react';
import firebase from './../FireBase';
import moment from 'moment';
import 'moment/locale/ko';	//대한민국

const FreeBoardCRUD = ({ match, history }) => {
  // 로그인체크
  const ss_email = window.sessionStorage.getItem('ss_email');
  const authenticated = ss_email != null && ss_email != '';
  
  // 현재 날짜
  const nowTime = moment().format('YYYYMMDD HH:mm:ss');
  console.log(nowTime);

  const [datas, setDatas] = useState([]);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');
  const [wtime, setWtime] = useState('');
  const [utime, setUtime] = useState('');
  const [ url, setUrl ] = useState("");
  const userRef = firebase.database().ref('freeBoardList');

  const onChange = (e) => {
    e.target.name === 'type' ? setType(e.target.value) : setEmail(ss_email);
    e.target.name === 'title' ? setTitle(e.target.value) : setWtime(nowTime);
    e.target.name === 'content' ? setContent(e.target.value) : setUtime(nowTime);
  }

  const onClickAdd = () => {
    const userData = { type, title, content, email, wtime, utime, url };

    userRef.push(userData);
	window.location.replace("/freeBoard");
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
			setUrl(data.url)
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
		<div>
			<label htmlFor="input-file">
			  <img src='https://res.cloudinary.com/dv8img/image/upload/c_thumb,w_100,g_face/v1633486673/web/2_wdihjr.png'/>
			</label>
			<input type="file" onChange= {(e)=> uploadImage(e.target.files[0])} id="input-file" />
		</div>
		<div>
		  <span className=''><img src={url}/></span>
		</div>
        <div className='row'>
		  <span>제목</span>
		  <input
			name={'title'}
			className='nametap'
			type="text"
			placeholder="제목"
			maxLength="10"
			value={title}
			onChange={onChange}
		  />
		</div>
	    <div className='row'>
		  <span>소개</span>
		  <textarea
			name={'content'}
			className='message'
			placeholder="내용"
			maxLength="40"
			value={content}
			onChange={onChange}
		  ></textarea>
		</div>
		<div className="buttons">
			<button className="write" onClick={onClickAdd}>글쓰기</button>
			<button className="cancel" onClick={() => history.goBack()}>취소</button>
		</div>
      </div>
    </div>
  );
};

export default FreeBoardCRUD;