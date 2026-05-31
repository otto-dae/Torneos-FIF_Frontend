'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import style from '../../../styles/centralized.module.css';

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
            <header className={style.Header}>
                <Image
                    src="/Graphics/Troyan.png"
                    alt="Logo"
                    width={50}
                    height={50}
                    onClick={() => router.push('/dashboard')}
                    style={{ cursor: 'pointer' }}
                />
                <h1 className={style.text}>Historial de Cambios</h1>
                <button className={style.btn} onClick={() => router.push('/dashboard')} >
                    Back
                </button>
            </header>

            <div className={style.secondaryDiv}>
                <table className={style.table}>
                    <thead>
                        <tr className={style.tableHead}>
                            <th className={style.left}>Fecha</th>
                            <th>Admin</th>
                            <th className={style.right}>Accion</th>
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
        </div>
    );
}