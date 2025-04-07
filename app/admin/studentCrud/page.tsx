'use client';
import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboardLayout';
import StudentForm from '@/components/StudentForm';
import { Student } from '@/types/Student';
import { useAuth } from '@/context/AuthContext';

export default function StudentCrud() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { authState } = useAuth();
  
  // Determinar permisos
  const isAdmin = authState?.role === 'admin';
  const canView = ['admin', 'student', 'teacher'].includes(authState?.role || '');

  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      user: {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@estudiante.uci.cu',
        officialId: '03120268985',
        password: 'Password123$',
        confirmPassword: 'Password123$',
      },
      phoneNumber: '+5312345678',
      address: 'Calle Falsa 123',
      faculty: 'FIO',
      group: '305',
      ColocationLevel: 'B1',
      ComprehensionLevel: 'A1',
      WritingLevel: 'A2',
      ListeningLevel: 'B1',
      SpeakingLevel: 'A2'
    },
    {
      id: '2',
      user: {
        firstName: 'María',
        lastName: 'Gómez',
        email: 'maria@estudiante.uci.cu',
        officialId: '03120268985',
        password: 'Password123$',
        confirmPassword: 'Password123$',
      },
      phoneNumber: '+5312345678',
      address: 'Avenida Siempreviva 456',
      faculty: 'FTL',
      group: '302',
      ColocationLevel: 'A2',
      ComprehensionLevel: 'B1',
      WritingLevel: 'B1',
      ListeningLevel: 'A2',
      SpeakingLevel: 'B1'
    }
  ]);

  // Filtrar estudiantes basado en el término de búsqueda
  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    
    const term = searchTerm.toLowerCase();
    return students.filter(student => {
      return (
        student.user?.firstName?.toLowerCase().includes(term) ||
        student.user?.lastName?.toLowerCase().includes(term) ||
        student.user?.email?.toLowerCase().includes(term) ||
        student.user?.officialId?.toLowerCase().includes(term) ||
        student.phoneNumber?.toLowerCase().includes(term) ||
        student.address?.toLowerCase().includes(term) ||
        student.faculty?.toLowerCase().includes(term) ||
        student.group?.toLowerCase().includes(term) ||
        student.ColocationLevel?.toLowerCase().includes(term) ||
        student.ComprehensionLevel?.toLowerCase().includes(term) ||
        student.WritingLevel?.toLowerCase().includes(term) ||
        student.ListeningLevel?.toLowerCase().includes(term) ||
        student.SpeakingLevel?.toLowerCase().includes(term)
      );
    });
  }, [students, searchTerm]);

  const handleCreateOrUpdateStudent = (studentData: Student) => {
    if (currentStudent?.id) {
      setStudents(students.map(s => s.id === currentStudent.id ? { ...studentData, id: currentStudent.id } : s));
    } else {
      const newStudent = {
        ...studentData,
        id: Date.now().toString()
      };
      setStudents([...students, newStudent]);
    }
    setIsModalOpen(false);
    setCurrentStudent(null);
  };

  const handleEditStudent = (student: Student) => {
    setCurrentStudent(student);
    setIsModalOpen(true);
  };

  const handleDeleteStudent = (id: string) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      setStudents(students.filter(student => student.id !== deleteConfirm));
      setDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  if (!canView) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto p-4">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900">Acceso no autorizado</h3>
            <p className="mt-2 text-sm text-gray-500">No tienes permisos para ver esta página</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto relative">  
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Lista de Estudiantes</h2>
          {isAdmin && (
            <button 
              onClick={() => {
                setCurrentStudent(null);
                setIsModalOpen(true);
              }}
              className="w-36 h-10 justify-center py-2 text-sm font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700 transition-colors"
            >
              Crear Estudiante
            </button>
          )}
        </div>

        {/* Barra de búsqueda */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar estudiantes..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {filteredStudents.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-4">
            {searchTerm ? (
              <p className="text-gray-500">No se encontraron estudiantes que coincidan con "{searchTerm}"</p>
            ) : (
              <p className="text-gray-500">No hay estudiantes registrados</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre y <br /> Carnet</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facultad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grupo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Colocación</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comprensión</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Escritura</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Escucha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Habla</th>
                  {isAdmin && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.user?.firstName} {student.user?.lastName}</div>
                          <div className="text-sm text-gray-500">{student.user?.officialId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.user?.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.phoneNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.faculty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.group}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.ColocationLevel}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.ComprehensionLevel}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.WritingLevel}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.ListeningLevel}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.SpeakingLevel}</td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditStudent(student)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student.id!)}
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
      
      {/* Modal para crear/editar estudiante (solo visible para admin) */}
      {isAdmin && isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold text-gray-800">
                {currentStudent ? 'Editar Estudiante' : 'Nuevo Estudiante'}
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
            
            <StudentForm 
              student={currentStudent || {
                user: {},
                phoneNumber: '',
                address: '',
                faculty: '',
                group: '',
                ColocationLevel: '',
                ComprehensionLevel: '',
                WritingLevel: '',
                ListeningLevel: '',
                SpeakingLevel: ''
              }} 
              onSubmit={handleCreateOrUpdateStudent} 
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar (solo visible para admin) */}
      {isAdmin && deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">¿Estás seguro de eliminar este estudiante?</h3>
              <p className="text-gray-600 mb-6">Esta acción no se puede deshacer.</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
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