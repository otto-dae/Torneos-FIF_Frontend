'use client';

import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { authHeaders } from '@/app/lib/auth';

function CreateParticipantForm() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const searchParams = useSearchParams();
    const tournament_id = searchParams.get('tournament_id');
    const [form, setForm] = useState({ name: '', phone: '', email: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const res = await fetch('http://127.0.0.1:8000/main/participants/create/', {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({
                name: form.name,
                phone: form.phone,
                email: form.email,
                team_id: parseInt(id),
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error);
            return;
        }

        router.push(`/dashboard/teams/${id}/participants?tournament_id=${tournament_id}`);
    };

    return (
        <div>
            <h1>Agregar Participante</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre</label><br />
                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <br />
                <div>
                    <label>Telefono</label><br />
                    <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
                <br />
                <div>
                    <label>Email</label><br />
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <br />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Agregar</button>
                <button type="button" onClick={() => router.push(`/dashboard/teams/${id}/participants?tournament_id=${tournament_id}`)}>
                    Cancelar
                </button>
            </form>
        </div>
    );
}

export default function CreateParticipantPage() {
    return (
        <Suspense>
            <CreateParticipantForm />
        </Suspense>
    );
}