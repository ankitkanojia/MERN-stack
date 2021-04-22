import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from "axios";
import Main from "./Main";

export default function App() {

  const history = useHistory();

  const checkLoggedIn = async () => {
    let token = localStorage.getItem("auth-token");
    if (token === null) {
      localStorage.setItem("auth-token", "");
      token = "";
      history.push("/login");
    } else {
      const tokenResponse = await axios.post('http://localhost:4000/auth/tokenIsValid', null, { headers: { "x-auth-token": token } });
      if (tokenResponse.data) {
        history.push("/");
      } else {
        history.push("/login");
      }
    }
  };

  useEffect(() => {
    checkLoggedIn();
  }, [])

  return <div className="container">
    <main className="container">
      <Main />
    </main>
  </div >
}
