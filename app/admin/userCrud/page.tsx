'use client';
import { useState } from 'react';

import { DashboardLayout } from '@/components/dashboardLayout';
import StudentCrud from '../studentCrud/page';
import TeacherCrud from '../teacherCrud/page';
import AdminCrud from '../adminCrud/page';

export default function GestionUsuarioPage() {
  const [selectedRole, setSelectedRole] = useState<string>('estudiantes');

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Sección de selección de roles */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Gestionar Usuarios</h2>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="estudiantes-checkbox"
                checked={selectedRole === 'estudiantes'}
                onChange={() => handleRoleChange('estudiantes')}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              />
              <label htmlFor="estudiantes-checkbox" className="ml-2 block text-sm text-gray-700">
                Estudiantes
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="profesores-checkbox"
                checked={selectedRole === 'profesores'}
                onChange={() => handleRoleChange('profesores')}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              />
              <label htmlFor="profesores-checkbox" className="ml-2 block text-sm text-gray-700">
                Profesores
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="administradores-checkbox"
                checked={selectedRole === 'administradores'}
                onChange={() => handleRoleChange('administradores')}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              />
              <label htmlFor="administradores-checkbox" className="ml-2 block text-sm text-gray-700">
                Administradores
              </label>
            </div>
          </div>
        </div>

        {/* Contenedor dinámico para los CRUD */}
        <div className="bg-white p-4 rounded-lg shadow">
          {selectedRole === 'estudiantes' && <StudentCrud />}
          {selectedRole === 'profesores' && <TeacherCrud />}
          {selectedRole === 'administradores' && <AdminCrud />}
        </div>
      </div>
    </DashboardLayout>
  );
}