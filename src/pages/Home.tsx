import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
	return (
		<div>
			<h1>Welcome to the Home Page</h1>
			<div>
				<Link to="/login">
					<button>Login</button>
				</Link>
				<Link to="/register">
					<button>Register</button>
				</Link>
			</div>
		</div>
	);
};

export default Home;