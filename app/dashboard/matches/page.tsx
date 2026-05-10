'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ManageMatchesPage() {
    const router = useRouter();
    const [tournaments, setTournaments] = useState([]);
    const [teams, setTeams] = useState([]);
    const [matchesByTournament, setMatchesByTournament] = useState<any>({});

    useEffect(() => {
        Promise.all([
            fetch('http://127.0.0.1:8000/main/tournaments/').then(res => res.json()),
            fetch('http://127.0.0.1:8000/main/matches/').then(res => res.json()),
        ]).then(([tournamentsData, matchesData]) => {
            setTournaments(tournamentsData);
            const grouped: any = {};
            matchesData.forEach((m: any) => {
                if (!grouped[m.tournament_id]) grouped[m.tournament_id] = [];
                grouped[m.tournament_id].push(m);
            });
            setMatchesByTournament(grouped);
        });
    }, []);

    return (
        <div>
            <h1>Gestionar Partidos</h1>
            <button onClick={() => router.push('/dashboard')}>Back</button>
            <hr />
            {tournaments.map((t: any) => (
                <div key={t.id}>
                    <h2>{t.name} — {t.discipline}</h2>
                    {!matchesByTournament[t.id] ? (
                        <p>Calendario pendiente — agrega los equipos requeridos para generarlo automáticamente.</p>
                    ) : (
                        <table border={1} cellPadding={8}>
                            <thead>
                                <tr>
                                    <th>Local</th>
                                    <th>Visitante</th>
                                    <th>Fecha</th>
                                    <th>Resultado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {matchesByTournament[t.id].map((m: any) => (
                                    <tr key={m.id}>
                                        <td>{m.team_1}</td>
                                        <td>{m.team_2}</td>
                                        <td>{m.datematch || '-'}</td>
                                        <td>{m.gf !== null ? `${m.gf} - ${m.gc}` : 'Pendiente'}</td>
                                        <td>
                                            <button onClick={() => router.push(`/dashboard/matches/${m.id}/update`)}>
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <br />
                </div>
            ))}
        </div>
    );
}