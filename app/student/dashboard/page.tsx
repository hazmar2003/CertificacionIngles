'use client';
import { DashboardLayout } from '@/components/dashboardLayout';
import { useAuth } from '@/context/AuthContext';

export default function StudentDashboard() {
  const { authState } = useAuth();
  const studentName = authState?.student?.user?.firstName || 'Estudiante';
  const studentLevels = authState?.student || {};
  
  // Niveles del estudiante
  const levels = [
    { name: 'Colocación', value: studentLevels.ColocationLevel, icon: '📝', color: 'bg-blue-100 text-blue-800' },
    { name: 'Comprensión', value: studentLevels.ComprehensionLevel, icon: '📖', color: 'bg-purple-100 text-purple-800' },
    { name: 'Escritura', value: studentLevels.WritingLevel, icon: '✍️', color: 'bg-green-100 text-green-800' },
    { name: 'Escucha', value: studentLevels.ListeningLevel, icon: '👂', color: 'bg-amber-100 text-amber-800' },
    { name: 'Habla', value: studentLevels.SpeakingLevel, icon: '🗣️', color: 'bg-red-100 text-red-800' }
  ];

  // Próxima convocatoria (datos de ejemplo)
  const nextExamSession = {
    date: '18 de mayo 2025',
    time: '10:00 AM',
  };

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Bienvenido/a {studentName}</h1>
        <p className="text-gray-600">Tu progreso actual en el aprendizaje de inglés</p>
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card de Niveles */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <span className="mr-2">🏆</span> Tus Niveles Certificados
          </h2>
          
          <div className="space-y-4">
            {levels.map((level, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{level.icon}</span>
                  <span className="font-medium text-gray-700">{level.name}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${level.color}`}>
                  {level.value || 'Por certificar'}
                </span>
              </div>
            ))}
          </div>

          {!levels.some(l => l.value) && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg text-center">
              <p className="text-yellow-800">Aún no tienes niveles certificados</p>
            </div>
          )}
        </div>

        {/* Card de Próxima Convocatoria */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <span className="mr-2">📅</span> Próxima Convocatoria
          </h2>

          <div className="space-y-4">
            <div className="flex items-start">
              <span className="text-2xl mr-3">🗓️</span>
              <div>
                <p className="text-sm text-gray-500">Fecha</p>
                <p className="font-medium">{nextExamSession.date}</p>
              </div>
            </div>

            <div className="flex items-start">
              <span className="text-2xl mr-3">⏰</span>
              <div>
                <p className="text-sm text-gray-500">Hora</p>
                <p className="font-medium">{nextExamSession.time}</p>
              </div>
            </div>

          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 text-sm">Recuerda presentarte 15 minutos antes con tu identificación</p>
          </div>
        </div>
      </div>

      {/* Mensaje motivacional */}
      <div className="max-w-4xl mx-auto mt-10 text-center">
        <p className="text-gray-600 italic">
          "El dominio de un idioma es como construir una casa - cada nivel es un piso nuevo en tu conocimiento"
        </p>
      </div>
    </div>
    </DashboardLayout>
  );
}