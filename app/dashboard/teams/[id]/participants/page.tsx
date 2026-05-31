'use client';

import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { authHeaders } from '@/app/lib/auth'; 
import styles from '../../../../../styles/centralized.module.css'; 
import Image from 'next/image';

function ParticipantsContent() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const searchParams = useSearchParams();
    const tournament_id = searchParams.get('tournament_id');
    const [participants, setParticipants] = useState([]);
    const [teamName, setTeamName] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        setIsAdmin(document.cookie.includes('token='));
        fetch(`http://127.0.0.1:8000/main/participants/?team_id=${id}`)
            .then(res => res.json())
            .then(data => {
                setParticipants(data);
                if (data.length > 0) setTeamName(data[0].team);
            });
    }, [id]);

    const handleDeleteParticipant = async (participantId: number) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este participante?')) return;

        try {
            const res = await fetch(`http://127.0.0.1:8000/main/participants/${participantId}/delete/`, {
                method: 'POST', 
                headers: authHeaders(),
            });

            if (res.ok) {
                setParticipants(participants.filter((p: any) => p.id !== participantId));
            } else {
                const data = await res.json();
                alert(data.error || 'Ocurrió un error al eliminar el participante.');
            }
        } catch (err) {
            alert('Error de conexión con el servidor.');
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
                <h1 className={styles.text}>{teamName ? `${teamName} — Participantes` : 'Participantes'}</h1>
                <button 
                    onClick={() => router.push(`/dashboard/teams?tournament_id=${tournament_id}`)} 
                    className={styles.btn2}
                >
                    Back
                </button>
            </header>

            <div className={styles.mainContainer} style={{ height: 'auto', padding: '40px 20px' }}>
                <div className={styles.secondaryDiv} style={{ width: '90%' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                        {isAdmin && (
                            <button 
                                onClick={() => router.push(`/dashboard/teams/${id}/participants/create?tournament_id=${tournament_id}`)} 
                                className={styles.btn2}
                                style={{ margin: 0 }}
                            >
                                + Agregar Participante
                            </button>
                        )}
                    </div>

                    <table className={styles.table} style={{ width: '100%' }}>
                        <thead>
                            <tr className={styles.tableHead}>
                                <th className={styles.left}>Nombre</th>
                                <th>Teléfono</th>
                                {isAdmin ? <th>Email</th> : <th className={styles.right}>Email</th>}
                                {isAdmin && <th className={styles.right}>Acciones</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {participants.map((p: any) => (
                                <tr key={p.id}>
                                    <td>{p.name}</td>
                                    <td>{p.phone}</td>
                                    <td>{p.email}</td>
                                    {isAdmin && (
                                        <td>
                                            <button 
                                                onClick={() => router.push(`/dashboard/teams/${id}/participants/${p.id}/edit?tournament_id=${tournament_id}`)} 
                                                className={styles.btnEdit}
                                                style={{ marginRight: '10px' }}
                                            >
                                                Editar
                                            </button>
                                            
                                            <button 
                                                onClick={() => handleDeleteParticipant(p.id)} 
                                                className={styles.btnCancel}
                                                style={{ margin: 0, padding: '6px 20px' }}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {participants.length === 0 && (
                        <p style={{ marginTop: '20px' }}>No hay participantes registrados en este equipo aún.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ParticipantsPage() {
    return (
        <Suspense fallback={<p>Cargando participantes...</p>}>
            <ParticipantsContent />
        </Suspense>
    );
}