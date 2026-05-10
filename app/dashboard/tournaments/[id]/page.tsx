'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authHeaders } from '@/app/lib/auth';

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
            <h1>{tournament.name} — {tournament.discipline}</h1>
            <button onClick={() => router.push('/dashboard')}>Back</button>
            {isAdmin && (
                <>
                    <button onClick={() => router.push(`/dashboard/teams/create?tournament_id=${id}`)}>Agregar Equipo</button>
                    {!tournament.phase_started && (
                        <button onClick={handleStartPhase}>Terminar Fase de Tabla</button>
                    )}
                    {tournament.phase_started && !tournament.finished && (
                        <button onClick={handleFinishTournament}>Terminar Torneo</button>
                    )}
                </>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {tournament.finished && (
                <h2>Campeon: {tournament.winner}</h2>
            )}

            <hr />
            <h2>Clasificacion</h2>
            <table border={1} cellPadding={8}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Equipo</th>
                        <th>PJ</th>
                        <th>PG</th>
                        <th>PE</th>
                        <th>PP</th>
                        <th>GF</th>
                        <th>GC</th>
                        <th>Pts</th>
                    </tr>
                </thead>
                <tbody>
                    {teams.map((t: any, index: number) => (
                        <tr key={t.id}>
                            <td>{index + 1}</td>
                            <td>
                                <span
                                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                    onClick={() => router.push(`/dashboard/teams/${t.id}/participants?tournament_id=${id}`)}
                                >
                                    {t.name}
                                </span>
                            </td>
                            <td>{t.pj}</td>
                            <td>{t.pg}</td>
                            <td>{t.pe}</td>
                            <td>{t.pp}</td>
                            <td>{t.gf}</td>
                            <td>{t.gc}</td>
                            <td>{t.points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <hr />
            <h2>Partidos</h2>
            {sortedDates.map(date => (
                <div key={date}>
                    <h3>{date}</h3>
                    <table border={1} cellPadding={8}>
                        <thead>
                            <tr>
                                <th>Local</th>
                                <th>Resultado</th>
                                <th>Visitante</th>
                                {isAdmin && !tournament.finished && <th>Acciones</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {groupedByDate[date].map((m: any) => (
                                <tr key={m.id}>
                                    <td>{m.team_1}</td>
                                    <td>{m.gf !== null ? `${m.gf} - ${m.gc}` : 'Pendiente'}</td>
                                    <td>{m.team_2}</td>
                                    {isAdmin && !tournament.finished && (
                                        <td>
                                            <button onClick={() => router.push(`/dashboard/matches/${m.id}/update?tournament_id=${id}`)}>
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

            {phases.length > 0 && (
                <>
                    <hr />
                    <h2>Fase Eliminatoria</h2>
                    {phases.map((phase: any) => (
                        <div key={phase.id}>
                            <h3>{phase.name}</h3>
                            <table border={1} cellPadding={8}>
                                <thead>
                                    <tr>
                                        <th>Local</th>
                                        <th>Resultado</th>
                                        <th>Visitante</th>
                                        {isAdmin && !tournament.finished && <th>Acciones</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {phase.matches.map((m: any) => (
                                        <tr key={m.id}>
                                            <td>{m.team_1}</td>
                                            <td>{m.gf !== null ? `${m.gf} - ${m.gc}` : 'Pendiente'}</td>
                                            <td>{m.team_2}</td>
                                            {isAdmin && !tournament.finished && (
                                                <td>
                                                    <button onClick={() => router.push(`/dashboard/phase-matches/${m.id}/update?tournament_id=${id}`)}>
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
                </>
            )}
        </div>
    );
}