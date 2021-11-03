import React, { useEffect, useState } from 'react';
import firebase from './../FireBase';

const FreeBoardDetail = ({ match, history }) => {
  // 로그인체크
  const ss_email = window.sessionStorage.getItem('ss_email');
  const authenticated = ss_email != null && ss_email != '';
  
  const [datas, setDatas] = useState([]);
  const [type, setType] = useState('');
  const [quiz, setQuiz] = useState('');
  const [answer, setAnswer] = useState('');
  const [email, setEmail] = useState('');
  const userRef = firebase.database().ref('quiz_list');
 
  useEffect(() => {
    userRef.on('value', snapshot => {
      const users = snapshot.val();
	  console.log(snapshot.val());
      const usersData = [];
      for(let id in users) {
        usersData.push({ ...users[id], id });
		console.log('111:'+users[id]);
      }
  
      setDatas(usersData);
    })
  }, []);

  return (
   <>
		{datas?.map(data => <div key={data.id}>
        
		{data.id == match.params.id ? (
		  <div>
          타입: {data.type}
          <br />
          문제: {data.quiz}
          <br />
          정답: {data.answer}
        </div>
        ) : (
		  null
        )}
      </div>
      )}
	  <hr/>
      <button className='grayBtn' onClick={() => history.goBack()}>Back</button>
    </>
  );
};

export default FreeBoardDetail;