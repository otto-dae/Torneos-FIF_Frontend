'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authHeaders } from '@/app/lib/auth';

export default function CreateTournamentPage() {
    const router = useRouter();
    const [disciplines, setDisciplines] = useState([]);
    const [form, setForm] = useState({ name: '', noteams: '', matchdays: '', discipline_id: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('http://127.0.0.1:8000/main/disciplines/')
            .then(res => res.json())
            .then(data => setDisciplines(data));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const res = await fetch('http://127.0.0.1:8000/main/tournaments/create/', {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({
                name: form.name,
                noteams: parseInt(form.noteams),
                matchdays: parseInt(form.matchdays),
                discipline_id: parseInt(form.discipline_id),
            }),
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
            <h1>Create Tournament</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label><br />
                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <br />
                <div>
                    <label>Number of Teams</label><br />
                    <input type="number" value={form.noteams} onChange={e => setForm({ ...form, noteams: e.target.value })} required />
                </div>
                <br />
                <div>
                    <label>Matchdays</label><br />
                    <input type="number" value={form.matchdays} onChange={e => setForm({ ...form, matchdays: e.target.value })} required />
                </div>
                <br />
                <div>
                    <label>Discipline</label><br />
                    <select value={form.discipline_id} onChange={e => setForm({ ...form, discipline_id: e.target.value })} required>
                        <option value="">Select discipline</option>
                        {disciplines.map((d: any) => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>
                </div>
                <br />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Create</button>
                <button type="button" onClick={() => router.push('/dashboard')}>Cancel</button>
            </form>
        </div>
    );
}