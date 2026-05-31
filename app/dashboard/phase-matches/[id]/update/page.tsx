'use client';

import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { authHeaders } from '@/app/lib/auth';
import Image from 'next/image';
import style from '../../../../../styles/centralized.module.css';

function UpdatePhaseMatchForm() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const searchParams = useSearchParams();
    const tournament_id = searchParams.get('tournament_id');
    const [form, setForm] = useState({ gf: '', gc: '', datematch: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const body: any = {};
        if (form.datematch) body.datematch = form.datematch;
        body.gf = form.gf !== '' ? parseInt(form.gf) : 0;
        body.gc = form.gc !== '' ? parseInt(form.gc) : 0;

        const res = await fetch(`http://127.0.0.1:8000/main/phase-matches/${id}/update/`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error);
            return;
        }

        router.push(`/dashboard/tournaments/${tournament_id}`);
    };

    return (
        <div>
            <header className={style.Header}>
                <Image src="/Graphics/Troyan.jpeg" alt="Logo" width={50} height={50} />
                <h1 className={style.text}>Editar Partido Eliminatorio</h1>
                <button className={style.btn2} onClick={() => router.push(`/dashboard/tournaments/${tournament_id}`)}>Volver</button>
            </header>
            <div className={style.mainContainer}>
                <div className={style.subContainer}>
                    <form onSubmit={handleSubmit} className={style.formContainer}>
                        <div>
                            <label className={style.textLabel}>Fecha</label><br />
                            <input className={style.textInput} type="date" value={form.datematch} onChange={e => setForm({ ...form, datematch: e.target.value })} />
                        </div>
                        <br />
                        <div>
                            <label className={style.textLabel}>Goles Local</label><br />
                            <input className={style.textInput} type="number" min="0" value={form.gf} onChange={e => setForm({ ...form, gf: e.target.value })} />
                        </div>
                        <br />
                        <div>
                            <label className={style.textLabel}>Goles Visitante</label><br />
                            <input className={style.textInput} type="number" min="0" value={form.gc} onChange={e => setForm({ ...form, gc: e.target.value })} />
                        </div>
                        <br />
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <button type="button" onClick={() => router.push(`/dashboard/tournaments/${tournament_id}`)} className={style.btnCancel}>
                            Cancelar
                        </button>
                        <button type="submit" className={style.btn2}>
                            Guardar
                        </button>
                    </form>
                </div>
            </div>
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