import React, { useEffect, useState } from 'react';
import firebase from './../FireBase';
import { Link } from "react-router-dom";
import { AiOutlineClose, AiFillCopy, AiOutlineCar } from "react-icons/ai";
import Pagination from '../common/Pagination';
import moment from 'moment';
import 'moment/locale/ko';	//대한민국


const BillList = ({ match }) => {
  // 로그인체크
  const ss_email = window.sessionStorage.getItem('ss_email');
  const ss_account = window.localStorage.getItem('ss_account');

  const nowdate = moment().format('MMDD');

  const [datas, setDatas] = useState([]);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');
  const userRef = firebase.database().ref('billList');

  
  // 페이징처리함수
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(match.params.page);		// 현재페이지
  const [postsPerPage, setPostsPerPage] = useState(5);		// 노출건수
  const [totalCnt, setTotalCnt] = useState(0);				// 총건수

  useEffect(() => {
    userRef.on('value', snapshot => {
      const users = snapshot.val();
      const usersData = [];
      for(let id in users) {
        usersData.push({ ...users[id], id });
      }
	  setTotalCnt(usersData.length);
	  // orderBy 정렬순서
	  usersData.sort(function(a, b) {
		var aorder = parseInt(a.wtime.toString());
		var border = parseInt(b.wtime.toString());
	    return border - aorder;
	  });
  
      setDatas(usersData);
    })
  }, []);

  const onChange = (e) => {
    e.target.name === 'type' ? setType(e.target.value) : setEmail(ss_account);
    e.target.name === 'title' ? setTitle(e.target.value) : setEmail(ss_account);
    e.target.name === 'content' ? setContent(e.target.value) : setEmail(ss_account);
  }

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

  const onUpdate = (id, readNo) => {

//    const [data] = currentPosts(datas).filter(el => el.id === id);

    userRef.child(id).update({
      readNo: readNo+1
    });

	setTotalCnt(totalCnt);

    window.location.replace("/bill/billDetial/"+id+"/"+currentPage);
  };


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
			
		  <div className="board_list"><img src={data.photo1 != null ? data.photo1.replace("/upload/","/upload/c_thumb,w_100,h_57,g_face/") : null} /></div>
		  <div className="board_list2">				
			{/*<Link to={`${match.url}/BillDetial/${data.id}`}><span className="board_title">{data.company}{data.star}</span></Link>*/}
          <span className={data.photo1 != '' ? "board_title" : "board_title_noimg"}  onClick={() => onUpdate(data.id, data.readNo)}>{data.company} (★{data.star.length})</span>
          <br />
          <span className={data.photo1 != '' ? "content" : "content_noimg"} onClick={() => onUpdate(data.id, data.readNo)}>{data.content}</span>
		  </div>

		  <span className="eye_read_no">{data.nickName} </span><br/>
		  <span className="eye_read_no">
			{data.utime.substring(4,8) == nowdate ? data.utime.substring(8,10)+':'+data.utime.substring(10,12) : data.utime.substring(4,6)+'-'+data.utime.substring(6,8)} [ {data.readNo == null ? '0' : data.readNo} ] 
		  </span><br/>
	      <span className="eye_read_no">
			  {data.parking == '주차가능' ? 
				<AiOutlineCar alt='주차가능' size="20" />
				: 
				null
			  }
		  </span>
        </div>	
        <hr />
      </div>
      )}
	  
		
	  {currentPosts(datas).length == 0 ? (
		<div className='box'>등록된 게시물이 없습니다.</div>
	  ) : (
		null
	  )}
	{/*페이징 처리*/}
	<Pagination postsPerPage={postsPerPage} totalPosts={totalCnt} currentPage={currentPage} paginate={setCurrentPage}></Pagination>
	<Link to={`/bill/BillWrite/${currentPage}`}>
	  {ss_account != null ? (
	  <button className='writeRedBtn'>
        글쓰기 (+10p)
      </button>
		) : (
		  null
	)}
	</Link>
    </div>
  );
};

export default BillList;