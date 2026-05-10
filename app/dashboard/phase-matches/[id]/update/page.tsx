'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authHeaders } from '@/app/lib/auth';

export default function UpdatePhaseMatchPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
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
    
        router.back();
    };
    return (
        <div>
            <h1>Editar Partido Eliminatorio</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Fecha</label><br />
                    <input type="date" value={form.datematch} onChange={e => setForm({ ...form, datematch: e.target.value })} />
                </div>
                <br />
                <div>
                    <label>Goles Local</label><br />
                    <input type="number" min="0" value={form.gf} onChange={e => setForm({ ...form, gf: e.target.value })} />
                </div>
                <br />
                <div>
                    <label>Goles Visitante</label><br />
                    <input type="number" min="0" value={form.gc} onChange={e => setForm({ ...form, gc: e.target.value })} />
                </div>
                <br />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Guardar</button>
                <button type="button" onClick={() => router.back()}>Cancelar</button>
            </form>
        </div>
    );
}