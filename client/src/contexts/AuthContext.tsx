import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';
import { getRoleBasedDashboardRoute, UserRole } from '../utils/roleRedirects';

// Types
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'client' | 'writer' | 'manager' | 'support' | 'accountant' | 'tech';
  status: string;
  isEmailVerified: boolean;
  profileImage?: string;
  writerProfile?: any;
  clientProfile?: any;
  adminProfile?: any;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  token: string;
  refreshToken?: string;
  user: User;
}

interface UserResponse {
  success: boolean;
  user: User;
  message?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  getUserDashboardRoute: () => string;
}

// Actions
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  isAuthenticated: false,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        try {
          dispatch({ type: 'AUTH_START' });
          const response = await authAPI.getMe();
          const userResponse = response.data as UserResponse;
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user: userResponse.user,
              token,
            },
          });
        } catch (error) {
          dispatch({ type: 'AUTH_FAILURE' });
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 [AUTH CONTEXT DEBUG] Starting login process for email:', email);
      dispatch({ type: 'AUTH_START' });
      
      console.log('🔐 [AUTH CONTEXT DEBUG] Making API call to login endpoint...');
      const response = await authAPI.login(email, password);
      const authResponse = response.data as AuthResponse;
      console.log('🔐 [AUTH CONTEXT DEBUG] Login API call successful, response received:', {
        status: response.status,
        hasData: !!response.data,
        hasUser: !!authResponse.user,
        hasToken: !!authResponse.token
      });
      
      const { user, token } = authResponse;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token },
      });
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE' });
      throw error;
    }
  };

  // Register function
  const register = async (userData: any) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authAPI.register(userData);
      const authResponse = response.data as AuthResponse;
      const { user, token } = authResponse;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token },
      });
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE' });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Update user function
  const updateUser = (userData: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // Get user's dashboard route based on role
  const getUserDashboardRoute = (): string => {
    if (state.user) {
      return getRoleBasedDashboardRoute(state.user.role as UserRole);
    }
    return '/client/dashboard'; // fallback
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    getUserDashboardRoute,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
