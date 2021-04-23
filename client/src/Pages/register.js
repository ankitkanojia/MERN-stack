import React, { useState, useContext } from 'react';
import { useHistory } from "react-router-dom";
import "./../Index.css";
import { Link } from "react-router-dom";
import axios from "axios";

function Register() {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [username, setName] = useState();
    const [error, setError] = useState();
    const history = useHistory();

    const register = async () => {
        try {
            const newUser = { email, password, username };
            await axios.post("http://localhost:4000/auth/register", newUser);
            history.push("/");
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg)
        }
    }

    return (<React.Fragment>
        <div class="sidenav">
            <div class="login-main-text">
                <h2>Application<br /> Registration Page</h2>
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
                            <label>User Email</label>
                            <input type="email" onChange={e => setEmail(e.target.value)} autoComplete="off" class="form-control" placeholder="Email" />
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" onChange={e => setPassword(e.target.value)} autoComplete="off" class="form-control" placeholder="Password" />
                        </div>
                        <button type="button" onClick={() => register()} class="btn btn-secondary">Register</button>&nbsp;&nbsp;
                        <Link to={"/login"}><button type="submit" class="btn btn-black">Login</button></Link>
                    </form>
                </div>
            </div>
            <div class="col-md-6 col-sm-12"><br />{error && <label className="text-danger">{error}</label>}</div>
        </div>
    </React.Fragment>);
}

export default Register;
