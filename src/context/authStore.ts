import { create } from 'zustand';
import { User } from '../types';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  getCurrentUserData 
} from '../services/auth';
import { auth } from '../services/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialized: (initialized: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  initialized: false,
  
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setInitialized: (initialized) => set({ initialized }),
  
  login: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const userCredential = await loginUser(email, password);
      const userData = await getCurrentUserData(userCredential.user.uid);
      set({ 
        user: userData as User,
        loading: false,
      });
    } catch (error) {
      // Handle specific Firebase auth error codes with Portuguese messages
      let errorMessage = "Ocorreu um erro ao fazer login. Tente novamente.";
      
      // Check if it's a Firebase Auth error with a code
      if (typeof error === 'object' && error !== null && 'code' in error) {
        const errorCode = (error as { code: string }).code;
        
        switch (errorCode) {
          case 'auth/invalid-credential':
            errorMessage = 'Credenciais inválidas. Verifique seu e-mail e senha.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'O endereço de e-mail não é válido.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'Esta conta foi desativada.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'Não existe usuário com este e-mail.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Senha incorreta.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Muitas tentativas sem sucesso. Tente novamente mais tarde.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
            break;
        }
      }
      
      set({ 
        error: errorMessage, 
        loading: false 
      });
      throw error;
    }
  },
  
  register: async (email, password, name) => {
    try {
      set({ loading: true, error: null });
      const userCredential = await registerUser(email, password, name);
      const userData = await getCurrentUserData(userCredential.user.uid);
      set({ 
        user: userData as User,
        loading: false,
      });
    } catch (error) {
      console.log(error, 'errorerrrr');
      
      // Handle specific Firebase auth error codes with Portuguese messages
      let errorMessage = "Ocorreu um erro ao criar sua conta. Tente novamente.";
      
      // Check if it's a Firebase Auth error with a code
      if (typeof error === 'object' && error !== null && 'code' in error) {
        const errorCode = (error as { code: string }).code;
        
        switch (errorCode) {
          case 'auth/email-already-in-use':
            errorMessage = 'Este e-mail já está sendo usado. Por favor, use outro e-mail ou tente fazer login.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'O endereço de e-mail não é válido.';
            break;
          case 'auth/weak-password':
            errorMessage = 'A senha é muito fraca. Por favor, use uma senha mais forte.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Muitas tentativas sem sucesso. Tente novamente mais tarde.';
            break;
          case 'auth/operation-not-allowed':
            errorMessage = 'O cadastro com e-mail e senha não está habilitado.';
            break;
        }
      }
      
      set({ 
        error: errorMessage, 
        loading: false 
      });
      throw error;
    }
  },
  
  logout: async () => {
    try {
      set({ loading: true, error: null });
      await logoutUser();
      set({ 
        user: null,
        loading: false,
      });
    } catch (error) {
      // Handle specific Firebase auth error codes with Portuguese messages
      let errorMessage = "Ocorreu um erro ao sair. Tente novamente.";
      
      // Check if it's a Firebase Auth error with a code
      if (typeof error === 'object' && error !== null && 'code' in error) {
        const errorCode = (error as { code: string }).code;
        
        switch (errorCode) {
          case 'auth/network-request-failed':
            errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Muitas tentativas sem sucesso. Tente novamente mais tarde.';
            break;
        }
      }
      
      set({ 
        error: errorMessage, 
        loading: false 
      });
      throw error;
    }
  },
}));

// Initialize auth state listener
export const initializeAuthListener = () => {
  const { setUser, setLoading, setInitialized } = useAuthStore.getState();
  
  auth.onAuthStateChanged(async (firebaseUser) => {
    setLoading(true);
    
    if (firebaseUser) {
      try {
        const userData = await getCurrentUserData(firebaseUser.uid);
        setUser(userData as User);
      } catch (error) {
        console.error('Error getting user data:', error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
    
    setLoading(false);
    setInitialized(true);
  });
};
