import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AuthApi from '../services/authApi';
import { useNavigate } from 'react-router-dom';

const theme = createTheme();

const Register: React.FC = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		try {
			const response = await AuthApi.register(username, password);
			navigate(`/dashboard/${response}`);
		} catch (error: any) {
			if (error.response.status === 409) {
				setErrorMessage('Username already exists');
			} else if (error.response.status === 400) {
				setErrorMessage(error.response.data.error);
			} else {
				setErrorMessage('An error occurred during registration');
			}
		}
	};

	return (
		<ThemeProvider theme={theme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: 'blue' }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Register
					</Typography>
					<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
						<TextField
							margin="normal"
							required
							fullWidth
							id="username"
							label="Username"
							name="username"
							autoComplete="username"
							autoFocus
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							error={errorMessage === 'Username already exists'}
							helperText={errorMessage === 'Username already exists' ? errorMessage : ''}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="new-password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							error={errorMessage.includes('Password')}
							helperText={errorMessage.includes('Password') ? errorMessage : ''}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
							Register
						</Button>
						<Grid container>
							<Grid item xs>
							</Grid>
							<Grid item>
								<Link href="/" variant="body2">
									{"Already have an account?"}
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
		</ThemeProvider>
	);
};

export default Register;
