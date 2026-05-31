'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authHeaders } from '@/app/lib/auth';
import style from '../../../../styles/centralized.module.css';
import Image from 'next/image';

export default function CreateTournamentPage() {
    const router = useRouter();
    const [disciplines, setDisciplines] = useState([]);
    const [form, setForm] = useState({ name: '', noteams: '', matchdays: '', discipline_id: '' });
    const [error, setError] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/main/disciplines/')
            .then(res => res.json())
            .then(data => setDisciplines(data));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!form.discipline_id) {
            setError('Please select a discipline');
            return;
        }

        const res = await fetch('http://127.0.0.1:8000/main/tournaments/create/', {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({
                name: form.name,
                noteams: parseInt(form.noteams),
                matchdays: parseInt(form.matchdays),
                discipline_id: parseInt(form.discipline_id),
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error);
            return;
        }

        router.push('/dashboard');
    };

    const handleSelection = (id: string) => {
        setForm({ ...form, discipline_id: id });
        setIsMenuOpen(false);
    };

    const selectedDiscipline = disciplines.find((d: any) => d.id.toString() === form.discipline_id);
    const buttonText = selectedDiscipline ? (selectedDiscipline as any).name : 'Select discipline';

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
                <h1 className={style.text}>Create Tournament</h1>
                <button onClick={() => router.push('/dashboard')} className={style.btn2}>
                     Back
                </button>
            </header>
            <div className={style.mainContainer}>
                <div className={style.subContainer}>
                    <form onSubmit={handleSubmit} className={style.formContainer}>
                        <div>
                            <label className={style.textLabel}>Nombre</label><br />
                            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className={style.textInput} />
                        </div>
                        <br />
                        <div>
                            <label className={style.textLabel}>Numero de Equipos</label><br />
                            <input type="number" value={form.noteams} onChange={e => setForm({ ...form, noteams: e.target.value })} required className={style.textInput} />
                        </div>
                        <br />
                        <div>
                            <label className={style.textLabel}>Dias de Partidos</label><br />
                            <input type="number" value={form.matchdays} onChange={e => setForm({ ...form, matchdays: e.target.value })} required className={style.textInput} />
                        </div>
                        <br />
                        <div>
                            <label className={style.textLabel}>Disciplina</label><br />
                            <div className={style.selectContainer}>
                                <div 
                                    className={style.selectButton} 
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                >
                                    {buttonText}
                                    <span>{isMenuOpen ? '▲' : '▼'}</span>
                                </div>

                                {isMenuOpen && (
                                    <ul className={style.darkDropdown}>
                                        {disciplines.map((d: any) => (
                                            <li 
                                                key={d.id} 
                                                className={style.dropdownItem}
                                                onClick={() => handleSelection(d.id.toString())}
                                            >
                                                {d.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                        <br />
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <button type="button" onClick={() => router.push('/dashboard')} className={style.btnCancel} style={{ marginLeft: '10px' }}>Cancelar</button>
                        <button type="submit" className={style.btn2}>Crear</button>
                    </form>
                </div>
            </div>
        </div>
    );
}