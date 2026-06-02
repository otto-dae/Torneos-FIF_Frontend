'use client';

import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useState, Suspense, useEffect } from 'react';
import { authHeaders } from '@/app/lib/auth';
import Image from 'next/image';
import style from '../../../../../styles/centralized.module.css';
import { match } from 'assert/strict';


function UpdatePhaseMatchForm() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const searchParams = useSearchParams();
    const tournament_id = searchParams.get('tournament_id');
    const [form, setForm] = useState({ gf: '', gc: '', datematch: '' });
    const [error, setError] = useState('');
    const [mode, setMode] = useState<'fecha' | 'puntuacion' | null>(null);
    const [match, setMatch] = useState<any>(null);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/main/tournaments/${tournament_id}/phases/`)
            .then(res => res.json())
            .then(phases => {
                for (const phase of phases) {
                    const found = phase.matches.find((m: any) => m.id === parseInt(id));
                    if (found) {
                        setMatch(found);
                        setForm({
                            gf: found.gf !== null ? String(found.gf) : '',
                            gc: found.gc !== null ? String(found.gc) : '',
                            datematch: found.datematch || '',
                        });
                        break;
                    }
                }
            });
    }, [id, tournament_id]);

    const handleSubmitFecha = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const body: any = {};
    if (form.datematch) body.datematch = form.datematch;

    const res = await fetch(`http://127.0.0.1:8000/main/matches/${id}/update/`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); return; }
    router.push(`/dashboard/tournaments/${tournament_id}`);
    };

    const handleSubmitPuntuacion = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const body: any = {
            gf: form.gf !== '' ? parseInt(form.gf) : 0,
            gc: form.gc !== '' ? parseInt(form.gc) : 0,
        };

        const res = await fetch(`http://127.0.0.1:8000/main/matches/${id}/update/`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error); return; }
        router.push(`/dashboard/tournaments/${tournament_id}`);
    };

    return (
        <div>
            <header className={style.Header}>
                <Image
                    src="/Graphics/Troyan.png"
                    alt="Logo"
                    width={50}
                    height={50}
                    onClick={() => router.push('/dashboard')}
                    style={{ cursor: 'pointer' }}
                />
                <h1 className={style.text}>Editar Partido Eliminatorio — {match?.team_1} vs {match?.team_2}</h1>
                <button className={style.btn2} onClick={() => router.push(`/dashboard/tournaments/${tournament_id}`)}>Back</button>
            </header>
                    {!mode && (
                        <div className={style.secondaryDiv}>
                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px' }}>
                            <button onClick={() => setMode('fecha')} className={style.btn2}>
                                Editar Fecha
                            </button>
                            <button onClick={() => setMode('puntuacion')} className={style.btn2}>
                                Editar Puntuación
                            </button>
                        </div>
                        </div>
                    )}
                    {mode === 'fecha' && (
                        <div className={style.mainContainer}>
                            <div className={style.subContainer}>
                                <form onSubmit={handleSubmitFecha} className={style.formContainer}>
                                    <div>
                                        <label className={style.textLabel}>Fecha</label><br />
                                        <input className={style.textInput} type="date" value={form.datematch}
                                            onChange={e => setForm({ ...form, datematch: e.target.value })} />
                                    </div>
                                    <br />
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <button type="button" onClick={() => setMode(null)} className={style.btnCancel} style={{ margin: 0 }}>
                                            Atrás
                                        </button>
                                        <button type="submit" className={style.btn2} style={{ margin: 0 }}>
                                            Guardar Fecha
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                    {mode === 'puntuacion' && (
                        <div className={style.mainContainer}>
                            <div className={style.subContainer}>
                                <form onSubmit={handleSubmitPuntuacion} className={style.formContainer}>
                                    <div>
                                        <label className={style.textLabel}>Goles Local — {match?.team_1 ?? 'Local'} </label><br />
                                        <input className={style.textInput} type="number" min="0" value={form.gf}
                                            onChange={e => setForm({ ...form, gf: e.target.value })} />
                                    </div>
                                    <br />
                                    <div>
                                        <label className={style.textLabel}>Goles Visitante — {match?.team_2 ?? 'Visitante'}</label><br />
                                        <input className={style.textInput} type="number" min="0" value={form.gc}
                                            onChange={e => setForm({ ...form, gc: e.target.value })} />
                                    </div>
                                    <br />
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <button type="button" onClick={() => setMode(null)} className={style.btnCancel} style={{ margin: 0 }}>
                                            Atrás
                                        </button>
                                        <button type="submit" className={style.btn2} style={{ margin: 0 }}>
                                            Guardar Puntuación
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
            </div>

     );
}

export default function UpdatePhaseMatchPage() {
    return (
        <Suspense>
            <UpdatePhaseMatchForm />
        </Suspense>
    );
}