import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import './App.css';
import Header from './components/Header';
import Splash from './components/Splash';
import MainView from './components/MainView';
import Discover from './components/Discover';
import Reports from './components/Reports';
import { Paper } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import { getUser } from './app-utils';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';


const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#55b53f',
    },
    secondary: {
      main: '#b60edc',
    },
    background: {
      default: '#3d2f3c',
      paper: '#3d2f3c',
    },
    text: {
      primary: '#ffffff',
    },
  },
});

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
 const App = () => {
  const [user, setUser] = useState(null);
  const [at, setAt] = useState(null);
  const [rt, setRt] = useState(null);
  const [ showError, setShowError ] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUser(access_token, refresh_token);
        setUser(user);   
        if (user) {
          fetch('http://www.autoplaylistify.com/user', {
            method: 'POST',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify({...user, refresh_token: refresh_token})
          }).then(response => response.json())
          .then(json => {
            if (!json.success) {
              setError('failed to save user informaiton');
            }
          })
        }    
      } catch(e) {
        setError(e);
      }
    }
      const urlParams = new URLSearchParams(window.location.pathname);
      const access_token = urlParams.get('/access_token');
      const refresh_token = urlParams.get('refresh_token');
      if (access_token) {
        setAt(access_token);
        setRt(refresh_token);
        fetchUser(); 
      }
  },[])

  useEffect(() => {
    if (!showError && error) {
      setShowError(true);
    }
  }, [error, showError]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setError(null);
    setShowError(false);
  };
  
  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeProvider theme={theme}>
	  <Router>
	  	<Paper>
		  <Header user={user} />
			<Switch>
			<Route exact path="/">
				<React.Fragment>
					<Splash hide={user} />
					<MainView hide={!user} at={at} rt={rt} user={user} setError={setError}/> 
				</React.Fragment>
			</Route>
			<Route path="/Discover">
				<Discover at={at} setError={setError}/>
			</Route>
			<Route path="/Reporting">
				<Reports setError={setError} />
			</Route>
			<Route>
				<React.Fragment>
					<Splash hide={user} />
					<MainView hide={!user} at={at} rt={rt} user={user} setError={setError}/> 
				</React.Fragment>
			</Route>
			</Switch>
          
            <Snackbar open={showError} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="error">
                {error}
              </Alert>
            </Snackbar>
          </Paper>
		</Router>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
