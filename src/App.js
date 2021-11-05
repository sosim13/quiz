import React, { useState, useEffect } from 'react';
import { Link, Route, Switch, BrowserRouter as Router, NavLink   } from "react-router-dom";
import { AiFillHeart, AiFillHome, AiOutlineMenu, AiFillSetting, AiFillEdit, AiFillBulb, AiOutlineAudit, AiOutlineDesktop } from "react-icons/ai";
import { signIn } from './auth';
import AuthRoute from './AuthRoute';

import './common/index.css';

import Home from "./Home";
import About from "./About";
import Profile from './Profile';
import Users from "./Users";
import NotFound from "./NotFound";
import Login from './login/Login';
import MyPage from './login/MyPage';
import Quiz from './quiz/index';
import LoginForm from './LoginForm';
import LogoutButton from './LogoutButton';
import Texts from './Texts';
import T1 from './t1';
import T2 from './t2';
import FreeBoard from './freeBoard/index';


function App() {

  const activeStyle = {
	color: '#f78287',
	fontSize: '1.2rem',
	fontStyle: 'italic'
  }
  const [user, setUser] = useState(null);

  const login = ({ email, password }) => setUser(signIn({ email, password }));
  const logout = () => setUser(null);

  // 로그인체크
  const ss_email = window.sessionStorage.getItem('ss_email');
  const authenticated = ss_email != null && ss_email != '';


  return (
    <Router>
      <header>
		<div><AiFillHeart/> CRANBERRY</div><div>  
		{authenticated ? (
			ss_email
        ) : (
          <Link to="/login">LOGIN</Link>
        )}
		{/*<Link to="/MyPage"><AiFillSetting/></Link>*/}
		
		
		</div>

      </header>
      <hr />
      <main>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
		  <Route
            path="/loginForm"
            render={props => (
              <LoginForm authenticated={authenticated} login={login} {...props} />
            )}
          />
          <AuthRoute
            authenticated={authenticated}
            path="/profile"
            render={props => <Profile user={user} {...props} />}
          />
          <Route path="/login" component={Login} />
	      
          <AuthRoute
            authenticated={authenticated}
            path="/MyPage"
            render={props => <MyPage user={user} {...props} />}
          />
          <Route path="/users" component={Users} />
          <Route path="/quiz" component={Quiz} />
          <Route path="/freeBoard" component={FreeBoard} />
          <Route path="/t1" component={T1} />
          <Route path="/t2" component={T2} />
          <Route component={NotFound} />
        </Switch>
      </main>
	  <footer> 
	    <div className="tabmenu">
        <NavLink exact  to="/" activeStyle={ activeStyle }>
          <div className='topButton'><AiFillHome /></div>
        </NavLink >
        <NavLink  to="/about" activeStyle={ activeStyle }>
          <div className='topButton'><AiOutlineDesktop/></div>
        </NavLink >
        <NavLink  to="/quiz" activeStyle={ activeStyle }>
          <div className='topButton'><AiFillBulb/></div>
        </NavLink >	 
        <NavLink  to="/Users" activeStyle={ activeStyle }>
          <div className='topButton'><AiOutlineAudit/></div>
        </NavLink >
        <NavLink  to="/freeBoard" activeStyle={ activeStyle }>
          <div className='topButton'><AiFillEdit /></div>
        </NavLink >	 
	    <NavLink  to="/MyPage" activeStyle={ activeStyle }>			  
          <div className='topButton'><AiFillSetting/></div>
        </NavLink >			  
        </div>
	  </footer>
    </Router>
  );
}

export default App;
