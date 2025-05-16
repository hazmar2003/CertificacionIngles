'use client';
import { useState, useMemo, Key } from 'react';
import { DashboardLayout } from '@/components/dashboardLayout';
import ExamSessionForm from '@/components/ExamSessionForm';
import { useAuth } from '@/context/AuthContext';
import { ExamSession } from '../../../types/ExamSession';
import { Test } from '../../../types/Test';
import { Student } from '../../../types/Student';

// Datos de ejemplo para tests
const sampleTests: Test[] = [
  {
    id: '1',
    title: 'Prueba de Comprensión Básica',
    description: 'Evaluación de comprensión de lectura',
    testType: 'Comprehension',
    questions: [
      {
        id: 'q1',
        text: 'What is the capital of France?',
        options: [
          { id: 'q1-o1', text: 'Paris', isCorrect: true },
          { id: 'q1-o2', text: 'London', isCorrect: false },
          { id: 'q1-o3', text: 'Berlin', isCorrect: false },
          { id: 'q1-o4', text: 'Madrid', isCorrect: false }
        ]
      }
    ],
    createdBy: 'profesor1@example.com',
    createdAt: '2023-05-15'
  },
  {
    id: '2',
    title: 'Prueba de Listening Intermedio',
    description: 'Evaluación de comprensión auditiva',
    testType: 'Listening',
    audioFile: 'audio-sample.mp3',
    questions: [
      {
        id: 'q1',
        text: 'What time does the store open?',
        options: [
          { id: 'q1-o1', text: '8:00 AM', isCorrect: false },
          { id: 'q1-o2', text: '9:00 AM', isCorrect: true },
          { id: 'q1-o3', text: '10:00 AM', isCorrect: false },
          { id: 'q1-o4', text: 'It does not say', isCorrect: false }
        ]
      }
    ],
    createdBy: 'profesor2@example.com',
    createdAt: '2023-06-20'
  },
  {
    id: '3',
    title: 'Prueba de Escritura Avanzada',
    description: 'Evaluación de habilidades de escritura',
    testType: 'Writing',
    writingPrompt: 'Write a 250-word essay about your favorite holiday destination and why you recommend it.',
    questions: [],
    createdBy: 'profesor3@example.com',
    createdAt: '2023-07-10'
  }
];

// Datos de ejemplo para estudiantes
const sampleStudents: Student[] = [
  {
    id: '1',
    user: {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      officialId: '123456789',
      password: 'password123'
    },
    phoneNumber: '+123456789',
    address: 'Calle Principal 123',
    faculty: 'FIO',
    group: '301',
    ColocationLevel: 'B1',
    ComprehensionLevel: 'A2',
    WritingLevel: 'B1',
    ListeningLevel: 'A2',
    SpeakingLevel: 'B1'
  },
  {
    id: '2',
    user: {
      firstName: 'María',
      lastName: 'Gómez',
      email: 'maria.gomez@example.com',
      officialId: '987654321',
      password: 'password123'
    },
    phoneNumber: '+987654321',
    address: 'Avenida Central 456',
    faculty: 'FTL',
    group: '302',
    ColocationLevel: 'A2',
    ComprehensionLevel: 'B1',
    WritingLevel: 'A2',
    ListeningLevel: 'B1',
    SpeakingLevel: 'A2'
  }
];

// Datos de ejemplo para sesiones
const sampleSessions: ExamSession[] = [
  {
    id: '1',
    test: sampleTests[0],
    students: [sampleStudents[0]],
    date: '2026-12-15T10:00:00'
  },
  {
    id: '2',
    test: sampleTests[1],
    students: sampleStudents,
    date: '2026-12-20T14:30:00'
  }
];


