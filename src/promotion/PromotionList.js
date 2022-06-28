import React, { useEffect, useState } from 'react';
import firebase from './../FireBase';
import { Link } from "react-router-dom";
import { AiOutlineClose, AiFillCopy, AiFillEye, AiOutlineDollar } from "react-icons/ai";
import Pagination from '../common/Pagination';
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';
import moment from 'moment';
import 'moment/locale/ko';	//대한민국

const PromotionList = ({ match }) => {
  // 로그인체크
  const ss_email = window.sessionStorage.getItem('ss_email');
  const ss_account = window.localStorage.getItem('ss_account');

  const nowdate = moment().format('MMDD');

//  const [fullDatas, setFullDatas] = useState([]);

  const [datas, setDatas] = useState([]);
  const [type, setType] = useState('');
  const [cpage, setCpage] = useState(1);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');
  const userRef = firebase.database().ref('promotionList');
   
  const [memDatas, setMemDatas] = useState([]);
  const [memFirebaseId, setMemFirebaseId] = useState('');
  const [nickName, setMemNickName] = useState('');
  const [memPoint, setMemPoint] = useState(0);
  const memberRef = firebase.database().ref('member_list');
  
  const [chkDatas, setChkDatas] = useState([]);
  const chkRef = firebase.database().ref('promotionListChk');

  // 페이징처리함수
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(match.params.page);		// 현재페이지
  const [postsPerPage, setPostsPerPage] = useState(5);		// 노출건수
  const [totalCnt, setTotalCnt] = useState(0);				// 총건수

  let count = 0;

  useEffect(() => {

    userRef.on('value', snapshot => {
//    userRef.orderByChild('email').equalTo('test@m.mm').once('value', snapshot => {
//    userRef.orderByValue().startAt(3).limitToLast(4).on('value', snapshot => {
      const users = snapshot.val();
      const usersData = [];

      for(let id in users) {
		if(users[id].point != '0'){
			count++;
	        usersData.push({ ...users[id], id });
		}
      }

	  setTotalCnt(count);
	  // orderBy 정렬순서
	  /*
	  usersData.sort(function(a, b) {
		  var aorder = parseInt(a.wtime.toString());
		  var border = parseInt(b.wtime.toString());
	    return border - aorder;
	  });
	  */
//      setFullDatas(currentPosts(usersData));
      setDatas(usersData);
    })

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

	chkRef.orderByChild('ss_account').equalTo(ss_account).on('value', snapshot => {
      const chk = snapshot.val();
      const chkData = [];
      for(let id in chk) {
        chkData.push(chk[id].pid);
      }
//  console.log(chkData);
      setChkDatas(chkData);
    })
  }, []);


  const onClickAdd = () => {
    const userData = { type, title, content, email };

    userRef.push(userData);
    setType('');
    setTitle('');
    setContent('');
    setEmail('');
  }

  const onClickRemove = (id) => {

	if (window.confirm("정말 삭제하시겠습니까?")) {
	  userRef.child(id).remove();
	}
    
  }
  
  const onUpdate = (email, id, readNo, point, link) => {
	if(nickName == ''){
		alert("회원만 이용 가능합니다.");
		return false;
	}
//    const [data] = currentPosts(datas).filter(el => el.id === id);
	if (email != ss_account)
	{	
		

		if(!chkDatas.includes(id)){
	
			ToastsStore.success("포인트 적립 +1P");

			// 프로모션 조회시 +1
			memberRef.child(memFirebaseId).update({
			  point : memPoint+1
			});

			// 중복체크
			onClickChkAdd(id);

			// 프로모션 조회시 게시글 포인트 -1
			userRef.child(id).update({
			  point : point-1
			});
		}

		// 본인글에는 조회수 올라가지 않음
		userRef.child(id).update({
		  readNo: readNo+1
		});

		setTotalCnt(totalCnt);
    
	}

	window.location.replace("/promotion/PromotionDetial/"+id+"/"+currentPage);
  };

  // 글 읽으면 중복 포인트 지급 안되도록..
  const onClickChkAdd = (pid) => {

	const chkData = { pid, ss_account };

    chkRef.push(chkData);

	/*
	chkRef.orderByChild('ss_email').equalTo(ss_account).on('value', snapshot => {
      const chk = snapshot.val();
      const chkData = [];
      for(let id in chk) {
        chkData.push(chk[id].pid);
      }
  
      setChkDatas(chkData);
    })
	*/

  }


  // 페이징처리 계산
  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  function currentPosts(tmp) {
    let currentPosts = 0;
    currentPosts = tmp.slice(indexOfFirst, indexOfLast);
    return currentPosts;
  }


  return (
    <div>
	  {currentPosts(datas)?.map(data => <div key={data.id}>
        <div className='box'>
			{/*<font color='blue'>{data.type}</font><br />*/}
			
		  <div className="board_list"><img src={data.url != null ? data.url.replace("/upload/","/upload/c_thumb,w_100,h_60,g_face/") : null} /></div>
		  <div className="board_list2">				
			<span className="">&nbsp;[{data.type}]
		  {data.email != ss_account ? (
			<button className="moneyButton">&nbsp;
			{!chkDatas.includes(data.id) && data.email != ss_account ?  '+1p'  : '완료' }&nbsp;
			</button>
				) : (
					null
				)}
		    </span><br/>
            <span className={data.url != '' ? "board_title" : "board_title_noimg"} onClick={() => onUpdate(data.email, data.id, data.readNo, data.point, data.link)}>{data.title} 		  
			</span>		  
            <br />
            <span className={data.url != '' ? "content" : "content_noimg"} onClick={() => onUpdate(data.email, data.id, data.readNo, data.point, data.link)}>{data.content}</span>
			<div>				
				{ss_account == 'sosim13p@gmail.com' ? <> &nbsp;({data.point}) </> : null }
			</div>
		    </div>
		    <span className="eye_read_no">{data.nickName} </span><br/>
		    <span className="eye_read_no">{data.utime.substring(4,8) == nowdate ? data.utime.substring(8,10)+':'+data.utime.substring(10,12) : data.utime.substring(4,6)+'-'+data.utime.substring(6,8)}<br/> [ {data.readNo == null ? '0' : data.readNo} ] </span>
          </div>	
        <hr />		
      </div>
    )}

	  {currentPosts(datas).length == 0 ? (
	  <>
		<div className='box'>진행중인 프로모션이 없습니다.</div>
		  {currentPage != '1' && window.location.replace("/promotion/1")}
	  </>
	  ) : (
		null
	  )}
	{/*페이징 처리*/}
	<Pagination postsPerPage={postsPerPage} totalPosts={totalCnt} currentPage={currentPage} paginate={setCurrentPage}></Pagination>
	{/*총건수 : {totalCnt}/{datas.length}, 현재페이지 : {currentPage} /  {indexOfFirst }, {indexOfLast} <br/>*/}
	<Link to={`/promotion/PromotionWrite/${currentPage}`}>
	  {ss_account != null ? (
	  <button className='writeRedBtn'>
        글쓰기
      </button>
		) : (
		  <div></div>
	  )}
	</Link>
    <ToastsContainer className='toast' store={ToastsStore} lightBackground/>
    </div>
  );
};

export default PromotionList;