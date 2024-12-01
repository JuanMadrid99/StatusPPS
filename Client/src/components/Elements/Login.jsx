import React from 'react';
import '../css/login.css'

const LoginPanel = () => {
    const ipLogin = `http://${process.env.REACT_APP_HOST}/login/user`
    return (
        <div className="loginpanel">
            <h3>Iniciar Sesión</h3>
            <form action={ipLogin} method='POST'>
                <div className="form-group">
                    <label htmlFor="nickname">Usuario:</label>
                    <input type="text" id="nickname" name="nickname" required />
                </div>
                <div className="form-group">
                    <label htmlFor="psw">Contraseña:</label>
                    <input type="password" id="psw" name="psw" required />
                </div>
                <button className='loginbutton' type="submit">Iniciar Sesión</button>
            </form>
        </div>
    );
};

export default LoginPanel;