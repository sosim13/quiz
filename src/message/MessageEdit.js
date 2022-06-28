import React, { useEffect, useState } from 'react';
import firebase from './../FireBase';
import moment from 'moment';
import 'moment/locale/ko';	//대한민국
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';

const MessageCRUD = ({ match, history }) => {
  // 로그인체크
  const ss_email = window.sessionStorage.getItem('ss_email');
  const ss_account = window.localStorage.getItem('ss_account');
  
  // 현재 날짜
  const nowTime = moment().format('YYYYMMDDHHmmss');
//  console.log(nowTime);

  const [datas, setDatas] = useState([]);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');
  const [wtime, setWtime] = useState('');
  const [utime, setUtime] = useState('');
  const [firebaseId, setFirebaseId] = useState('');
  const [url, setUrl] = useState("");
  const userRef = firebase.database().ref('messageList');
 
  useEffect(() => {
    userRef.orderByKey().equalTo(match.params.id2).once('value', snapshot => {
      const users = snapshot.val();
      const usersData = [];
      for(let id in users) {
        usersData.push({ ...users[id], id });
//		console.log(users[id]);
		setFirebaseId(id)
		setTitle(users[id].title)
		setContent(users[id].content)
		setUrl(users[id].url)
      }
  
      setDatas(usersData);
    })
  }, []);

  const onChange = (e) => {
    e.target.name === 'type' ? setType(e.target.value) : setEmail(ss_account);
    e.target.name === 'title' ? setTitle(e.target.value) : setEmail(ss_account);
    e.target.name === 'content' ? setContent(e.target.value) : setUtime(nowTime);
  }

  const onClickAdd = () => {
    const userData = { type, title, content, email, utime };

    userRef.push(userData);
	window.location.replace("/message");
//    setType('');
//    setTitle('');
//    setContent('');
//    setEmail('');

  }

  const onUpdate = (id) => {
    const [data] = datas.filter(el => el.id === id);
    userRef.child(id).update({
      title: title,
      content: content,
      utime: nowTime,
	  url: url
    });

//    setTitle(title);
//    setContent(content);
//    setUtime(utime);
//	setUrl(url);
	    
    ToastsStore.success("수정했습니다.");
	setTimeout(function(){
		window.location.replace("/message/"+match.params.page2);
	}, 1000);
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
			setUrl(data.url.replace('http://','https://'))
		})
		.catch(err => console.log(err))
	}


  return (
   <div className='mybox'>
	  {datas?.map(data => <div key={data.id}>
		{data.id == match.params.id2 && data.email == ss_account ? (
	    <div>
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
				maxLength="2000"
				value={content}
				onChange={onChange}
			  ></textarea>
			</div>
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
				<button className="write"  onClick={() => onUpdate(firebaseId)}>수정하기</button>
				<button className="cancel" onClick={() => history.goBack()}>취소</button>
			</div>
        </div>
        ) : (
			null
        )}
      </div>		  
      )}

    
        
		
    <ToastsContainer className='toast' store={ToastsStore} lightBackground/>
    </div>
  );
};

export default MessageCRUD;