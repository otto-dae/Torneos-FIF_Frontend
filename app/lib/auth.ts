export function getToken(): string {
    const match = document.cookie.match(/token=([^;]+)/);
    return match ? match[1] : '';
}

export function authHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
    };
}