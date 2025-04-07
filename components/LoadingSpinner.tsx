'use client';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-white">Verificando autenticación...</p>
    </div>
  );
}