'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
    const router = useRouter();
    const [tournaments, setTournaments] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/main/tournaments/')
            .then(res => res.json())
            .then(data => setTournaments(data));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        router.push('/login');
    };
    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={handleLogout}>Logout</button>
            <hr />
            <h2>Tournaments</h2>
            <button onClick={() => router.push('/dashboard/tournaments/create')}>Create Tournament</button>
            <button onClick={() => router.push('/dashboard/teams')}>Teams</button>
            <button onClick={() => router.push('/dashboard/matches')}>Partidos</button>
            <table border={1} cellPadding={8}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Discipline</th>
                        <th>Teams</th>
                        <th>Matchdays</th>
                    </tr>
                </thead>
                <tbody>
                    {tournaments.map((t: any) => (
                        <tr key={t.id}>
                            <td>{t.name}</td>
                            <td>{t.discipline}</td>
                            <td>{t.noteams}</td>
                            <td>{t.matchdays}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}