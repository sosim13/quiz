import React, { useEffect, useState } from 'react';
import firebase from './../FireBase';
import { AiOutlineClose, AiTwotoneLike, AiFillDislike, AiOutlineCheckSquare, AiOutlineCheckCircle, AiOutlineBorder, AiTwotoneStar } from "react-icons/ai";
import moment from 'moment';
import 'moment/locale/ko';	//대한민국

const AccountBook = () => {
  // 로그인체크
  const ss_email = window.sessionStorage.getItem('ss_email');
  const authenticated = ss_email != null && ss_email != '';

  // 현재 날짜
  const nowTime = moment().format('YYYYMMDDHHmmss');
  const nowDate = moment().format('YYYYMMDD');

  const [datas, setDatas] = useState([]);  
  const [wdate, setWdate] = useState(nowDate);
  const [wtime, setWtime] = useState(nowTime);
  const [company, setCompany] = useState('');
  const [content, setContent] = useState('');
  const [income, setIncome] = useState('');
  const [output, setOutput] = useState('');
  const [total, setTotal] = useState(0);
  const [totalPay, setTotalPay] = useState(0);
  const [pay, setPay] = useState(0);


  const [email, setEmail] = useState('');
  const userRef = firebase.database().ref('money_list');


  useEffect(() => {
    userRef.on('value', snapshot => {
      const users = snapshot.val();
      const usersData = [];
	  var totalMoney = 0;
	  var totalPayMoney = 0;

      for(let id in users) {
        usersData.push({ ...users[id], id });
		console.log(users[id].output);
		totalMoney = totalMoney + Number(users[id].output);
		  {users[id].pay == 0 && (totalPayMoney = totalPayMoney + Number(users[id].output))}
      }
  
	  setTotal(totalMoney);
	  setTotalPay(totalPayMoney);
      setDatas(usersData);
    })
  }, []);

  const onChange = (e) => {
    e.target.name === 'wdate' ? setWdate(e.target.value) : setEmail(ss_email);
    e.target.name === 'company' ? setCompany(e.target.value) : setEmail(ss_email);
    e.target.name === 'content' ? setContent(e.target.value) : setEmail(ss_email);
    e.target.name === 'income' ? setIncome(e.target.value) : setEmail(ss_email);
    e.target.name === 'output' ? setOutput(e.target.value) : setEmail(ss_email);
  }

  const onClickAdd = () => {
    const userData = { wdate, company, content, output, pay, email, wtime };

    userRef.push(userData);
	setWdate(nowDate);
    setCompany('');
    setContent('');
    setOutput('');
    setPay('');
  }

  const onClickRemove = (id) => {
    userRef.child(id).remove();
  }

  const onUpdatePayUp = (id) => {
    const [user] = datas.filter(el => el.id === id);

    userRef.child(id).update({
      pay: 1
    });

    setDatas(datas.map(el => el.id === id ? {...el, pay: 1} : el));
  };

  const onUpdatePayDown = (id) => {
    const [user] = datas.filter(el => el.id === id);

    userRef.child(id).update({
      pay: 0
    });

    setDatas(datas.map(el => el.id === id ? {...el, pay: 0} : el));
  };

  return (
    <div>	  
		<table className="type04">
			<tr>
				<th scope="row" width="5%">날짜</th>
				<th scope="row" width="40%">상호</th>
				<th scope="row" width="35%">내용</th>
				<th scope="row" width="15%">출금</th>
				<th scope="row" width="5%"><AiOutlineCheckSquare/></th>
			</tr>
	  
		{datas?.map(data =>
			<tr>
				<td>{data.wdate.replace('2022','')}</td>
				<td className="tdRed">{data.company}</td>
				<td>{data.content}</td>
				<td className="tdBlue">{data.output.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
				<td >{data.pay == 0 ? <AiOutlineBorder onClick={() => onUpdatePayUp(data.id)}/> : <AiOutlineCheckSquare onClick={() => onUpdatePayDown(data.id)}/>}</td>
			</tr>
		)}
			<tr>
				<td colSpan="2">
					<AiTwotoneStar/> 총지출 : <font color="#00a0ee">{total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</font>
				</td>
				<td colSpan="3">
					<AiTwotoneStar/> 미정산 : <font color="red">{totalPay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</font>
				</td>
			</tr>
		</table>
      <div className="moneyForm">
        <input onChange={onChange} name='wdate' placeholder='날짜' value={wdate}></input>
        <input onChange={onChange} name='company' placeholder='상호' value={company}></input>
        <input onChange={onChange} name='content' placeholder='내용' value={content}></input>
        <input onChange={onChange} name='output' placeholder='출금' value={output}></input>
        <button className='writeBtn' onClick={onClickAdd}>등록</button>
      </div>
    </div>
  );
};

export default AccountBook;