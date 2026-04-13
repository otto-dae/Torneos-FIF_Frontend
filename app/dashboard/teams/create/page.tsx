'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CreateTeamPage() {
    const router = useRouter();
    const [tournaments, setTournaments] = useState([]);
    const [form, setForm] = useState({ name: '', logo: '', tournament_id: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('http://127.0.0.1:8000/main/tournaments/')
            .then(res => res.json())
            .then(data => setTournaments(data));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const res = await fetch('http://127.0.0.1:8000/main/teams/create/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: form.name,
                logo: form.logo,
                tournament_id: parseInt(form.tournament_id),
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error);
            return;
        }

        router.push('/dashboard/teams');
    };

    return (
        <div>
            <h1>Create Team</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label><br />
                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <br />
                <div>
                    <label>Logo URL</label><br />
                    <input type="text" value={form.logo} onChange={e => setForm({ ...form, logo: e.target.value })} />
                </div>
                <br />
                <div>
                    <label>Tournament</label><br />
                    <select value={form.tournament_id} onChange={e => setForm({ ...form, tournament_id: e.target.value })} required>
                        <option value="">Select tournament</option>
                        {tournaments.map((t: any) => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                </div>
                <br />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Create</button>
                <button type="button" onClick={() => router.push('/dashboard/teams')}>Cancel</button>
            </form>
        </div>
    );
}