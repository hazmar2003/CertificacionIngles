'use client';
import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboardLayout';
import TeacherForm from '@/components/TeacherForm';
import { Teacher } from '@/types/Teacher';

export default function TeacherCrud() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: '1',
      user: {
        firstName: 'Laura',
        lastName: 'Profesora',
        email: 'laura@profesor.uci.cu',
        officialId: '03120268985',
        password: 'Password123$',
        confirmPassword: 'Password123$',
      }
    },
    {
      id: '2',
      user: {
        firstName: 'Pedro',
        lastName: 'Rodriguez',
        email: 'pedro@profesor.uci.cu',
        officialId: '03120268985',
        password: 'Password123$',
        confirmPassword: 'Password123$',
      }
    }
  ]);

  // Filtrar profesores basado en el término de búsqueda
  const filteredTeachers = useMemo(() => {
    if (!searchTerm) return teachers;
    
    const term = searchTerm.toLowerCase();
    return teachers.filter(teacher => {
      return (
        teacher.user?.firstName?.toLowerCase().includes(term) ||
        teacher.user?.lastName?.toLowerCase().includes(term) ||
        teacher.user?.email?.toLowerCase().includes(term) ||
        teacher.user?.officialId?.toLowerCase().includes(term)
      );
    });
  }, [teachers, searchTerm]);

  const handleCreateOrUpdateTeacher = (teacherData: Teacher) => {
    if (currentTeacher?.id) {
      // Modo edición
      setTeachers(teachers.map(t => t.id === currentTeacher.id ? { ...teacherData, id: currentTeacher.id } : t));
    } else {
      // Modo creación
      const newTeacher = {
        ...teacherData,
        id: Date.now().toString()
      };
      setTeachers([...teachers, newTeacher]);
    }
    setIsModalOpen(false);
    setCurrentTeacher(null);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setCurrentTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleDeleteTeacher = (id: string) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      setTeachers(teachers.filter(teacher => teacher.id !== deleteConfirm));
      setDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto relative">  
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Lista de Profesores</h2>
          <button 
            onClick={() => {
              setCurrentTeacher(null);
              setIsModalOpen(true);
            }}
            className="w-36 h-10 justify-center py-2 text-sm font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700 transition-colors"
          >
            Crear Profesor
          </button>
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
              placeholder="Buscar profesores..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {filteredTeachers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-4">
            {searchTerm ? (
              <p className="text-gray-500">No se encontraron profesores que coincidan con "{searchTerm}"</p>
            ) : (
              <p className="text-gray-500">No hay profesores registrados</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carnet</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{teacher.user?.firstName} {teacher.user?.lastName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.user?.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.user?.officialId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditTeacher(teacher)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteTeacher(teacher.id!)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Modal para crear/editar profesor */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold text-gray-800">
                {currentTeacher ? 'Editar Profesor' : 'Nuevo Profesor'}
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
            
            <TeacherForm 
              teacher={currentTeacher || {
                user: {}
              }} 
              onSubmit={handleCreateOrUpdateTeacher} 
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">¿Estás seguro de eliminar este profesor?</h3>
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