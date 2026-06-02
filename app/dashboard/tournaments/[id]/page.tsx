'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authHeaders } from '@/app/lib/auth';
import Image from 'next/image';
import style from '../../../../styles/centralized.module.css';

export default function TournamentPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [tournament, setTournament] = useState<any>(null);
    const [teams, setTeams] = useState([]);
    const [matches, setMatches] = useState([]);
    const [phases, setPhases] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState('');

useEffect(() => {
    if (!id) return;
    setIsAdmin(document.cookie.includes('token='));

        Promise.all([
            fetch(`http://127.0.0.1:8000/main/tournaments/`).then(r => r.json()),
            fetch(`http://127.0.0.1:8000/main/teams/?tournament_id=${id}`).then(r => r.json()),
            fetch(`http://127.0.0.1:8000/main/matches/?tournament_id=${id}`).then(r => r.json()),
            fetch(`http://127.0.0.1:8000/main/tournaments/${id}/phases/`).then(r => r.json()),
        ]).then(([tournamentsData, teamsData, matchesData, phasesData]) => {
            const t = tournamentsData.find((t: any) => t.id === parseInt(id));
            console.log('tournament data:', t);
            setTournament(t);
            setTeams(teamsData.sort((a: any, b: any) => b.points - a.points));
            setMatches(matchesData);
            setPhases(phasesData);
        });
    }, [id]);

    const handleStartPhase = async () => {
        setError('');
        const res = await fetch(`http://127.0.0.1:8000/main/tournaments/${id}/start-phase/`, {
            method: 'POST',
            headers: authHeaders(),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error); return; }
        window.location.reload();
    };

    const handleFinishTournament = async () => {
        setError('');
        const res = await fetch(`http://127.0.0.1:8000/main/tournaments/${id}/finish/`, {
            method: 'POST',
            headers: authHeaders(),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error); return; }
        window.location.reload();
    };

    const groupedByDate: any = {};
    matches.forEach((m: any) => {
        const key = m.datematch || 'Sin fecha';
        if (!groupedByDate[key]) groupedByDate[key] = [];
        groupedByDate[key].push(m);
    });

    const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
        if (a === 'Sin fecha') return 1;
        if (b === 'Sin fecha') return -1;
        return a.localeCompare(b);
    });

    if (!tournament) return <p>Cargando...</p>;

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
                <h1 className={style.text}>Partidos — {tournament.name} — {tournament.discipline}</h1>
                <button className={style.btn} onClick={() => router.push('/dashboard')} >
                    Back
                </button>
            </header>
            
                {isAdmin && (
                    <div className={style.secondaryDiv}>
                        <>
                            <button onClick={() => router.push(`/dashboard/teams?tournament_id=${id}`)} className={style.btn2}>
                                Equipos
                            </button>
                            {!tournament.phase_started && (
                                <button onClick={handleStartPhase} className={style.btn2}>
                                    Terminar Fase de Tabla
                                </button>
                            )}
                            {tournament.phase_started && !tournament.finished && (
                                <button onClick={handleFinishTournament} className={style.btn2}>
                                    Terminar Torneo
                                </button>
                            )}
                        </>
                    </div>
                )}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            
            {tournament.finished && (
                <div className={style.secondaryDiv}>
                    <h2 className={style.text2}>Campeon: {tournament.winner}</h2>
                </div>
            )}
            <div className={style.secondaryDiv}>
                {sortedDates.map(date => (
                    <div key={date}>
                        <h3>{date}</h3>
                        <table className={style.table}>
                            <thead>
                                <tr className={style.tableHead}>
                                    <th className={style.left}>Local</th>
                                    <th>Resultado</th>
                                    {isAdmin && !tournament.finished ? (
                                        <th>Visitante</th>
                                    ) : (
                                        <th className={style.right}>Visitante</th>
                                    )}

                                    {isAdmin && !tournament.finished && <th className={style.right}>Acciones</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {groupedByDate[date].map((m: any) => (
                                    <tr key={m.id}>
                                        <td>
                                            <span
                                                onClick={() => router.push(`/dashboard/teams/${m.team_1_id}/participants?tournament_id=${id}`)}
                                                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                            >
                                                {m.team_1}
                                            </span>
                                        </td>
                                        <td>{m.gf !== null ? `${m.gf} - ${m.gc}` : 'Pendiente'}</td>
                                        <td>
                                            <span
                                                onClick={() => router.push(`/dashboard/teams/${m.team_2_id}/participants?tournament_id=${id}`)}
                                                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                            >
                                                {m.team_2}
                                            </span>
                                        </td>
                                        {isAdmin && !tournament.finished && (
                                            <td>
                                                <button onClick={() => router.push(`/dashboard/matches/${m.id}/update?tournament_id=${id}`)} className={style.btnEdit}>
                                                    Editar
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <br />
                    </div>
                ))}
            </div>

            {phases.length > 0 && (
                <>
                    <h2 className={style.text2}>Fase Eliminatoria</h2>
                    <div className={style.secondaryDiv}>
                        {phases.map((phase: any) => (
                            <div key={phase.id}>
                                <h3>{phase.name}</h3>
                                <table className={style.table}>
                                    <thead>
                                        <tr className={style.tableHead}>
                                            <th className={style.left}>Local</th>
                                            <th>Resultado</th>
                                            {isAdmin && !tournament.finished ? (
                                                <th>Visitante</th>
                                            ) : (
                                                <th className={style.right}>Visitante</th>
                                            )}
                                            {isAdmin && !tournament.finished && <th className={style.right}>Acciones</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {phase.matches.map((m: any) => (
                                            <tr key={m.id}>
                                                <td>
                                                    <span
                                                        onClick={() => router.push(`/dashboard/teams/${m.team_1_id}/participants?tournament_id=${id}`)}
                                                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                                    >
                                                        {m.team_1}
                                                    </span>
                                                </td>
                                                <td>{m.gf !== null ? `${m.gf} - ${m.gc}` : 'Pendiente'}</td>
                                                <td>
                                                    <span
                                                        onClick={() => router.push(`/dashboard/teams/${m.team_2_id}/participants?tournament_id=${id}`)}
                                                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                                    >
                                                        {m.team_2}
                                                    </span>
                                                </td>
                                                {isAdmin && !tournament.finished && (
                                                    <td>
                                                        <button onClick={() => router.push(`/dashboard/phase-matches/${m.id}/update?tournament_id=${id}`)} className={style.btnEdit}>
                                                            Editar
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <br />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}