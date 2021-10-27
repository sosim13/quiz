import React, { useState, useEffect } from 'react';
import { Link, Route, Switch, BrowserRouter as Router } from "react-router-dom";

import { signIn } from './auth';
import AuthRoute from './AuthRoute';

import './index.css';

import Home from "./Home";
import About from "./About";
import Profile from './Profile';
import Users from "./Users";
import NotFound from "./NotFound";
import LoginForm from './LoginForm';
import LogoutButton from './LogoutButton';
import Texts from './Texts';
import Test from './Test';

function App() {
	
  const [user, setUser] = useState(null);
  const authenticated = user != null;

  const login = ({ email, password }) => setUser(signIn({ email, password }));
  const logout = () => setUser(null);

  return (
    <Router>
      <header>
	    <div class="tabmenu">
        <Link to="/">
          <button><label for="tabmenu1">Home</label></button>
        </Link>
        <Link to="/about">
          <button>About</button>
        </Link>
        <Link to="/profile">
          <button>Profile</button>
        </Link>
        <Link to="/users">
          <button>Users</button>
        </Link>
        <Link to="/texts">
          <button>Texts</button>
        </Link>	  
        <Link to="/test">
          <button>Test</button>
        </Link>
	    {authenticated ? (
          <LogoutButton logout={logout} />
        ) : (
          <Link to="/login">
            <button>Login</button>
          </Link>
        )}
        </div>
      </header>
      <hr />
      <main>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
		  <Route
            path="/login"
            render={props => (
              <LoginForm authenticated={authenticated} login={login} {...props} />
            )}
          />
          <AuthRoute
            authenticated={authenticated}
            path="/profile"
            render={props => <Profile user={user} {...props} />}
          />
          <Route path="/users" component={Users} />
          <Route path="/texts" component={Texts} />
          <Route path="/test" component={Test} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </Router>
  );
}

export default App;
