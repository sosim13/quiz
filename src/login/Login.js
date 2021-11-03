import React, { useState, useEffect } from 'react';
import { authService, firebaseInstance  } from './../FireBase';
import { FcGoogle } from 'react-icons/fc';
import './Login.css';
import cranberry_logo from './../cranberry_logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(true);	// 새로운 유저인지 확인(초기값: true)
  
  const onChange = (event) => {
    const {target: {name, value}} = event;
    if (name==='email') {
      setEmail(value)
    } else if (name=== "password") {
      setPassword(value);
    }
  }
  
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let data;
	  console.log("newAccount : "+newAccount);
      if (!newAccount) {
        // create account
        data = await authService.createUserWithEmailAndPassword(email, password);
		console.log("회원가입");
		window.sessionStorage.setItem('ss_email', data.user.email);
		window.location.replace("/");
      } else {
        // login
        data = await authService.signInWithEmailAndPassword(email, password);
		console.log("로그인");
		window.sessionStorage.setItem('ss_email', data.user.email);
		window.location.replace("/");
      }
    } catch(error) {
      console.log("오류");
      console.log(error.code)
	  if(error.code == 'auth/user-not-found'){
		  alert("아이디가 존재하지 않습니다.");
	  }else if(error.code == 'auth/wrong-password'){
		  alert("비밀번호가 일치하지 않습니다.");
	  }else if('auth/too-many-requests'){
		  alert('비밀번호를 연속으로 실패하였습니다. 잠시후 다시 시도해주세요.');
	  }else{
		  alert(error.message);
	  }
    }
  }
  
  const toggleAccount = () => setNewAccount((prev) => !prev);

  // 소셜로그인
  const onGoogleClick = async (event) => {
  try
    {
      const {target: {name}} = event;
	  console.log("event : "+event);
      let provider;

      if (name === 'google') {
        provider = new firebaseInstance.auth.GoogleAuthProvider();
      }
      const data = await authService.signInWithPopup(provider);
	  window.sessionStorage.setItem('ss_email', data.user.email);
	  window.location.replace("/");
	  console.log(data);
    }
  catch (error)
    {
	  console.log(error)
    }
  }

  // 로그인에서는 안씀 마이페이지에 넣었음.
  const onLogOutClick = () => {
    authService.signOut();
	
	console.log("로그아웃");
	window.sessionStorage.setItem('ss_email', '');
	window.location.replace("/");
  }


  return (	  
    <div className='bg'>	
	  <div className='container'>
        <h1 className='title'>CRANBERRY</h1>
        <form className='form' onSubmit={onSubmit}>
          <input name="email" type="email" placeholder="Email" required value={email} onChange={onChange}/>
          <input name="password" type="password" placeholder="password" required value={password} onChange={onChange}/>
          <input className={ newAccount ? 'login' : 'newAccount' } type="submit" value={ newAccount ? "로그인" : "계정생성" } />
        </form>
        <span className='account' onClick={toggleAccount}>{newAccount ? "계정이 없으신가요?" : "계정이 있으신가요?"}</span><br/>
	  <button className='googleLogin' name='google' onClick={onGoogleClick}>
          <FcGoogle size="20" className='icon' />
          구글 계정으로 로그인
        </button>
      </div>
    </div>
  )
}

export default Login;