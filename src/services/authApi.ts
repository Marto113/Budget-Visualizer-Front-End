import axios from 'axios';

class authApi {
 private baseUrl = 'http://localhost:5000';

async login(username: string, password: string) {
  try {
      const response = await axios.post(`${this.baseUrl}/auth/login`, {
        username,
        password,
      });

      if (response.status === 200) {
        const token = response.data.token;
        console.log(response);
        setTokenCookies(response.data.accessToken, response.data.refreshToken);
        return token;
      }
    } catch (error) {
      console.error('Failed to log in:', error);
      throw error;
    }
  }
}

async function refreshToken() {
  const refreshTokenCookie = document.cookie.split(';').map(cookie => cookie.trim())
    .find(cookie => cookie.startsWith('refreshToken='));

  if (refreshTokenCookie) {
    const refreshToken = refreshTokenCookie.split('=')[1];

    if (refreshToken) {
      try {
        // Make a request to your server's /refresh-token endpoint using Axios
        const response = await axios.post('/refresh-token', {
          refreshToken,
        }, {
          withCredentials: true, // Include cookies in the request
        });

        // Check if the response status is OK (2xx)
        if (response.status === 200) {
          // If the request was successful, get the new access token
          const newAccessToken = response.data;

          // Store the new access token in a cookie or wherever it's managed
          document.cookie = `accessToken=${newAccessToken.accessToken}; max-age=${60 * 15}; path=/`; // 15 minutes

          // Continue with the application logic using the new access token
        } else {
          // Handle non-OK response from the server
          console.error('Error refreshing token:', response.statusText);
          // Redirect to login page
          window.location.href = '/login';
        }
      } catch (error: any) {
        console.error('Error refreshing token:', error.message);
        // Redirect to login page
        window.location.href = '/login';
      }
    } else {
      // Handle the case where refreshToken is undefined
      console.error('Refresh token is undefined');
      // Redirect to login page or handle accordingly
      window.location.href = '/login';
    }
  } else {
    // No refresh token available, redirect to login
    window.location.href = '/login';
  }
}
function setTokenCookies(accessToken: string, refreshToken: string) {
  document.cookie = `accessToken=${accessToken}; max-age=${60 * 15}; path=/`; // 15 minutes
  document.cookie = `refreshToken=${refreshToken}; max-age=${60 * 60 * 24 * 7}; path=/`; // 7 days
}

export default authApi;