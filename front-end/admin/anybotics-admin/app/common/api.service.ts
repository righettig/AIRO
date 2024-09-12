const request = async (apiUrl: string, endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', body?: any) => {
    try {
        const response = await fetch(`${apiUrl}/${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
            },
            body: body ? JSON.stringify(body) : null,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }

        return {};
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
};

export const createApiService = (apiUrl: string) => ({
    request: (endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', body?: any) =>
        request(apiUrl, endpoint, method, body),
});
