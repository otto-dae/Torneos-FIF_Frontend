'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authHeaders } from '@/app/lib/auth';
import styles from '../../../../styles/centralized.module.css';
import Image from 'next/image';

export default function CreateAdministratorPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const res = await fetch('http://127.0.0.1:8000/main/administrators/create/', {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(form),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error);
            return;
        }

        router.push('/dashboard');
    };

    return (
        <div>
            <header className={styles.Header}>
                <Image
                    src="/Graphics/Troyan.png"
                    alt="Logo"
                    width={50}
                    height={50}
                    onClick={() => router.push('/dashboard')}
                    style={{ cursor: 'pointer' }}
                />
                <h1 className={styles.text}>Create Administrator</h1>
                <button onClick={() => router.push('/dashboard')} className={styles.btn2}>
                     Back
                </button>
            </header>
            <div className={styles.mainContainer}>
                <div className={styles.subContainer}>
                    <form onSubmit={handleSubmit} className={styles.formContainer}>
                        <div>
                            <label className={styles.textLabel}>Nombre</label><br />
                            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className={styles.textInput} />
                        </div>
                        <br />
                        <div>
                            <label className={styles.textLabel}>Email</label><br />
                            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className={styles.textInput} />
                        </div>
                        <br />
                        <div>
                            <label className={styles.textLabel}>Password</label><br />
                            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required className={styles.textInput} />
                        </div>
                        <br />
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <button type="button" onClick={() => router.push('/dashboard')} className={styles.btnCancel}>
                            Cancelar
                        </button>
                        <button type="submit" className={styles.btn2}>Crear</button>
                    </form>
                </div>
            </div>
        </div>
    );
}