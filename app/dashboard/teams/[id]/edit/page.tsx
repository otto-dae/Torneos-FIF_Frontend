'use client';

import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { authHeaders } from '@/app/lib/auth';
import Image from 'next/image';
import styles from '../../../../../styles/centralized.module.css';

function EditTeamForm() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const searchParams = useSearchParams();
    
    const tournament_id_param = searchParams.get('tournament_id');
    const tournament_id = tournament_id_param ? tournament_id_param.toString() : '';

    const [form, setForm] = useState({ name: '', logo: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id || !tournament_id) return;

        fetch(`http://127.0.0.1:8000/main/teams/?tournament_id=${tournament_id}`)
            .then(res => res.json())
            .then(data => {
                const currentTeam = data.find((t: any) => t.id === parseInt(id));
                if (currentTeam) {
                    setForm({ name: currentTeam.name, logo: currentTeam.logo || '' });
                } else {
                    setError('No se encontró el equipo.');
                }
                setIsLoading(false);
            })
            .catch(err => {
                setError('Error al cargar los datos del equipo.');
                setIsLoading(false);
            });
    }, [id, tournament_id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch(`http://127.0.0.1:8000/main/teams/${id}/update/`, {
                method: 'POST', 
                headers: authHeaders(),
                body: JSON.stringify({
                    name: form.name,
                    logo: form.logo,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Ocurrió un error al actualizar.');
                return;
            }

            router.push(`/dashboard/teams?tournament_id=${tournament_id}`);
        } catch (err) {
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
                <h1 className={styles.text}>Editar Equipo</h1>
                <button 
                    onClick={() => router.push(`/dashboard/teams?tournament_id=${tournament_id}`)} 
                    className={styles.btn2}
                >
                    Back
                </button>
            </header>

            <div className={styles.mainContainer}>
                <div className={styles.subContainer}>
                    {isLoading ? (
                        <p style={{ textAlign: 'center', marginTop: '20px' }}>Cargando datos del equipo...</p>
                    ) : (
                        <form onSubmit={handleSubmit} className={styles.formContainer}>
                            <div>
                                <label className={styles.textLabel}>Nombre del Equipo</label><br />
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
                                <label className={styles.textLabel}>URL del Logo</label><br />
                                <input 
                                    type="url" 
                                    value={form.logo} 
                                    onChange={e => setForm({ ...form, logo: e.target.value })} 
                                    className={styles.textInput}
                                    placeholder="https://ejemplo.com/logo.png"
                                />
                            </div>
                            <br />
                            {form.logo && (
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                                    <img 
                                        src={form.logo} 
                                        alt="Vista previa del logo" 
                                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%' }}
                                        onError={(e) => (e.currentTarget.style.display = 'none')}
                                    />
                                </div>
                            )}

                            {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', width: '100%' }}>
                                <button 
                                    type="button" 
                                    onClick={() => router.push(`/dashboard/teams?tournament_id=${tournament_id}`)} 
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

export default function EditTeamPage() {
    return (
        <Suspense fallback={<p>Cargando interfaz...</p>}>
            <EditTeamForm />
        </Suspense>
    );
}