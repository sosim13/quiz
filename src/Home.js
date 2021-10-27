import React, { Component } from 'react';

import CardGroup from "react-bootstrap/CardGroup";
import Card from "react-bootstrap/Card";

 
class Home extends Component {
  render() {
    return (
		<div>
      <h1>HOME</h1>
		 <CardGroup>
		  <Card>
			<Card.Body>
			  <Card.Title>Card title</Card.Title>
			  <Card.Text>
				This is a wider card with supporting text below as a natural lead-in to
				additional content. This content is a little bit longer.
			  </Card.Text>
			</Card.Body>
			<Card.Footer>
			  <small className="text-muted">Last updated 3 mins ago</small>
			</Card.Footer>
		  </Card>
		  <Card>
			<Card.Body>
			  <Card.Title>Card title</Card.Title>
			  <Card.Text>
				This card has supporting text below as a natural lead-in to additional
				content.{' '}
			  </Card.Text>
			</Card.Body>
			<Card.Footer>
			  <small className="text-muted">Last updated 3 mins ago</small>
			</Card.Footer>
		  </Card>
		  <Card>
			<Card.Body>
			  <Card.Title>Card title</Card.Title>
			  <Card.Text>
				This is a wider card with supporting text below as a natural lead-in to
				additional content. This card has even longer content than the first to
				show that equal height action.
			  </Card.Text>
			</Card.Body>
			<Card.Footer>
			  <small className="text-muted">Last updated 3 mins ago</small>
			</Card.Footer>
		  </Card>
		  <Card>
			<Card.Body>
			  <Card.Title>Card title</Card.Title>
			  <Card.Text>
				This is a wider card with supporting text below as a natural lead-in to
				additional content. This content is a little bit longer.
			  </Card.Text>
			</Card.Body>
			<Card.Footer>
			  <small className="text-muted">Last updated 3 mins ago</small>
			</Card.Footer>
		  </Card>
		  <Card>
			<Card.Body>
			  <Card.Title>Card title</Card.Title>
			  <Card.Text>
				This card has supporting text below as a natural lead-in to additional
				content.{' '}
			  </Card.Text>
			</Card.Body>
			<Card.Footer>
			  <small className="text-muted">Last updated 3 mins ago</small>
			</Card.Footer>
		  </Card>
		  <Card>
			<Card.Body>
			  <Card.Title>Card title</Card.Title>
			  <Card.Text>
				This is a wider card with supporting text below as a natural lead-in to
				additional content. This card has even longer content than the first to
				show that equal height action.
			  </Card.Text>
			</Card.Body>
			<Card.Footer>
			  <small className="text-muted">Last updated 3 mins ago</small>
			</Card.Footer>
		  </Card>
		</CardGroup>
				  </div>
    );
  }
}
 
export default Home;