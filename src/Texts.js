import React from 'react';
const databaseURL = "https://quiz-5e76e-default-rtdb.firebaseio.com/";


class Texts extends React.Component  {
	constructor() {
        super();
        this.state = {
            member: {}
        };
    }

    _get() {
        fetch(`${databaseURL}/member.json`).then(res => {
            if(res.status != 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(member => this.setState({member: member}));
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.member != this.state.member
    }

    componentDidMount() {
        this._get();
    }

    render() {
        return (	
				<div class="container">
								<table border="1" width="100%">
									<thead>
										<th>아이디</th>
										<th>이름</th>
										<th>패스워드</th>
										<th>이메일</th>
									</thead>
									<tbody>
					{Object.keys(this.state.member).map(id => {
						const member = this.state.member[id];
						return (					
									<tr>
										<td>
											{member.id}
										</td>
										<td>
											{member.name}
										</td>
										<td>
											{member.password}
										</td>
										<td>
											{member.email}
										</td>
									</tr>
						);
					})}								
									</tbody>
								</table>
				</div>

        );
    }
}

export default Texts;
