import React, { useEffect, useState } from 'react';
import firebase from './FireBase';

const Test = () => {
  const [datas, setDatas] = useState([]);
  const [user, setUser] = useState('');
  const [age, setAge] = useState('');
  const userRef = firebase.database().ref('users');

  // 읽기
  useEffect(() => {
    userRef.on('value', snapshot => {
      const users = snapshot.val();
      const usersData = [];
      for(let id in users) {
        usersData.push({ ...users[id], id });
		console.log("id:"+id);
      }
  
      setDatas(usersData);
    })
  }, []);

  // 값이 변경될때
  const onChange = (e) => {
    e.target.name === 'user' ? setUser(e.target.value) : setAge(e.target.value);
  }

  // 등록
  const onClickAdd = () => {
    const userData = { user, age };

    userRef.push(userData);
    setUser('');
    setAge('');
  }

  const onClickRemove = (id) => {
    userRef.child(id).remove();
  }

  // 수정
  const onUpdate = (id) => {
    const [user] = datas.filter(el => el.id === id);

    userRef.child(id).update({
      age: user.age++
    });

    setDatas(datas.map(el => el.id === id ? {...el, age: el.age++} : el));
  };

  return (
    <div>
      {datas?.map(data => <div key={data.id}>
        <div>
          이름: {data.user}
          <br />
          나이: {data.age}
        </div>
        <button onClick={() => onUpdate(data.id)}>수정</button> <button onClick={() => onClickRemove(data.id)}>삭제</button>
        <hr />
      </div>
      )}
      <input onChange={onChange} name='user' placeholder='user' value={user}></input>
      <input onChange={onChange} name='age' placeholder='age' value={age}></input>
      <button onClick={onClickAdd}>추가하기</button>
    </div>
  );
};

export default Test;