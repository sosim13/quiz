import React, { useEffect, useState } from 'react';
import firebase from './../FireBase';
import moment from 'moment';
import 'moment/locale/ko';	//대한민국
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';

const BillWrite = ({ match, history }) => {
  // 로그인체크
  const ss_email = window.sessionStorage.getItem('ss_email');
  const ss_account = window.localStorage.getItem('ss_account');

  
  // 현재 날짜
  const nowTime = moment().format('YYYYMMDDHHmmss');

  const [datas, setDatas] = useState([]);
  const [company, setCompany] = useState('');
  const [nickName, setNickName] = useState('');
  const [tel, setTel] = useState('');
  const [addr, setAddr] = useState('');
  const [recommend, setRecommend] = useState('');
  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');
  const [wtime, setWtime] = useState('');
  const [utime, setUtime] = useState('');
  const [url, setUrl] = useState("");
  const [star, setStar] = useState("");
  const [parking, setParking] = useState("");
  const [photo1, setPhoto1] = useState("");
  const [photo2, setPhoto2] = useState("");
  const [photo3, setPhoto3] = useState("");
  const [photo4, setPhoto4] = useState("");
  const [photo5, setPhoto5] = useState("");
  const [readNo, setReadNo] = useState(0);
  const [firebaseId, setFirebaseId] = useState('');
  const userRef = firebase.database().ref('billList');
  const loginRef = firebase.database().ref('member_list');
  const [selected, setSelected] = useState("selected");
		

  useEffect(() => {
    userRef.orderByKey().equalTo(match.params.id2).once('value', snapshot => {
      const users = snapshot.val();
      const usersData = [];
      for(let id in users) {
        usersData.push({ ...users[id], id });
		setFirebaseId(id)
		setCompany(users[id].company)
		setTel(users[id].tel)
		setAddr(users[id].addr)
		setRecommend(users[id].recommend)
		setContent(users[id].content)
		setStar(users[id].star)
		setParking(users[id].parking)
		setUrl(users[id].url)
		setPhoto1(users[id].photo1)
		setPhoto2(users[id].photo2)
		setPhoto3(users[id].photo3)
		setPhoto4(users[id].photo4)
		setPhoto5(users[id].photo5)
      }
  
      setDatas(usersData);
    })
  }, []);

  const onChange = (e) => {
    e.target.name === 'company' ? setCompany(e.target.value) : setEmail(ss_account);
    e.target.name === 'tel' ? setTel(e.target.value) : setWtime(nowTime);
    e.target.name === 'addr' ? setAddr(e.target.value) : setUtime(nowTime);
    e.target.name === 'recommend' ? setRecommend(e.target.value) : setUtime(nowTime);
    e.target.name === 'content' ? setContent(e.target.value) : setUtime(nowTime);
    e.target.name === 'star' ? setStar(e.target.value) : setEmail(ss_account);
    e.target.name === 'parking' ? setParking(e.target.value) : setEmail(ss_account);
  }

  const onClickAdd = () => {

	 if (company == '')
	{
		alert('업체명을 입력해주세요.');
		return false;
	}
	if (content == '')
	{
		alert('내용을 입력해주세요.');
		return false;
	}
	if (url == '')
	{
		alert('영수증을 업로드해주세요.');
		return false;
	}
    const userData = { company, nickName, tel, addr, recommend, content, email, wtime, utime, url, star, parking, photo1, photo2, photo3, photo4, photo5, readNo };

    userRef.push(userData);


	window.location.replace("/bill/"+match.params.page2);
//    setType('');
//    setTitle('');
//    setContent('');
//    setEmail('');

  }

  const onUpdate = (id) => {
    const [data] = datas.filter(el => el.id === id);
    userRef.child(id).update({
      company: company,
      tel: tel,
      addr: addr,
	  recommend: recommend,
	  content: content,
	  star: star,
	  parking: parking,
	  url: url,
	  photo1: photo1,
	  photo2: photo2,
	  photo3: photo3,
	  photo4: photo4,
	  photo5: photo5
    });

//    setTitle(title);
//    setContent(content);
//    setUtime(utime);
//	setUrl(url);
	    
    ToastsStore.success("수정했습니다.");
	setTimeout(function(){
		window.location.replace("/bill/"+match.params.page2);
	}, 1000);
  };

// 클라우디너리 이미지 업로드
  const uploadImage = (image, type) => {

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
			if(type == 0){
				setUrl(data.url.replace('http://','https://'))
			}else if(type == 1){
				setPhoto1(data.url.replace('http://','https://'))
			}else if(type == 2){
				setPhoto2(data.url.replace('http://','https://'))
			}else if(type == 3){
				setPhoto3(data.url.replace('http://','https://'))
			}else if(type == 4){
				setPhoto4(data.url.replace('http://','https://'))
			}else if(type == 5){
				setPhoto5(data.url.replace('http://','https://'))
			}

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
		  <span>업체명</span>
		  <input
			name={'company'}
			className='nametap'
			type="text"
			placeholder="업체명"
			maxLength="100"
			value={company}
			onChange={onChange}
		  />
		</div>			  
		<div className='row'>
		  <span>전화번호</span>
		  <input
			name={'tel'}
			className='nametap'
			type="text"
			placeholder="전화번호"
			maxLength="20"
			value={tel}
			onChange={onChange}
		  />
		</div>
		<div className='row'>
		  <span>주소</span>
		  <input
			name={'addr'}
			className='nametap'
			type="text"
			placeholder="주소"
			maxLength="2000"
			value={addr}
			onChange={onChange}
		  />
		</div>
		<div className='row'>
		  <span>평가</span>
		  <select name="star" onChange={onChange} className='select'>
		  {star == '★★★★★' ? (
			<option value="★★★★★" selected="seleted">매우맛있음 (★★★★★)</option>
			  ) : (
			<option value="★★★★★">매우맛있음 (★★★★★)</option>
		  )}
		  {star == '★★★★' ? (
			<option value="★★★★" selected="seleted">맛있음 (★★★★)</option>
			  ) : (
			<option value="★★★★">맛있음 (★★★★)</option>
		  )}
		  {star == '★★' ? (
			<option value="★★" selected="seleted">맛없음 (★★)</option>
			  ) : (
			<option value="★★">맛없음 (★★)</option>
		  )}
		  {star == '★' ? (
			<option value="★" selected="seleted">매우맞없음 (★)</option>
			  ) : (
			<option value="★">매우맞없음 (★)</option>
		  )}
		  </select>
		</div>
		<div className='row'>
		  <span>주차</span>
		{parking == '주차가능' ? 
		  <input name='parking' className='nametap' type="radio" value="주차가능" checked="checked" readOnly/> 
		  : 
		  <input name='parking' className='nametap' type="radio" value="주차가능" onClick={() => {setParking('주차가능')}} readOnly/>
		}
		<font color="blue">&nbsp;주차가능&nbsp;&nbsp;</font>
		{parking == '주차불가' ? 
		  <input name='parking' className='nametap' type="radio" value="주차불가" checked="checked" readOnly/>
		  : 
		  <input name='parking' className='nametap' type="radio" value="주차불가" onClick={() => {setParking('주차불가')}} readOnly/>
		}
		<font color="red">&nbsp;주차불가&nbsp;</font>
		</div>
		<div className='row'>
		  <span>추천메뉴</span>
		  <input
			name={'recommend'}
			className='nametap'
			type="text"
			placeholder="추천메뉴"
			maxLength="10"
			value={recommend}
			onChange={onChange}
		  />
		</div>
	    <div className='row'>
		  <span>내용</span>
		  <textarea
			name={'content'}
			className='message'
			placeholder="내용"
			maxLength="4000"
			value={content}
			onChange={onChange}
		  ></textarea>
		</div>
        <div className='row'>
		  <span>영수증</span>
		  <p className="rowComment"> (등록한 영수증은 노출되지 않습니다.)</p>
		</div>
	    <div>
		  <span className=''>
		  <label htmlFor="input-file"><img src={url != '' ? url.replace('/upload/','/upload/e_blur:300/') : "https://res.cloudinary.com/dv8img/image/upload/c_scale,w_265/v1636694953/web/choosefile_isp9qk.png"} width="265"/></label>
		  <input type="file" onChange= {(e)=> uploadImage(e.target.files[0], 0)} id="input-file" />	
		  </span>
		</div>
        <div className='row'>
		  <span>사진</span>
		</div>			  
		<div className='row'>
		  <span className=''>
		  <label htmlFor="photo1-file"><img src={photo1 != '' ? photo1 : "https://res.cloudinary.com/dv8img/image/upload/c_scale,w_75/v1636694953/web/choosefile_isp9qk.png"} width="75"/></label>
		  <input type="file" onChange= {(e)=> uploadImage(e.target.files[0], 1)} id="photo1-file" className="input-file" />	
		  </span>
		  <span className=''>
		  <label htmlFor="photo2-file"><img src={photo2 != '' ? photo2 : "https://res.cloudinary.com/dv8img/image/upload/c_scale,w_75/v1636694953/web/choosefile_isp9qk.png"} width="75"/></label>
		  <input type="file" onChange= {(e)=> uploadImage(e.target.files[0], 2)} id="photo2-file" className="input-file" />	
		  </span>
		  <span className=''>
		  <label htmlFor="photo3-file"><img src={photo3 != '' ? photo3 : "https://res.cloudinary.com/dv8img/image/upload/c_scale,w_75/v1636694953/web/choosefile_isp9qk.png"} width="75"/></label>
		  <input type="file" onChange= {(e)=> uploadImage(e.target.files[0], 3)} id="photo3-file" className="input-file" />	
		  </span>
		  <span className=''>
		  <label htmlFor="photo4-file"><img src={photo4 != '' ? photo4 : "https://res.cloudinary.com/dv8img/image/upload/c_scale,w_75/v1636694953/web/choosefile_isp9qk.png"} width="75"/></label>
		  <input type="file" onChange= {(e)=> uploadImage(e.target.files[0], 4)} id="photo4-file" className="input-file" />	
		  </span>
		  <span className=''>
		  <label htmlFor="photo5-file"><img src={photo5 != '' ? photo5 : "https://res.cloudinary.com/dv8img/image/upload/c_scale,w_75/v1636694953/web/choosefile_isp9qk.png"} width="75"/></label>
		  <input type="file" onChange= {(e)=> uploadImage(e.target.files[0], 5)} id="photo5-file" className="input-file" />	
		  </span>
		</div>
			<div className="buttons">
				<button className="write"  onClick={() => onUpdate(firebaseId)}>수정하기</button>
				<button className="cancel" onClick={() => history.goBack()}>취소</button>
			</div>
	    <div className="buttons">
		    <font color="gray">(*부정행위 적발시 계정 영구 정지)</font>
		</div>
      </div>
			  
    <ToastsContainer className='toast' store={ToastsStore} lightBackground/>
    </div>
  );
};

export default BillWrite;