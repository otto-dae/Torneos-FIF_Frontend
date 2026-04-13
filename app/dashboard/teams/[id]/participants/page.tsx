'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ParticipantsPage() {
    const router = useRouter();
const params = useParams();
const id = params.id as string;
    const [participants, setParticipants] = useState([]);
    const [teamName, setTeamName] = useState('');

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/main/participants/?team_id=${id}`)
            .then(res => res.json())
            .then(data => {
                setParticipants(data);
                if (data.length > 0) setTeamName(data[0].team);
            });
    }, [id]);

    return (
        <div>
            <h1>{teamName ? `${teamName} — Participants` : 'Participants'}</h1>
            <button onClick={() => router.push('/dashboard/teams')}>Back</button>
            <button onClick={() => router.push(`/dashboard/teams/${id}/participants/create`)}>Add Participant</button>
            <hr />
            <table border={1} cellPadding={8}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Phone</th>
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