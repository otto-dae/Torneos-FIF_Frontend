'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TeamsPage() {
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

return (
    <div>
        <h1>Clasificaciones</h1>
        <button onClick={() => router.push('/dashboard')}>Back</button>
        <hr />
        {tournaments.map((t: any) => (
            <div key={t.id}>
                <h2>{t.name} — {t.discipline}</h2>
                {isAdmin && (
                    <button onClick={() => router.push(`/dashboard/teams/create?tournament_id=${t.id}`)}>
                        Agregar Equipo
                    </button>
                )}
                {isAdmin && (
                    <button onClick={() => router.push(`/dashboard/matches/view?tournament_id=${t.id}`)}>
                        Gestionar Partidos
                    </button>
                )}
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
                        {(teamsByTournament[t.id] || []).map((team: any, index: number) => (
                            <tr key={team.id}>
                                <td>{index + 1}</td>
                                <td>
                                    <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => router.push(`/dashboard/teams/${team.id}/participants`)}>
                                        {team.name}
                                    </span>
                                </td>
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
                <br />
            </div>
        ))}
    </div>
);
}