import React, { useEffect, useState } from 'react';
import firebase from './../FireBase';
import { Link } from "react-router-dom";
import Pagination from '../common/Pagination';
import moment from 'moment';
import 'moment/locale/ko';	//대한민국
import { IconContext } from "react-icons";
import { AiOutlineClose } from "react-icons/ai";
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';

const FreeBoardList = ({ match }) => {
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
  const userRef = firebase.database().ref('freeBoardList');
  const answerRef = firebase.database().ref('freeBoardAnswerList');

  const [answerCnt, setAnswerCnt] = useState(0);

  // 페이징처리함수
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(match.params.page);		// 현재페이지
  const [postsPerPage, setPostsPerPage] = useState(5);		// 노출건수
  const [totalCnt, setTotalCnt] = useState(0);				// 총건수

  let count = 0;

  useEffect(() => {

    userRef.orderByChild('wtime').on('value', snapshot => {
//    userRef.orderByChild('email').equalTo('test@m.mm').once('value', snapshot => {
//    userRef.orderByValue().startAt(3).limitToLast(4).on('value', snapshot => {
      const users = snapshot.val();
      const usersData = [];

      for(let id in users) {
	    count++;
        usersData.push({ ...users[id], id });
      }

	  setTotalCnt(count);
	  // orderBy 정렬순서
	  usersData.sort(function(a, b) {
		  var aorder = parseInt(a.wtime.toString());
		  var border = parseInt(b.wtime.toString());
	    return border - aorder;
	  });
//      setFullDatas(currentPosts(usersData));
      setDatas(usersData);
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
	  ToastsStore.success("삭제되었습니다.");
	}
    
  }
  
  const onUpdate = (id, dataEmail, readNo) => {

//    const [data] = currentPosts(datas).filter(el => el.id === id);
	if (dataEmail != ss_account)
	{
		userRef.child(id).update({
		  readNo: readNo+1
		});
	}
	setTotalCnt(totalCnt);

    window.location.replace("/freeBoard/FreeBoardDetial/"+id+"/"+currentPage);
  };


  // 페이징처리 계산
  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  function currentPosts(tmp) {
    let currentPosts = 0;
    currentPosts = tmp.slice(indexOfFirst, indexOfLast);
    return currentPosts;
  }

  const answerCount = (pid) => {

	let count = 0;
	answerRef.orderByChild('pid').equalTo(pid).on('value', snapshot => {

      const users = snapshot.val();
      for(let id in users) {
	    count++;
      }
    })
		console.log('돈다'+count);
	
	return count;
  }


  return (
    <div>
		{currentPosts(datas)?.map(data => <div key={data.id}>
        <div className='box'>
			{/*<font color='blue'>{data.type}</font><br />*/}
			
		  <div className="board_list"><img src={data.url != null ? data.url.replace("/upload/","/upload/c_thumb,w_100,h_57,g_face/") : null} /></div>
	        <div className="board_list2">				
				<span className={data.url != '' ? "board_title" : "board_title_noimg"} onClick={() => onUpdate(data.id, data.email, data.readNo)}>{data.title}</span>		  
				<br />
				<span className={data.url != '' ? "content" : "content_noimg"} onClick={() => onUpdate(data.id, data.email, data.readNo)}>{data.content}</span> 
				{/*
				  <span className="rcontent">
					  <IconContext.Provider value={{ className: 'free_react-icons' }}><AiOutlineMessage size="18"/></IconContext.Provider> {answerCount(data.id)}
					</span>
				  */}
				
		    </div>
		    <span className="eye_read_no">{data.nickName} </span><br/>
		    <span className="eye_read_no">{data.utime.substring(4,8) == nowdate ? data.utime.substring(8,10)+':'+data.utime.substring(10,12) : data.utime.substring(4,6)+'-'+data.utime.substring(6,8)} [ {data.readNo == null ? '0' : data.readNo} ] </span>
				{ss_account == 'sosim13p@gmail.com' ? (
			  <button className='adminFreeBoardDelBtn' onClick={() => onClickRemove(data.id)}><AiOutlineClose/></button>
			) : (
			  null
			)}
          </div>	
        <hr />		
		{/*data.email == ss_account ? (
		  <button className='delBtn' onClick={() => onClickRemove(data.id)}><AiOutlineClose/></button>
        ) : (
		  null
        )*/}		
      </div>
      )}
	  {currentPosts(datas).length == 0 ? (
		<div className='box'>등록된 게시물이 없습니다.</div>
	  ) : (
		null
	  )}
	{/*페이징 처리*/}

	<Pagination postsPerPage={postsPerPage} totalPosts={totalCnt} currentPage={currentPage} paginate={setCurrentPage}></Pagination>
	{/*총건수 : {totalCnt}/{datas.length}, 현재페이지 : {currentPage} /  {indexOfFirst }, {indexOfLast} <br/>*/}
	<Link to={`/freeBoard/FreeBoardWrite/${currentPage}`}>
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

export default FreeBoardList;