'use client';

import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

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

    return (
        <div>
            <h1>{teamName ? `${teamName} — Participantes` : 'Participantes'}</h1>
            <button onClick={() => router.push(`/dashboard/tournaments/${tournament_id}`)}>Back</button>
            {isAdmin && (
                <button onClick={() => router.push(`/dashboard/teams/${id}/participants/create?tournament_id=${tournament_id}`)}>
                    Agregar Participante
                </button>
            )}
            <hr />
            <table border={1} cellPadding={8}>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Telefono</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {participants.map((p: any) => (
                        <tr key={p.id}>
                            <td>{p.name}</td>
                            <td>{p.phone}</td>
                            <td>{p.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default function ParticipantsPage() {
    return (
        <Suspense>
            <ParticipantsContent />
        </Suspense>
    );
}