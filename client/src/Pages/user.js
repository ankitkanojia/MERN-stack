import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useHistory } from 'react-router-dom';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4000";

function User() {
  const [users, SetUsers] = useState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setName] = useState('');
  const history = useHistory();
  const [socket, SetSocket] = useState(socketIOClient(ENDPOINT, { transports: ['websocket', 'polling', 'flashsocket'] }));
  let token = localStorage.getItem("auth-token");

  const getUsers = async () => {

    await axios.get("http://localhost:4000/users", {
      headers: { "x-auth-token": token }
    })
      .then((response) => {
        SetUsers(response.data);
      }, (error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getUsers();
    if (socket != null) {
      socket.on('userAdded', function (data) {
        getUsers();
      });
    }
  }, []);

  const addUser = async () => {
    await fetch("http://localhost:4000/users/add", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    }).then((response) => {
      setPassword('');
      setName('');
      setEmail('');
    }, (error) => {
      console.log(error);
    });
  }

  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:4000/users/${id}`, {
      headers: { "x-auth-token": token }
    })
      .then((response) => {
        console.log('Deleted successfully...')
      }, (error) => {
        console.log(error);
      });
  }

  const logout = () => {
    localStorage.setItem("auth-token", "");
    history.push("/login");
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <button className="btn btn-primary mr-2" onClick={logout}>Logout</button>
          <h1 className="text-center">User List</h1>
          <hr />
          <table className="table table-dark">
            <thead>
              <tr>
                <td>Name</td>
                <td width="10">Action</td>
              </tr>
            </thead>
            <tbody>
              {users && users.map((s, index) => <tr key={index}>
                <td>{s.username}</td>
                <td className="text-center" onClick={() => deleteUser(s._id)}>
                  <img width="15" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAb1BMVEX///8AAAD8/PxEREQMDAyrq6tVVVXc3NyRkZHFxcXm5uYqKiqnp6dubm65ubm/v7/V1dVhYWHx8fGampo3NzeLi4tJSUmysrJ9fX08PDwuLi6hoaEfHx/39/fOzs5oaGh3d3dWVlYVFRUcHBxzc3OOGi1qAAAEPUlEQVR4nO3dWXeiQBAFYBZXXFAEJRjikvz/3zgkTh7GEqzGi9049z7l5BBOfQfspjognt9NBu9FGm5P68Uiz/Msyyabv9kPq1x+nFS/z/Ovxfo0Ct+K944q8brY6XaySkrPMGW0W3Sh7ECYjwNT3W+SXQovBy7Mkra8S6YzcEFgYbh6zFelzLAlYYX5w77vfAyQNUGFGQToeeNPYFFI4QQE9LwISAQKDzBgdaLiysIJiwcH0X+zh9WFE06RQM8LUXXBhGss0FuhCoMJx2ChdwAVhhKO0EBvCqoMJVzChQHokwgSzoxbifuZY0oDCRd4oDfGlAYS4k/SKgWkNJAwulHgND+Fb2mazmTSS8Iw3I7W68Mx29/qSXJIaRhhKnveaGu2i40UDiG1YYQ3pvu16T7kUcRM+hihbJsiwD4SSG0Y4V5UtzTex0zso4R0whjhTlTXojeQZzpk6Q0jlJNFi3FQdl+QRamujqHhSPodOdScEbXdFRaj9eKYZ9lmspl/Z/iT3U+WP4njWE6H06VpdvIYxoo/Oz4o3H50cMGJTXTH2CzMWq9ePzPN82ajELP82X2ipkG3SZg6f4b+pmn2bRLGtgvXp6FbbhB20dV2lYYLjAbh0XbZBmnolhuEchp3N0F9tyyFefST8bhHJ2k1nI4vZcuZQwpx/1+xkfLlhbKnpLBvoZBC90Mhhe6HQgrdD4X/izDob1TC2TbscxTCVwuF/Q+F/Q+F/Y9GOHA3ICH85lhcFhRSSKH1UEghhfZDIYUU2g+FFFJoPxRSSKH9UEghhfbzNGG5uor4k+B6i5V4Viq5u4VFofj+g/P1FvKZUvHMqHiiYOuyUDwQKoXing/xDQOKb6KgkEIKKaSQQgoppJBCCimkkEIKKaSQQgoppJBCCimkkEIKKaSQQgoppJBCCimkkEIKKaSQQgoppJBCCimkkEIKKaSQQgoppJBCCt0THl5eqHivMoUUUkghhRRSSOElHy8vlK91p5BCCimkkEIKHRKOKOz9VRuFFFJIIYWPC08Y4dRdIegYxs4Kgy2FFLYWPum7oJ8nTOKriMGpvN4iFquw0fUW98fw5wltBSVc2obUJnijkML/RbizDalNkL66sCwo1AmHtiG1Kd8xwrltSG1Qwr1tSG3KM0YougBnkiiq1whFF+BMZMfSTniwDanNCiQ8l7YldREtZUuhYrHNUhTNk074ZVtSE83HUCf0HT1NM5zQzRmx/MQJi8S25lY044xW6G9sa24kUVyy6YUDBw/iRFe6UujgrK+Z7U2EzrVQge4cNRAq7sh4ahRPPJkKZ4pXSj4vqqnQUOgXDhE3+rINhP7AmVeu5gZVmwj9gRsrp4nimbyWwuoa3IEr1Fg7irYS+mfbs0akuB3xIaHvpzuL1zcrk09gW2E1b+RTK8jxXHHrBURY5Tw6Zpv58GnZTPKDYn37Vv4AXYOt+uex56UAAAAASUVORK5CYII=" />
                </td>
              </tr>)}
            </tbody>
          </table>
        </div>
        <div className="col-md-6">
          <h1 className="text-center">ADD User Details</h1>
          <hr />
          <form>
            <div className="form-group">
              <label>User Name</label>
              <input type="text" value={username} onChange={e => setName(e.target.value)} autoComplete="off" className="form-control" placeholder="User Name" />
            </div>
            <div className="form-group">
              <label>User Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="off" className="form-control" placeholder="Email" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="off" className="form-control" placeholder="Password" />
            </div>
            <button type="button" onClick={() => addUser()} className="btn btn-secondary">Add New User</button>&nbsp;&nbsp;
          </form>
        </div>
      </div>
    </div >
  );
}

export default User;
