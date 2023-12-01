import React, { useState } from 'react';
import { Avatar, Button, CssBaseline, TextField, Grid, Box, Typography, Container } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, useNavigate } from "react-router-dom";

import { auth } from '../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";

const defaultTheme = createTheme();

export function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [badCredMessage, setBadCredMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        navigate('/');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === 'auth/invalid-login-credentials' || errorCode === 'auth/invalid-email') {
          setBadCredMessage('Email ou mot de passe incorect');
        }else if (errorCode === 'auth/too-many-requests') {
          setBadCredMessage('Compte désactivé temporairement, veuillez réessayer plus tard');
        }else if (errorCode === 'auth/user-not-found') {
          setBadCredMessage('Aucun compte ne correspond à cet email');
        }else {
          console.log(errorCode, errorMessage);
        }
      });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
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
          <Avatar sx={{ m: 1, bgcolor: '#3F72AF' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Connectez-vous
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adresse email"
              name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              label="Mot de passe"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Typography color="error">{badCredMessage}</Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Se connecter
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  <muiLink variant="body2">
                    {"Mot de passe oublié?"}
                  </muiLink>
                </Link>
              </Grid>
              <Grid item>
                <Link to="/Register">
                  <muiLink variant="body2">
                    {"Pas de compte ? Inscrivez-vous"}
                  </muiLink>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Login;