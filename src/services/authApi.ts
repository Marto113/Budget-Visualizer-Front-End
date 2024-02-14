import axios from 'axios';

interface AuthApiInterface {
    getAccessToken(): string | null;
    isTokenExpired(token: string): Promise<boolean>;
    refreshToken(): Promise<string>;
}

class AuthApi implements AuthApiInterface {
    private baseUrl = 'http://localhost:5000';

    async login(username: string, password: string): Promise<string> {
        try {
            const response = await axios.post(`${this.baseUrl}/auth/login`, {
                username,
                password,
            });

            if (response.status === 200) {
                const id = response.data.userId;
                setTokenCookies(response.data.accessToken, response.data.refreshToken);
                return id;
            }
        } catch (error) {
            console.error('Failed to log in:', error);
            throw error;
        }

        return '';
    }

    getAccessToken(): string | null {
        return getCookie('accessToken');
    }

    getRefreshToken(): string | null {
        return getCookie('refreshToken');
    }

    async isTokenExpired(token: string): Promise<boolean> {
        try {
            const decodedToken = decodeToken(token);

            if (!decodedToken || typeof decodedToken.exp !== 'number') {
                return true;
            }

            const currentTime = Math.floor(Date.now() / 1000);
            return decodedToken.exp < currentTime;
        } catch (error) {
            console.error('Error checking token expiration:', error);
            return true;
        }
    }

    async refreshToken(): Promise<string> {
        try {
            const refreshToken = getCookie('refreshToken');

            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await axios.post(`${this.baseUrl}/auth/refresh-token`, {
                refreshToken: refreshToken,
            });
            console.log(response);
            if (response.status === 200) {
                setTokenCookies(response.data.accessToken, response.data.refreshToken);
            }

            return response.data.accessToken
        } catch (error) {
            console.error('Error refreshing token:', error);
            throw error;
        }
    }

    decodeToken(token: string): Record<string, unknown> | null {
        try {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            return decoded;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }
}

function setTokenCookies(accessToken: string, refreshToken: string) {
    document.cookie = `accessToken=${accessToken}; max-age=${60 * 15}; path=/`;
    document.cookie = `refreshToken=${refreshToken}; max-age=${60 * 60 * 24 * 7}; path=/`;
}

const getCookie = (name: string): string | null => {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split('=');
        if (cookieName === name) {
            return cookieValue;
        }
    }
    return null;
}

const decodeToken = (token: string): Record<string, unknown> | null => {
    try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        return decoded;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

export default new AuthApi();
