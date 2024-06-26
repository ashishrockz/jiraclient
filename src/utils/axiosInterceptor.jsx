import axios from 'axios';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

const setupAxiosInterceptors = () => {
  axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.data && error.response.data.message === 'jwt expired') {
        // Clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
        // Redirect to login page
        history.push('/login');
        window.location.reload();
      }
      return Promise.reject(error);
    }
  );
};

export default setupAxiosInterceptors;
