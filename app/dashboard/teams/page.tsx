'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { authHeaders } from '@/app/lib/auth';
import Image from 'next/image';
import styles from '../../../styles/centralized.module.css';

function TeamsList() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const tournament_id_param = searchParams.get('tournament_id');
    const tournament_id = tournament_id_param ? tournament_id_param.toString() : '';

    const [teams, setTeams] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!tournament_id) return;

        fetch(`http://127.0.0.1:8000/main/teams/?tournament_id=${tournament_id}`)
            .then(res => res.json())
            .then(data => setTeams(data))
            .catch(err => setError('Error al cargar los equipos'));
    }, [tournament_id]); 

    const handleDelete = async (teamId: number) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este equipo? Esta acción no se puede deshacer.')) return;
        
        setError('');

        try {
            const res = await fetch(`http://127.0.0.1:8000/main/teams/${teamId}/delete/`, {
                method: 'POST', 
                headers: authHeaders(), 
            });

            if (res.ok) {
                setTeams(teams.filter((t: any) => t.id !== teamId));
            } else {
                const data = await res.json();
                setError(data.error || 'Ocurrió un error al intentar eliminar el equipo.');
            }
        } catch (err) {
            setError('Error de conexión con el servidor. Revisa si el backend está encendido.');
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
                <h1 className={styles.text}>Supervisar Equipos</h1>
                <button onClick={() => router.push(`/dashboard/tournaments/${tournament_id}`)} className={styles.btn2}>
                    Back
                </button>
            </header>

            <div className={styles.mainContainer} style={{ height: 'auto', padding: '40px 20px' }}>
                <div className={styles.secondaryDiv} style={{ width: '90%' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h2 className={styles.text2}>Equipos Inscritos</h2>
                        <button 
                            onClick={() => router.push(`/dashboard/teams/create?tournament_id=${tournament_id}`)} 
                            className={styles.btn2}
                            style={{ margin: 0 }}
                        >
                            + Agregar Equipo
                        </button>
                    </div>

                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <table className={styles.table} style={{ width: '100%' }}>
                        <thead>
                            <tr className={styles.tableHead}>
                                <th className={styles.left}>Logo</th>
                                <th>Nombre</th>
                                <th className={styles.right}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teams.map((team: any) => (
                                <tr key={team.id}>
                                    <td>
                                        {team.logo ? (
                                            <img src={team.logo} alt="logo" width={40} height={40} style={{ borderRadius: '50%' }}/>
                                        ) : 'Sin logo'}
                                    </td>
                                    <td>
                                        <span
                                            onClick={() => router.push(`/dashboard/teams/${team.id}/participants?tournament_id=${tournament_id}`)}
                                            style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                        >
                                            {team.name}
                                        </span>
                                    </td>
                                    <td>
                                        <button 
                                            onClick={() => router.push(`/dashboard/teams/${team.id}/participants?tournament_id=${tournament_id}`)} 
                                            className={styles.btnEdit}
                                            style={{ marginRight: '10px' }}
                                        >
                                            Integrantes
                                        </button>
                                        <button 
                                            onClick={() => router.push(`/dashboard/teams/${team.id}/edit?tournament_id=${tournament_id}`)} 
                                            className={styles.btnEdit}
                                            style={{ marginRight: '10px' }}
                                        >
                                            Editar
                                        </button>
                                        
                                        <button 
                                            onClick={() => handleDelete(team.id)} 
                                            className={styles.btnCancel}
                                            style={{ margin: 0, padding: '6px 20px' }}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {teams.length === 0 && (
                        <p style={{ marginTop: '20px' }}>No hay equipos registrados en este torneo aún.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function TeamsPage() {
    return (
        <Suspense fallback={<p>Cargando interfaz...</p>}>
            <TeamsList />
        </Suspense>
    );
}