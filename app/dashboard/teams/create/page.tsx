'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { authHeaders } from '@/app/lib/auth';
import styles from '../../../../styles/centralized.module.css';
import Image from 'next/image';

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
            <header className={styles.Header}>
                <Image
                    src="/Graphics/Troyan.png"
                    alt="Logo"
                    width={50}
                    height={50}
                    onClick={() => router.push('/dashboard')}
                    style={{ cursor: 'pointer' }}
                />
                <h1 className={styles.text}>Agregar Equipo</h1>
                <button onClick={() => router.push(`/dashboard/tournaments/${tournament_id}`)} className={styles.btn2}>
                     Back
                </button>
            </header>
            <div className={styles.mainContainer}>
                <div className={styles.subContainer}>
                    <form onSubmit={handleSubmit} className={styles.formContainer}>
                        <div>
                            <label className={styles.textLabel}>Torneo</label><br />
                            {tournament_id ? (
                                <p>{tournamentName}</p>
                            ) : (
                                <select className={styles.textInput} value={form.tournament_id} onChange={e => setForm({ ...form, tournament_id: e.target.value })} required>
                                    <option value="">Seleccionar torneo</option>
                                    {tournaments.map((t: any) => (
                                        <option key={t.id} value={t.id}>{t.name} — {t.discipline}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <br />
                        <div>
                            <label className={styles.textLabel}>Nombre</label><br />
                            <input className={styles.textInput} type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                        </div>

                        <div>
                            <label className={styles.textLabel}>Logo URL</label><br />
                            <input className={styles.textInput} type="text" value={form.logo} onChange={e => setForm({ ...form, logo: e.target.value })} />
                        </div>
                        <br />
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <button type="button" onClick={() => router.push(`/dashboard/teams?tournament_id=${tournament_id}`)} className={styles.btnCancel}>
                            Cancelar
                        </button>
                        <button type="submit" className={styles.btn2}>Agregar</button>
                    </form>
                </div>
            </div>
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