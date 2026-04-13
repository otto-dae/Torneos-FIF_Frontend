'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TeamsPage() {
    const router = useRouter();
    const [tournaments, setTournaments] = useState([]);
    const [teamsByTournament, setTeamsByTournament] = useState<any>({});

    useEffect(() => {
        fetch('http://127.0.0.1:8000/main/tournaments/')
            .then(res => res.json())
            .then(data => {
                setTournaments(data);
                return fetch('http://127.0.0.1:8000/main/teams/');
            })
            .then(res => res.json())
            .then(teams => {
                const grouped: any = {};
                teams.forEach((t: any) => {
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
            <button onClick={() => router.push('/dashboard/teams/create')}>Add Team</button>
            <hr />
            {tournaments.map((t: any) => (
                <div key={t.id}>
                    <h2>{t.name} — {t.discipline}</h2>
                    <table border={1} cellPadding={8}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Team</th>
                                <th>PJ</th>
                                <th>PG</th>
                                <th>PE</th>
                                <th>PP</th>
                                <th>GF</th>
                                <th>GC</th>
                                <th>Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(teamsByTournament[t.id] || []).map((team: any, index: number) => (
                                <tr key={team.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <span
                                            style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                            onClick={() => router.push(`/dashboard/teams/${team.id}/participants`)}
                                        >
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