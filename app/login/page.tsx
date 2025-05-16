// app/login/page.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthStateType, useAuth } from '@/context/AuthContext';



export default function LoginPage() {
  const { login, authState } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    if (!email) return "El email es obligatorio";
    if (!/^[^@]+@(estudiante|profesor|administrador)\.uci\.cu$/.test(email)) {
      return "El email debe tener el formato username@rol.uci.cu";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "La contraseña es obligatoria"; 
    // if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres";
    // if (!/[A-Z]/.test(password)) return "Debe contener al menos una letra mayúscula";
    // if (!/[a-z]/.test(password)) return "Debe contener al menos una letra minúscula";
    // if (!/[0-9]/.test(password)) return "Debe contener al menos un número";
    // if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    //   return "Debe contener al menos un carácter especial (ej. !@#$%^&*)";
    // }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setEmailError('');
    setPasswordError('');

    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    if (emailValidation || passwordValidation) {
      setEmailError(emailValidation);
      setPasswordError(passwordValidation);
      setIsLoading(false);
      return;
    }

    try {
      // Simulación de llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const username = email.split('@')[0];
      const domain = email.split('@')[1];

      let userData: AuthStateType;

      if (domain.includes('estudiante')) {
        userData = {
            student: {
            user: {
              id: 1,
              firstName: 'Ana',
              lastName: 'Martínez',
              officialId: '88020123456',
              email: email,
            },
            id: '101',
            phoneNumber: '+53551234567',
            address: 'Calle 42 #1234, Plaza',
            faculty: 'Ingeniería Informática',
            group: 'C312',
            ColocationLevel: 'B2',
            ComprehensionLevel: 'B1',
            WritingLevel: 'B1',
            ListeningLevel: 'B2',
            SpeakingLevel: 'B1'
          },
          isAuthenticated: true,
          role: 'student'
        };
        router.push('/student/dashboard');
      } else if (domain.includes('profesor')) {
        userData = {
          teacher: {
            id: '201',
            user: {
              id: 2,
              firstName: 'Carlos',
              lastName: 'González',
              officialId: '03120268985',
              email: email,
            },
          },
           isAuthenticated: true,
          role: 'teacher'
        };
        router.push('/teacher/testCrud');
      } else if (domain.includes('administrador')) {
        userData = {
          admin: {
            id: '301',
            user: {
              id: 3,
              firstName: 'Edmundo',
              lastName: 'Dantés',
              officialId: '99123456789',
              email: email,
            },
          },
         isAuthenticated: true,
          role: 'admin'
        };
        router.push('/admin/userCrud');
      } else {
        setError('El email no corresponde a ningún rol válido');
        setIsLoading(false);
        return;
      }

      login(userData);

    } catch (err) {
      setError('Error en el inicio de sesión. Por favor intente nuevamente.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 text-white overflow-hidden">
      <header className="container mx-auto px-6 py-6">
        <Link href="/">
          <img 
            src="/assets/img/uci_logo.png" 
            alt="UCI Logo" 
            className="w-48 h-auto transition-all hover:scale-105"
          />
        </Link>
      </header>

      <main className="container mx-auto px-6 py-12 flex flex-col items-center">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-center mb-6">Iniciar Sesión</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 text-red-100 rounded-lg text-center">
              {error}
            </div>
          )}


          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(validateEmail(e.target.value));
                }}
                className={`w-full px-4 py-3 bg-white/5 border ${emailError ? 'border-red-500' : 'border-white/20'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300`}
                placeholder="usuario@rol.uci.cu"
              />
              {emailError && <p className="mt-1 text-sm text-red-400">{emailError}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(validatePassword(e.target.value));
                }}
                className={`w-full px-4 py-3 bg-white/5 border ${passwordError ? 'border-red-500' : 'border-white/20'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300`}
                placeholder="••••••••"
              />
              {passwordError && <p className="mt-1 text-sm text-red-400">{passwordError}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold shadow-lg transition-all ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl'
              }`}
            >
              {isLoading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}