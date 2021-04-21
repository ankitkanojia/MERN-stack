import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import "./../Index.css";
import { Link } from "react-router-dom";
import axios from "axios";

function Login() {
    const [username, setName] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();
    const history = useHistory();

    const loginHandler = async () => {
        try {
            const loginUser = { username, password };
            const loginResponse = await axios.post("http://localhost:4000/auth/login", loginUser);
            localStorage.setItem("auth-token", loginResponse.data.token);
            history.push("/users");
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg)
        }
    };

    return (<React.Fragment>
        <div class="sidenav">
            <div class="login-main-text">
                <h2>Application<br /> Login Page</h2>
                <p>Login or register from here to access.</p>
            </div>
        </div>
        <div class="main">
            <div class="col-md-6 col-sm-12">
                <div class="login-form">
                    <form>
                        <div class="form-group">
                            <label>User Name</label>
                            <input type="text" onChange={e => setName(e.target.value)} autoComplete="off" class="form-control" placeholder="User Name" />
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" onChange={e => setPassword(e.target.value)} autoComplete="off" class="form-control" placeholder="Password" />
                        </div>
                        <button type="button" onClick={() => loginHandler()} class="btn btn-black">Login</button> &nbsp;&nbsp;
                        <Link to={"register"}><button type="button" class="btn btn-secondary">Register</button></Link>
                    </form>
                </div>
            </div>
            <div class="col-md-6 col-sm-12"><br />{error && <label className="text-danger">{error}</label>}</div>
        </div>
    </React.Fragment>);
}

export default Login;
