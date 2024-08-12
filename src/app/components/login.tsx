"use client"
import React, { useState, FormEvent } from 'react';
import './login.css';  

import Link from 'next/link';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');



    const handleLogin = (e: FormEvent) => {
        e.preventDefault();
        console.log('Email:', email);
        console.log('Password:', password);
       
    };

    return (
        <div className='div-login'>
            <div className='div1'>
                <img src="/assets/logo.png" alt="Logo" />
            </div>
            <div className='div2'>
                <h2>Bienvenido!</h2>
                <img src="/assets/user.png" alt="logouser" className='user-logo'/>
                <form onSubmit={handleLogin}>
                    <div className="inputGroup">
                        <img src="/assets/mail.png" alt="email Icon" className="icon" />
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                        />
                    </div>
                    <div className="inputGroup">
                        <img src="/assets/lock.png" alt="lock Icon" className="icon" />
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Contraseña"
                            required
                        />
                    </div>
                    <Link className='btn-ingresar' href="/dashboard">
                        
                            Ingresar
                        
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;