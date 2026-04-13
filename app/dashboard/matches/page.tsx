'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MatchesPage() {
    const router = useRouter();
    const [tournaments, setTournaments] = useState([]);
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

    const handleGenerate = async (tournament_id: number) => {
        const res = await fetch('http://127.0.0.1:8000/main/matches/generate/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tournament_id }),
        });
        const data = await res.json();
        if (res.ok) {
            window.location.reload();
        } else {
            alert(data.error);
        }
    };

    return (
        <div>
            <h1>Partidos</h1>
            <button onClick={() => router.push('/dashboard')}>Back</button>
            <hr />
            {tournaments.map((t: any) => (
                <div key={t.id}>
                    <h2>{t.name} — {t.discipline}</h2>
                    {!matchesByTournament[t.id] ? (
                        <button onClick={() => handleGenerate(t.id)}>Generar Calendario</button>
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