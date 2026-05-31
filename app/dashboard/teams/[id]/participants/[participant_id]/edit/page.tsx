'use client';

import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { authHeaders } from '@/app/lib/auth';
import Image from 'next/image';
import styles from '../../../../../../../styles/centralized.module.css';

function EditParticipantForm() {
    const router = useRouter();
    const params = useParams();
    const team_id = params.id as string;
    const participant_id = params.participant_id as string;
    const searchParams = useSearchParams();

    const tournament_id = searchParams.get('tournament_id') ?? '';

    const [form, setForm] = useState({ name: '', phone: '', email: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!team_id || !participant_id) return;

        fetch(`http://127.0.0.1:8000/main/participants/?team_id=${team_id}`)
            .then(res => res.json())
            .then(data => {
                const current = data.find((p: any) => p.id === parseInt(participant_id));
                if (current) {
                    setForm({
                        name: current.name ?? '',
                        phone: current.phone ?? '',
                        email: current.email ?? '',
                    });
                } else {
                    setError('No se encontró el participante.');
                }
                setIsLoading(false);
            })
            .catch(() => {
                setError('Error al cargar los datos del participante.');
                setIsLoading(false);
            });
    }, [team_id, participant_id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch(`http://127.0.0.1:8000/main/participants/${participant_id}/update/`, {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({
                    name: form.name,
                    phone: form.phone,
                    email: form.email,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Ocurrió un error al actualizar.');
                return;
            }

            router.push(`/dashboard/teams/${team_id}/participants?tournament_id=${tournament_id}`);
        } catch {
            setError('Error de conexión con el servidor.');
        }
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
                <h1 className={styles.text}>Editar Participante</h1>
                <button
                    onClick={() => router.push(`/dashboard/teams/${team_id}/participants?tournament_id=${tournament_id}`)}
                    className={styles.btn2}
                >
                    Back
                </button>
            </header>

            <div className={styles.mainContainer}>
                <div className={styles.subContainer}>
                    {isLoading ? (
                        <p style={{ textAlign: 'center', marginTop: '20px' }}>Cargando datos del participante...</p>
                    ) : (
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
                                    placeholder="10 dígitos"
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
                                    placeholder="correo@ejemplo.com"
                                />
                            </div>
                            <br />

                            {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', width: '100%' }}>
                                <button
                                    type="button"
                                    onClick={() => router.push(`/dashboard/teams/${team_id}/participants?tournament_id=${tournament_id}`)}
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
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function EditParticipantPage() {
    return (
        <Suspense fallback={<p>Cargando interfaz...</p>}>
            <EditParticipantForm />
        </Suspense>
    );
}