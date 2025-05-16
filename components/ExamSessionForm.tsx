'use client';
import { useState } from 'react';
import { Test } from '../types/Test';
import { Student } from '../types/Student';
import { ExamSession } from '../types/ExamSession';

interface ExamSessionFormProps {
  examSession?: ExamSession;
  tests: Test[];
  students: Student[];
  onSubmit: (session: ExamSession) => void;
  onCancel: () => void;
  dateError?: string | null;
  studentError?: string | null;
}

export default function ExamSessionForm({ 
  examSession, 
  tests, 
  students, 
  onSubmit, 
  onCancel,
  dateError,
  studentError
}: ExamSessionFormProps) {
  const [selectedTest, setSelectedTest] = useState<string>(examSession?.test?.id || '');
  const [selectedStudents, setSelectedStudents] = useState<string[]>(
    examSession?.students?.map(s => s.id!) || []
  );
  const [sessionDate, setSessionDate] = useState<string>(
    examSession?.date || ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTest || !sessionDate) {
      alert('Por favor selecciona un test y una fecha');
      return;
    }

    const selectedTestObj = tests.find(t => t.id === selectedTest);
    const selectedStudentsObj = students.filter(s => selectedStudents.includes(s.id!));

    onSubmit({
      ...examSession,
      id: examSession?.id || Date.now().toString(),
      test: selectedTestObj,
      students: selectedStudentsObj,
      date: sessionDate // Enviamos el string directamente
    });
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Test *
        </label>
        <select
          value={selectedTest}
          onChange={(e) => setSelectedTest(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          required
        >
          <option value="">Selecciona un test</option>
          {tests.map(test => (
            <option key={test.id} value={test.id}>
              {test.title} ({test.testType})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha y Hora *
        </label>
        <input
          type="datetime-local"
          value={sessionDate}
          onChange={(e) => setSessionDate(e.target.value)}
          min={new Date().toISOString().slice(0, 16)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          required
        />
        {dateError && (
          <p className="mt-1 text-sm text-red-600">{dateError}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Estudiantes
        </label>
        <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md p-2">
          {students.map(student => (
            <div key={student.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`student-${student.id}`}
                checked={selectedStudents.includes(student.id!)}
                onChange={() => toggleStudentSelection(student.id!)}
                className="mr-2"
              />
              <label htmlFor={`student-${student.id}`}>
                {student.user?.firstName} {student.user?.lastName} ({student.faculty})
              </label>
            </div>
          ))}
           {studentError && (
          <p className="mt-1 text-sm text-red-600">{studentError}</p>
        )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700 transition-colors"
        >
          {examSession?.id ? 'Actualizar Sesión' : 'Crear Sesión'}
        </button>
      </div>
    </form>
  );
}