export default function ExamSessionCrud() {
  const { authState } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState<ExamSession | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sessions, setSessions] = useState<ExamSession[]>(sampleSessions);
  const [tests] = useState<Test[]>(sampleTests);
  const [students] = useState<Student[]>(sampleStudents);
  const [dateError, setDateError] = useState<string | null>(null);
  const [studentsError, setStudentsError] = useState<string | null>(null);

  const isTeacher = authState?.role === 'teacher';

  const validateDate = (dateString: string | undefined): boolean => {
    if (!dateString) {
      setDateError('La fecha es requerida');
      return false;
    }
    
    const now = new Date();
    const date = new Date(dateString);
    if (date < now) {
      setDateError('La fecha y hora no pueden ser anteriores a la actual');
      return false;
    }
    setDateError(null);
    return true;
  };

  const filteredSessions = useMemo(() => {
    if (!searchTerm) return sessions;
    
    const term = searchTerm.toLowerCase();
    return sessions.filter(session => {
      const dateString = session.date ? new Date(session.date).toLocaleString() : '';
      return (
        session.test?.title.toLowerCase().includes(term) ||
        session.test?.testType.toLowerCase().includes(term) ||
        session.students?.some(s => 
          s.user?.firstName?.toLowerCase().includes(term) ||
          s.user?.lastName?.toLowerCase().includes(term)
        ) ||
        dateString.toLowerCase().includes(term)
      );
    });
  }, [sessions, searchTerm]);

  const handleCreateOrUpdate = (sessionData: ExamSession) => {
    // Validación de fecha
    if (!validateDate(sessionData.date)) {
      return;
    }

    // Validación de test
    if (!sessionData.test) {
      alert('Por favor selecciona un test');
      return;
    }

    // Validación de estudiantes (nueva)
    if (!sessionData.students || sessionData.students.length === 0) {
      setStudentsError('Debe seleccionar al menos un estudiante');
      return;
    }
    setStudentsError(null);

    if (currentSession?.id) {
      setSessions(sessions.map(s => s.id === currentSession.id ? sessionData : s));
    } else {
      const newSession: ExamSession = {
        id: Date.now().toString(),
        test: tests.find(t => t.id === sessionData.test?.id) || undefined,
        students: students.filter(s => 
          sessionData.students?.some(selected => selected.id === s.id)
        ),
        date: sessionData.date
      };
      setSessions(prev => [...prev, newSession]);
    }
    
    setIsModalOpen(false);
    setCurrentSession(null);
  };

  const handleDelete = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
    setDeleteConfirm(null);
  };

  const formatDateString = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString();
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto relative">  
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Convocatorias</h2>
          {isTeacher && (
            <button 
              onClick={() => {
                setCurrentSession({
                  id: '',
                  test: undefined,
                  students: [],
                  date: ''
                });
                setIsModalOpen(true);
              }}
              className="w-36 h-10 justify-center py-2 text-sm font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700 transition-colors"
            >
              Crear Convocatoria
            </button>
          )}
        </div>

        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar sesiones..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {filteredSessions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-4">
            {searchTerm ? (
              <p className="text-gray-500">No se encontraron convocatorias que coincidan con "{searchTerm}"</p>
            ) : (
              <p className="text-gray-500">No hay convocatorias programadas</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estudiantes</th>
                  {isTeacher && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSessions.map((session) => (
                  <tr key={session.id as Key} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{session.test?.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        session.test?.testType === 'Comprehension' ? 'bg-blue-100 text-blue-800' :
                        session.test?.testType === 'Listening' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {session.test?.testType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateString(session.date)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {session.students?.length || 0} estudiantes
                      </div>
                    </td>
                    {isTeacher && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setCurrentSession({
                                ...session,
                                test: session.test || undefined,
                                students: session.students || [],
                                date: session.date || ''
                              });
                              setIsModalOpen(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => session.id && setDeleteConfirm(session.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Modal para crear/editar sesión */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold text-gray-800">
                {currentSession?.id ? 'Editar Sesión' : 'Nueva Sesión'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <ExamSessionForm 
                examSession={currentSession || undefined}
                tests={tests}
                students={students}
                onSubmit={handleCreateOrUpdate}
                onCancel={() => setIsModalOpen(false)}
                dateError={dateError}
                studentError={studentsError}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">¿Estás seguro de eliminar esta sesión?</h3>
              <p className="text-gray-600 mb-6">Esta acción no se puede deshacer.</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}