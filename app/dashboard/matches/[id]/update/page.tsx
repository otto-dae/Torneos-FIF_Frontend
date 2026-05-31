'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authHeaders } from '@/app/lib/auth';
import styles from '../../../../../styles/centralized.module.css';
import Image from 'next/image';

export default function UpdateMatchPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const [form, setForm] = useState({ gf: '', gc: '', datematch: '' });
    const [match, setMatch] = useState<any>(null);
    const [error, setError] = useState('');

    const [tournamentId, setTournamentId] = useState('');

    useEffect(() => {
        fetch('http://127.0.0.1:8000/main/matches/')
            .then(res => res.json())
            .then(data => {
                const found = data.find((m: any) => m.id === parseInt(id));
                if (found) {
                    setMatch(found);
                    setTournamentId(found.tournament_id);
                    setForm({
                        gf: found.gf !== null ? String(found.gf) : '',
                        gc: found.gc !== null ? String(found.gc) : '',
                        datematch: found.datematch || '',
                    });
                }
            });
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
    
        const body: any = {};
        if (form.datematch) body.datematch = form.datematch;
        body.gf = form.gf !== '' ? parseInt(form.gf) : 0;
        body.gc = form.gc !== '' ? parseInt(form.gc) : 0;
    
        const res = await fetch(`http://127.0.0.1:8000/main/matches/${id}/update/`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(body),
        });
    
        const data = await res.json();
    
        if (!res.ok) {
            setError(data.error);
            return;
        }
    
        router.push(`/dashboard/tournaments/${tournamentId}`);
    };

    return (
        <div>
            <header className={styles.Header}>
                <Image src="/Graphics/Troyan.jpeg" alt="Logo" width={50} height={50} />
                <h1 className={styles.text}>Editar Partido</h1>
                <button onClick={() => router.push(`/dashboard/tournaments/${tournamentId}`)} className={styles.btn2}>
                     Back
                </button>
            </header>
            {match && <h1 className={styles.text2}> {match.team_1} vs {match.team_2} </h1>}
            <div className={styles.mainContainer}>
                <div className={styles.subContainer}>
                    <form onSubmit={handleSubmit} className={styles.formContainer}>
                        <div>
                            <label className={styles.textLabel}>Fecha</label><br />
                            <input className={styles.textInput} type="date" value={form.datematch} onChange={e => setForm({ ...form, datematch: e.target.value })} />
                        </div>
                        <br />
                        <div>
                            <label className={styles.textLabel}>Goles Local</label><br />
                            <input className={styles.textInput} type="number" min="0" value={form.gf} onChange={e => setForm({ ...form, gf: e.target.value })} />
                        </div>
                        <br />
                        <div>
                            <label className={styles.textLabel}>Goles Visitante</label><br />
                            <input className={styles.textInput} type="number" min="0" value={form.gc} onChange={e => setForm({ ...form, gc: e.target.value })} />
                        </div>
                        <br />
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <button type="button" onClick={() => router.push(`/dashboard/tournaments/${tournamentId}`)} className={styles.btnCancel}>
                            Cancelar
                        </button>
                        <button type="submit" className={styles.btn2}>
                            Guardar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}