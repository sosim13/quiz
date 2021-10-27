import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {
    render() {
        return (
            <div>
                <Link to="/">홈</Link>
                <Link to="/about/beomy">소개</Link>
                <Link to="/Posts">포스트</Link>
                <Link to="/login">로그인</Link>
            </div>
        );
    }
}

export default Header;