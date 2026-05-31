'use client';

import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { authHeaders } from '@/app/lib/auth';
import Image from 'next/image';
import styles from '../../../../../../styles/centralized.module.css';

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
            <header className={styles.Header}>
                <Image
                    src="/Graphics/Troyan.png"
                    alt="Logo"
                    width={50}
                    height={50}
                    onClick={() => router.push('/dashboard')}
                    style={{ cursor: 'pointer' }}
                />
                <h1 className={styles.text}>Agregar Participante</h1>
                <button 
                    onClick={() => router.push(`/dashboard/teams/${id}/participants?tournament_id=${tournament_id}`)} 
                    className={styles.btn2}
                >
                    Back
                </button>
            </header>

            <div className={styles.mainContainer}>
                <div className={styles.subContainer}>
                    <form onSubmit={handleSubmit} className={styles.formContainer}>
                        <div>
                            <label className={styles.textLabel}>Nombre</label><br />
                            <input 
                                type="text" 
                                value={form.name} 
                                onChange={e => setForm({ ...form, name: e.target.value })} 
                                required 
                                className={styles.textInput} 
                            />
                        </div>
                        <br />
                        <div>
                            <label className={styles.textLabel}>Teléfono</label><br />
                            <input 
                                type="text" 
                                value={form.phone} 
                                onChange={e => setForm({ ...form, phone: e.target.value })} 
                                className={styles.textInput} 
                            />
                        </div>
                        <br />
                        <div>
                            <label className={styles.textLabel}>Email</label><br />
                            <input 
                                type="email" 
                                value={form.email} 
                                onChange={e => setForm({ ...form, email: e.target.value })} 
                                className={styles.textInput} 
                            />
                        </div>
                        <br />
                        
                        {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', width: '100%' }}>
                            <button 
                                type="button" 
                                onClick={() => router.push(`/dashboard/teams/${id}/participants?tournament_id=${tournament_id}`)} 
                                className={styles.btnCancel}
                                style={{ margin: 0 }}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                className={styles.btn2}
                                style={{ margin: 0 }}
                            >
                                Agregar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function CreateParticipantPage() {
    return (
        <Suspense fallback={<p>Cargando formulario...</p>}>
            <CreateParticipantForm />
        </Suspense>
    );
}