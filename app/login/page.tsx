'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './login.module.css';
import Link from 'next/dist/client/link';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const res = await fetch('http://127.0.0.1:8000/main/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error);
            return;
        }

        document.cookie = `token=${data.token}; path=/`;
        router.push('/dashboard');
    };

    return (
        <div className={styles.mainContainer}>
            <div className={styles.subContainer}>
                <div style={{textAlign: 'center'}}>
                    <Image src="/Graphics/Troyan.png" alt="Logo" width={150} height={150} />
                </div>
                <form onSubmit={handleSubmit} className={styles.formContainer}>
                    <div>
                        <label className={styles.textLabel}>Email</label><br />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={styles.textInput}/>
                    </div>
                    <br />
                    <div>
                        <label className={styles.textLabel}>Password</label><br />
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={styles.textInput}/>
                    </div>
                    <br />
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button className={styles.btn} type="submit">Login</button>
                </form>
                <Link href="/dashboard" className={styles.link}>Regresar al Inicio</Link>
                
            </div>
        </div>
    );
}