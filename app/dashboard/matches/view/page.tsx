'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { authHeaders } from '@/app/lib/auth';

function MatchesView() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tournament_id = searchParams.get('tournament_id');
    const [matches, setMatches] = useState([]);
    const [phases, setPhases] = useState([]);
    const [tournamentName, setTournamentName] = useState('');
    const [phaseStarted, setPhaseStarted] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState('');
    const [teams, setTeams] = useState([]);
    const [finished, setFinished] = useState(false);
    const [winner, setWinner] = useState('');

    useEffect(() => {
        setIsAdmin(document.cookie.includes('token='));

        Promise.all([
            fetch(`http://127.0.0.1:8000/main/matches/?tournament_id=${tournament_id}`).then(r => r.json()),
            fetch(`http://127.0.0.1:8000/main/tournaments/${tournament_id}/phases/`).then(r => r.json()),
            fetch(`http://127.0.0.1:8000/main/teams/?tournament_id=${tournament_id}`).then(r => r.json()),
            fetch(`http://127.0.0.1:8000/main/tournaments/`).then(r => r.json()),
        ]).then(([matchesData, phasesData, teamsData, tournamentsData]) => {
            setMatches(matchesData);
            setPhases(phasesData);
            setTeams(teamsData.sort((a: any, b: any) => b.points - a.points));
            if (matchesData.length > 0) setTournamentName(matchesData[0].tournament);
            const t = tournamentsData.find((t: any) => t.id === parseInt(tournament_id!));
            if (t) {
                setPhaseStarted(t.phase_started);
                setFinished(t.finished);
                setWinner(t.winner || '');
            }
        });
    }, [tournament_id]);

    const handleStartPhase = async () => {
        setError('');
        const res = await fetch(`http://127.0.0.1:8000/main/tournaments/${tournament_id}/start-phase/`, {
            method: 'POST',
            headers: authHeaders(),
        });
        const data = await res.json();
        if (!res.ok) {
            setError(data.error);
            return;
        }
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

    const handleFinishTournament = async () => {
        setError('');
        const res = await fetch(`http://127.0.0.1:8000/main/tournaments/${tournament_id}/finish/`, {
            method: 'POST',
            headers: authHeaders(),
        });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error);
                return;
            }
                window.location.reload();
    };

    return (
        <div>
            <h1>Partidos — {tournamentName}</h1>
            <button onClick={() => router.push('/dashboard')}>Back</button>
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
                                <td>{t.name}</td>
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
            {isAdmin && !phaseStarted && (
                <button onClick={handleStartPhase}>Terminar Fase de Tabla</button>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {finished && (
                <div>
                    <h2>Campeon: {winner}</h2>
                </div>
            )}
            
            {isAdmin && phaseStarted && !finished && (
                <button onClick={handleFinishTournament}>Terminar Torneo</button>
            )}
            <hr />

            <h2>Fase de Grupos</h2>
            {sortedDates.map(date => (
                <div key={date}>
                    <h3>{date}</h3>
                    <table border={1} cellPadding={8}>
                        <thead>
                            <tr>
                                <th>Local</th>
                                <th>Resultado</th>
                                <th>Visitante</th>
                                {isAdmin && <th>Acciones</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {groupedByDate[date].map((m: any) => (
                                <tr key={m.id}>
                                    <td>{m.team_1}</td>
                                    <td>{m.gf !== null ? `${m.gf} - ${m.gc}` : 'Pendiente'}</td>
                                    <td>{m.team_2}</td>
                                    {isAdmin && (
                                        <td>
                                            <button onClick={() => router.push(`/dashboard/matches/${m.id}/update`)}>
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
                                        {isAdmin && <th>Acciones</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {phase.matches.map((m: any) => (
                                        <tr key={m.id}>
                                            <td>{m.team_1}</td>
                                            <td>{m.gf !== null ? `${m.gf} - ${m.gc}` : 'Pendiente'}</td>
                                            <td>{m.team_2}</td>
                                            {isAdmin && (
                                                <td>
                                                    <button onClick={() => router.push(`/dashboard/phase-matches/${m.id}/update`)}>
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

export default function MatchesViewPage() {
    return (
        <Suspense>
            <MatchesView />
        </Suspense>
    );
}