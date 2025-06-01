'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Renderizar solo en el cliente para evitar discrepancias
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900" />
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 text-white overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-blue-900/80 to-transparent z-0"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-600 rounded-full mix-blend-overlay opacity-20 filter blur-xl"></div>
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-600 rounded-full mix-blend-overlay opacity-15 filter blur-xl"></div>
      <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-purple-500 rounded-full mix-blend-overlay opacity-10 animate-float"></div>

      {/* Header */}
      <header className="container mx-auto px-6 py-6 relative z-10">
        <nav className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-2">
            <Image 
              src="/assets/img/uci_logo.png" 
              alt="UciLogo" 
              width={192}
              height={48}
              className='w-48 h-auto transition-all hover:scale-105'
              priority
            />
          </div>
          
          {/* <div className="hidden md:flex space-x-10 items-center">
            <Link href="#" className="hover:text-blue-300 transition-colors font-medium text-lg">Acerca de</Link>
            <Link 
              href="/teacher/examSessionCrud" 
              className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-2 rounded-full text-lg font-medium transition-all hover:shadow-lg"
            >
              Ver Convocatorias
            </Link>
          </div> */}
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-10 md:py-10 lg:py-16 flex flex-col items-center text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Certificación de Inglés <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-200">
            Sin complicaciones
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-12 max-w-3xl leading-relaxed text-blue-100">
          Más rápida, eficiente y asequible que nunca. Obtén tu certificación desde la comodidad de tu apartamento.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/login" 
            className="bg-white text-blue-900 hover:bg-blue-100 px-12 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            Iniciar Sesión
          </Link>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-8 opacity-80">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-blue-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Fácil acceso a resultados</span>
          </div>
          <div className="flex items-center">
            <svg className="w-6 h-6 text-blue-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Examen en línea</span>
          </div>
          <div className="flex items-center">
            <svg className="w-6 h-6 text-blue-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Desde tu propio dispositivo</span>
          </div>
        </div>
      </main>

      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: `${Math.random() * 10 + 2}px`,
              height: `${Math.random() * 10 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); opacity: 1; }
          100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}