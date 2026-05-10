'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { authHeaders } from '@/app/lib/auth';

function CreateTeamForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tournament_id = searchParams.get('tournament_id') || '';
    const [tournaments, setTournaments] = useState([]);
    const [tournamentName, setTournamentName] = useState('');
    const [form, setForm] = useState({ name: '', logo: '', tournament_id });
    const [error, setError] = useState('');

    useEffect(() => {
        if (tournament_id) {
            fetch('http://127.0.0.1:8000/main/tournaments/')
                .then(res => res.json())
                .then(data => {
                    const t = data.find((t: any) => t.id === parseInt(tournament_id));
                    if (t) setTournamentName(`${t.name} — ${t.discipline}`);
                });
        } else {
            fetch('http://127.0.0.1:8000/main/tournaments/')
                .then(res => res.json())
                .then(data => setTournaments(data));
        }
    }, [tournament_id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const res = await fetch('http://127.0.0.1:8000/main/teams/create/', {
            method: 'POST',
            headers: authHeaders(),
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

        router.push(`/dashboard/tournaments/${form.tournament_id}`);
    };

    return (
        <div>
            <h1>Agregar Equipo</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre</label><br />
                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <br />
                <div>
                    <label>Logo URL</label><br />
                    <input type="text" value={form.logo} onChange={e => setForm({ ...form, logo: e.target.value })} />
                </div>
                <br />
                <div>
                    <label>Torneo</label><br />
                    {tournament_id ? (
                        <p>{tournamentName}</p>
                    ) : (
                        <select value={form.tournament_id} onChange={e => setForm({ ...form, tournament_id: e.target.value })} required>
                            <option value="">Seleccionar torneo</option>
                            {tournaments.map((t: any) => (
                                <option key={t.id} value={t.id}>{t.name} — {t.discipline}</option>
                            ))}
                        </select>
                    )}
                </div>
                <br />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Agregar</button>
                <button type="button" onClick={() => router.push(`/dashboard/tournaments/${tournament_id}`)}>
                    Cancelar
                </button>
            </form>
        </div>
    );
}

export default function CreateTeamPage() {
    return (
        <Suspense>
            <CreateTeamForm />
        </Suspense>
    );
}