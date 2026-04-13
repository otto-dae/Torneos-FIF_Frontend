'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';

export default function CreateParticipantPage() {
    const router = useRouter();
    const { id } = useParams();
    const [form, setForm] = useState({ name: '', phone: '', email: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const res = await fetch('http://127.0.0.1:8000/main/participants/create/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: form.name,
                phone: form.phone,
                email: form.email,
                team_id: parseInt(id as string),
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error);
            return;
        }

        router.push(`/dashboard/teams/${id}/participants`);
    };

    return (
        <div>
            <h1>Add Participant</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label><br />
                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <br />
                <div>
                    <label>Phone</label><br />
                    <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
                <br />
                <div>
                    <label>Email</label><br />
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <br />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Add</button>
                <button type="button" onClick={() => router.push(`/dashboard/teams/${id}/participants`)}>Cancel</button>
            </form>
        </div>
    );
}