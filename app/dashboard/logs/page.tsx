'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LogsPage() {
    const router = useRouter();
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/main/logs/')
            .then(res => res.json())
            .then(data => setLogs(data));
    }, []);

    return (
        <div>
            <h1>Historial de Cambios</h1>
            <button onClick={() => router.push('/dashboard')}>Back</button>
            <hr />
            <table border={1} cellPadding={8}>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Admin</th>
                        <th>Accion</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((l: any) => (
                        <tr key={l.id}>
                            <td>{l.date}</td>
                            <td>{l.admin}</td>
                            <td>{l.action}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}