'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authHeaders } from '@/app/lib/auth';

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
            <h1>Crear Administrador</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre</label><br />
                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <br />
                <div>
                    <label>Email</label><br />
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
                <br />
                <div>
                    <label>Password</label><br />
                    <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                </div>
                <br />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Crear</button>
                <button type="button" onClick={() => router.push('/dashboard')}>Cancelar</button>
            </form>
        </div>
    );
}