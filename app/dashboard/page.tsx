'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authHeaders } from '@/app/lib/auth';
import styles from '../../styles/centralized.module.css';
import Image from 'next/image';

export default function DashboardPage() {
    const router = useRouter();
    const [tournaments, setTournaments] = useState([]);
    const [teamsByTournament, setTeamsByTournament] = useState<any>({});
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        setIsAdmin(document.cookie.includes('token='));

        Promise.all([
            fetch('http://127.0.0.1:8000/main/tournaments/').then(res => res.json()),
            fetch('http://127.0.0.1:8000/main/teams/').then(res => res.json()),
        ]).then(([tournamentsData, teamsData]) => {
            setTournaments(tournamentsData);
            const grouped: any = {};
            teamsData.forEach((t: any) => {
                if (!grouped[t.tournament_id]) grouped[t.tournament_id] = [];
                grouped[t.tournament_id].push(t);
            });
            Object.keys(grouped).forEach(tid => {
                grouped[tid].sort((a: any, b: any) => b.points - a.points);
            });
            setTeamsByTournament(grouped);
        });
    }, []);

    const handleLogout = () => {
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        window.location.href = '/dashboard';
    };

    const handleDeleteTournament = async (tournamentId: number) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este torneo? Toda la información vinculada desaparecerá. Esta acción no se puede deshacer.')) return;

        try {
            const res = await fetch(`http://127.0.0.1:8000/main/tournaments/${tournamentId}/delete/`, {
                method: 'POST',
                headers: authHeaders(),
            });

            if (res.ok) {
                setTournaments(tournaments.filter((t: any) => t.id !== tournamentId));
            } else {
                const data = await res.json();
                alert(data.error || 'Ocurrió un error al intentar eliminar el torneo.');
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
                <button onClick={() => router.push('/dashboard/logs')} className={styles.btn}>
                    Historial
                </button>
                <h1 className={styles.text}>Torneos FIF</h1>
                {isAdmin ? (
                    <button onClick={handleLogout} className={styles.btn}>
                        Logout
                    </button>
                ) : (
                    <button onClick={() => router.push('/login')} className={styles.btn}>
                        Admin
                    </button>
                )}
            </header>
            <hr />
            {isAdmin && (
                <div className={styles.secondaryDiv}>
                    <button onClick={() => router.push('/dashboard/tournaments/create')} className={styles.btn2}>
                        Crear Torneo
                    </button>
                    <button onClick={() => router.push('/dashboard/administrators/create')} className={styles.btn2}>
                        Crear Admin
                    </button>
                </div>
            )}
            
            {tournaments.map((t: any) => (
                <div key={t.id} className={styles.secondaryDiv}>
                    <h2 className={styles.text2}>{t.name} — {t.discipline}</h2>
                    {t.finished && <p>Campeon: {t.winner}</p>}
                    <table className={styles.table}>
                        <thead>
                            <tr className={styles.tableHead}>
                                <th className={styles.left}>#</th>
                                <th>Equipo</th>
                                <th>PJ</th>
                                <th>PG</th>
                                <th>PE</th>
                                <th>PP</th>
                                <th>GF</th>
                                <th>GC</th>
                                <th className={styles.right}>Pts</th>
                            </tr>
                        </thead>
                        <tbody >
                            {(teamsByTournament[t.id] || []).map((team: any, index: number) => (
                                <tr key={team.id} >
                                    <td>{index + 1}</td>
                                    <td>{team.name}</td>
                                    <td>{team.pj}</td>
                                    <td>{team.pg}</td>
                                    <td>{team.pe}</td>
                                    <td>{team.pp}</td>
                                    <td>{team.gf}</td>
                                    <td>{team.gc}</td>
                                    <td>{team.points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                        {isAdmin && (
                            <button onClick={() => handleDeleteTournament(t.id)} className={styles.btnCancel}>
                                Eliminar Torneo
                            </button>
                        )}
                        
                        <button onClick={() => router.push(`/dashboard/tournaments/${t.id}`)} className={styles.btn} >
                            Ver Torneo
                        </button>
                        
                        
                    </div>
                    
                </div>
            ))}
        </div>
    );
}