const BASE_URL = 'https://surfix.onrender.com/api/user';

const headers = {
    'Content-Type': 'application/json',
};

async function registerUser(userData) {

    const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers,
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
    }

    const data = await response.json();
    return data;
}

async function loginUser(email, password) {

    const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
    }

    const data = await response.json();

    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.userId);

    return data;
}

async function query(filters = {}) {

    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${BASE_URL}/${filters}`, {
        method: 'GET',
        headers: {
            ...headers,
            'Authorization': `Bearer ${token}`,
        },
    });

    if (response.status === 401 || response.status === 403) {
        throw new Error('Unauthorized or forbidden');
    }

    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }

    const data = await response.json();
    return data;
}

async function getById(userId) {

    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${BASE_URL}/${userId}`, {
        method: 'GET',
        headers: {
            ...headers,
            'Authorization': `Bearer ${userId}`,
        },
    });

    if (response.status === 401 || response.status === 403) {
        throw new Error('Unauthorized or forbidden');
    }

    if (!response.ok) {
        throw new Error('Failed to fetch user');
    }

    const data = await response.json();
    return data;
}

async function update(userData, userId) {

    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }
    const response = await fetch(`${BASE_URL}/${userId}`, {
        method: 'PUT',
        headers: {
            ...headers,
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
    });

    if (response.status === 401 || response.status === 403) {
        throw new Error('Unauthorized or forbidden');
    }

    if (!response.ok) {
        throw new Error('Failed to update user');
    }

    const data = await response.json();
    return data;
}

async function remove(userId) {

    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${BASE_URL}/${userId}`, {
        method: 'DELETE',
        headers: {
            ...headers,
            'Authorization': `Bearer ${token}`,
        },
    });

    if (response.status === 401 || response.status === 403) {
        throw new Error('Unauthorized or forbidden');
    }

    if (!response.ok) {
        throw new Error('Failed to delete user');
    }
}

const userService = {
    registerUser,
    loginUser,
    query,
    getById,
    update,
    remove,
};

export default userService;