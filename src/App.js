import React, { useState, useEffect } from 'react';
import { Link, Route, Switch, BrowserRouter as Router, NavLink } from "react-router-dom";
import { AiFillHeart, AiFillHome, AiOutlineMenu, AiFillSetting, AiFillEdit, AiFillBulb, AiOutlineAudit, AiOutlineDesktop } from "react-icons/ai";
import { BsBellFill } from "react-icons/bs";
import { signIn } from './auth';
import AuthRoute from './AuthRoute';
import './common/index.css';
import { IconContext } from "react-icons";

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
import Manual from './manual';
import T1 from './t1';
import T2 from './t2';
import T3 from './t3';
import T4 from './t4';
import T5 from './t5';
import T6 from './t6';
import T7 from './t7';
import T8 from './t8';
import T9 from './t9';
import T10 from './t10';
import Push from './Push';
import Alarm from './login/Alarm';
import Promotion from './promotion/index';
import FreeBoard from './freeBoard/index';
import Notice from './notice/index';
import Message from './message/index';
import AccountBook from './message/AccountBook';
import DenkenBook from './message/DenkenBook';
import Consult from './consult/index';
import Bill from './bill/index';


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
  const ss_account = window.localStorage.getItem('ss_account');
  const authenticated = ss_account != null && ss_account != '';


  return (
    <Router>
      <header>
		<div><AiFillHeart/> CRANBERRY</div><div>  
		{authenticated ? (
			ss_account
        ) : (
          <Link to="/login">LOGIN</Link>
        )}
		{authenticated ? (
		  <Link to="/Alarm"><IconContext.Provider value={{ className: 'react-icons' }}> <BsBellFill size="18" color="gray"/></IconContext.Provider></Link>
		) : (
          null
        )}
		
		</div>

      </header>
      <hr />
      <main>
        <Switch>
          <Route exact path={`/`} component={Home} />
          <Route path={`/home/:type/:id`} component={Home} />
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
          <Route path="/promotion" component={Promotion} />
          <Route path="/freeBoard" component={FreeBoard} />
          <Route path="/notice" component={Notice} />
          <Route path="/consult" component={Consult} />
          <Route path="/bill" component={Bill} />
          <Route path="/manual" component={Manual} />
          <Route path="/t1" component={T1} />
          <Route path="/t2" component={T2} />
          <Route path="/t3" component={T3} />
          <Route path="/t4" component={T4} />
          <Route path="/t5" component={T5} />
          <Route path="/t6" component={T6} />
          <Route path="/t7" component={T7} />
          <Route path="/t8" component={T8} />
          <Route path="/t9" component={T9} />
          <Route path="/t10" component={T10} />
          <Route path={`/push`} component={Push} />
          <Route path="/message" component={Message} />
          <Route path="/accountbook" component={AccountBook} />
          <Route path="/denkenbook" component={DenkenBook} />
          <Route path={`/Alarm`} component={Alarm} />

          <Route component={NotFound} />
        </Switch>
      </main>
	  <footer> 
	    <div className="tabmenu">
        <NavLink exact  to="/" activeStyle={ activeStyle }>
          <div className='topButton'><AiFillHome size="20" /></div>
        </NavLink >
        <NavLink  to="/promotion/1" activeStyle={ activeStyle }>
          <div className='topButton'><AiOutlineDesktop size="20"/></div>
        </NavLink >
        <NavLink  to="/quiz" activeStyle={ activeStyle }>
          <div className='topButton'><AiFillBulb size="20"/></div>
        </NavLink >	 
        <NavLink  to="/bill/1" activeStyle={ activeStyle }>
          <div className='topButton'><AiOutlineAudit size="20"/></div>
        </NavLink >
        <NavLink  to="/freeBoard/1" activeStyle={ activeStyle }>
          <div className='topButton'><AiFillEdit size="20" /></div>
        </NavLink >	 
	    <NavLink  to="/MyPage" activeStyle={ activeStyle }>			  
          <div className='topButton'><AiFillSetting size="20"/></div>
        </NavLink >			  
        </div>
	  </footer>
    </Router>
  );
}

export default App;
