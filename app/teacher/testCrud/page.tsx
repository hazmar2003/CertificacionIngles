'use client';
import { useState, useMemo, useRef } from 'react';
import { DashboardLayout } from '@/components/dashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Test } from '../../../types/Test';
import { Question } from '@/types/Question';

export default function TestCrud() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTest, setCurrentTest] = useState<Test | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { authState } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Determinar permisos
  const isAdmin = authState?.role === 'admin';
  const isTeacher = authState?.role === 'teacher';
  const canEdit = isAdmin || isTeacher;

  // Datos de ejemplo con fechas como strings
  const [tests, setTests] = useState<Test[]>([
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
      createdAt: '2023-05-15T00:00:00'
    }
  ]);

  // Función para formatear fecha string a formato legible
  const formatDateString = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  // Filtrar pruebas basado en el término de búsqueda
  const filteredTests = useMemo(() => {
    if (!searchTerm) return tests;
    
    const term = searchTerm.toLowerCase();
    return tests.filter(test => {
      const dateString = formatDateString(test.createdAt).toLowerCase();
      return (
        test.title.toLowerCase().includes(term) ||
        test.description.toLowerCase().includes(term) ||
        test.testType.toLowerCase().includes(term) ||
        test.createdBy.toLowerCase().includes(term) ||
        dateString.includes(term) ||
        test.questions.some(q => 
          q.text.toLowerCase().includes(term) ||
          q.options.some(o => o.text.toLowerCase().includes(term))
        ) ||
        (test.writingPrompt && test.writingPrompt.toLowerCase().includes(term))
      );
    });
  }, [tests, searchTerm]);

  const validateTest = (testData: Test): boolean => {
    if (!testData.title.trim()) {
      alert('Por favor ingresa un título para la prueba');
      return false;
    }

    if (!testData.description.trim()) {
      alert('Por favor ingresa una descripción para la prueba');
      return false;
    }

    if (testData.testType === 'Writing' && !testData.writingPrompt?.trim()) {
      alert('Por favor ingresa el enunciado para la prueba de escritura');
      return false;
    }

    if (testData.testType === 'Listening' && !testData.audioFile) {
      alert('Por favor selecciona un archivo de audio para la prueba de listening');
      return false;
    }

    if ((testData.testType === 'Comprehension' || testData.testType === 'Listening') && 
        testData.questions.length < 1) {
      alert('Por favor ingresa al menos una pregunta para la prueba');
      return false;
    }

    if (testData.testType === 'Comprehension' || testData.testType === 'Listening') {
      for (const question of testData.questions) {
        if (!question.text.trim()) {
          alert(`Por favor completa el texto de la pregunta "${question.id}"`);
          return false;
        }

        for (const option of question.options) {
          if (!option.text.trim()) {
            alert(`Por favor completa todas las opciones de la pregunta "${question.id}"`);
            return false;
          }
        }

        const correctOptions = question.options.filter(o => o.isCorrect);
        if (correctOptions.length !== 1) {
          alert(`Por favor selecciona exactamente una opción correcta para la pregunta "${question.id}"`);
          return false;
        }
      }
    }

    return true;
  };

  const handleCreateOrUpdateTest = (testData: Test) => {
    if (!validateTest(testData)) return;

    if (currentTest?.id) {
      setTests(tests.map(t => t.id === currentTest.id ? { 
        ...testData,
        id: currentTest.id,
        createdAt: currentTest.createdAt
      } : t));
    } else {
      const newTest = {
        ...testData,
        id: Date.now().toString(),
        createdBy: authState?.teacher?.user?.email || 'unknown',
        createdAt: new Date().toISOString()
      };
      setTests([...tests, newTest]);
    }
    setIsModalOpen(false);
    setCurrentTest(null);
  };

  const handleEditTest = (test: Test) => {
    setCurrentTest(test);
    setIsModalOpen(true);
  };

  const handleDeleteTest = (id: string) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      setTests(tests.filter(test => test.id !== deleteConfirm));
      setDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const addNewQuestion = () => {
    if (!currentTest || currentTest.testType === 'Writing') return;
    
    const newQuestionId = `q${currentTest.questions.length + 1}`;
    const newQuestion: Question = {
      id: newQuestionId,
      text: '',
      options: Array(4).fill(null).map((_, i) => ({
        id: `${newQuestionId}-o${i + 1}`,
        text: '',
        isCorrect: i === 0
      }))
    };
    
    setCurrentTest({
      ...currentTest,
      questions: [...currentTest.questions, newQuestion]
    });
  };

  const removeQuestion = (questionId: string) => {
    if (!currentTest || currentTest.testType === 'Writing') return;
    
    setCurrentTest({
      ...currentTest,
      questions: currentTest.questions.filter(q => q.id !== questionId)
    });
  };

  const handleQuestionChange = (questionId: string, text: string) => {
    if (!currentTest || currentTest.testType === 'Writing') return;
    
    setCurrentTest({
      ...currentTest,
      questions: currentTest.questions.map(q => 
        q.id === questionId ? { ...q, text } : q
      )
    });
  };

  const handleOptionChange = (questionId: string, optionId: string, text: string) => {
    if (!currentTest || currentTest.testType === 'Writing') return;
    
    setCurrentTest({
      ...currentTest,
      questions: currentTest.questions.map(q => 
        q.id === questionId 
          ? { 
              ...q, 
              options: q.options.map(o => 
                o.id === optionId ? { ...o, text } : o
              ) 
            } 
          : q
      )
    });
  };

  const setCorrectAnswer = (questionId: string, optionId: string) => {
    if (!currentTest || currentTest.testType === 'Writing') return;
    
    setCurrentTest({
      ...currentTest,
      questions: currentTest.questions.map(q => 
        q.id === questionId 
          ? { 
              ...q, 
              options: q.options.map(o => ({
                ...o,
                isCorrect: o.id === optionId
              })) 
            } 
          : q
      )
    });
  };

  const handleTestChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!currentTest) return;
    
    const { name, value } = e.target;
    setCurrentTest({
      ...currentTest,
      [name]: value
    });

    if (name === 'testType') {
      if (value === 'Writing') {
        setCurrentTest({
          ...currentTest,
          testType: 'Writing',
          questions: [],
          audioFile: null,
          writingPrompt: ''
        });
      } else if (value === 'Listening') {
        setCurrentTest({
          ...currentTest,
          testType: 'Listening',
          writingPrompt: undefined,
          questions: currentTest.questions.length > 0 ? currentTest.questions : [
            {
              id: 'q1',
              text: '',
              options: Array(4).fill(null).map((_, i) => ({
                id: `q1-o${i + 1}`,
                text: '',
                isCorrect: i === 0
              }))
            }
          ]
        });
      } else { // Comprehension
        setCurrentTest({
          ...currentTest,
          testType: 'Comprehension',
          audioFile: null,
          writingPrompt: undefined,
          questions: currentTest.questions.length > 0 ? currentTest.questions : [
            {
              id: 'q1',
              text: '',
              options: Array(4).fill(null).map((_, i) => ({
                id: `q1-o${i + 1}`,
                text: '',
                isCorrect: i === 0
              }))
            }
          ]
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentTest || !e.target.files) return;
    
    const file = e.target.files[0];
    if (file) {
      setCurrentTest({
        ...currentTest,
        audioFile: file
      });
    }
  };

  const handleWritingPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!currentTest) return;
    
    setCurrentTest({
      ...currentTest,
      writingPrompt: e.target.value
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto relative">  
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Administración de Pruebas</h2>
          {canEdit && (
            <button 
              onClick={() => {
                setCurrentTest({
                  id: '',
                  title: '',
                  description: '',
                  testType: 'Comprehension',
                  questions: [
                    {
                      id: 'q1',
                      text: '',
                      options: Array(4).fill(null).map((_, i) => ({
                        id: `q1-o${i + 1}`,
                        text: '',
                        isCorrect: i === 0
                      }))
                    }
                  ],
                  createdBy: authState?.teacher?.user?.email || '',
                  createdAt: ''
                });
                setIsModalOpen(true);
              }}
              className="w-36 h-10 justify-center py-2 text-sm font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700 transition-colors"
            >
              Crear Prueba
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
              placeholder="Buscar pruebas..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {filteredTests.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-4">
            {searchTerm ? (
              <p className="text-gray-500">No se encontraron pruebas que coincidan con "{searchTerm}"</p>
            ) : (
              <p className="text-gray-500">No hay pruebas registradas</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preguntas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creada por</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  {canEdit && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTests.map((test) => (
                  <tr key={test.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{test.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        test.testType === 'Comprehension' ? 'bg-blue-100 text-blue-800' :
                        test.testType === 'Listening' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {test.testType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 line-clamp-2">{test.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {test.testType === 'Writing' ? 'Escritura' : test.questions.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {test.createdBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateString(test.createdAt)}
                    </td>
                    {canEdit && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditTest(test)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteTest(test.id)}
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
      
      {/* Modal para crear/editar prueba */}
      {isModalOpen && currentTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold text-gray-800">
                {currentTest.id ? 'Editar Prueba' : 'Nueva Prueba'}
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
              <div className="grid grid-cols-1 gap-6 mb-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Título del Test *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={currentTest.title}
                    onChange={handleTestChange}
                    className={`w-full px-3 py-2 border ${!currentTest.title.trim() ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500`}
                    required
                  />
                  {!currentTest.title.trim() && (
                    <p className="mt-1 text-sm text-red-600">Por favor ingresa un título</p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={currentTest.description}
                    onChange={handleTestChange}
                    rows={3}
                    className={`w-full px-3 py-2 border ${!currentTest.description.trim() ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500`}
                    required
                  />
                  {!currentTest.description.trim() && (
                    <p className="mt-1 text-sm text-red-600">Por favor ingresa una descripción</p>
                  )}
                </div>

                <div>
                  <label htmlFor="testType" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Test *
                  </label>
                  <select
                    id="testType"
                    name="testType"
                    value={currentTest.testType}
                    onChange={handleTestChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  >
                    <option value="Comprehension">Comprensión</option>
                    <option value="Listening">Listening</option>
                    <option value="Writing">Escritura</option>
                  </select>
                </div>

                {currentTest.testType === 'Listening' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Archivo de Audio *
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="audio/*"
                      className="hidden"
                    />
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={triggerFileInput}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                      >
                        Seleccionar Audio
                      </button>
                      <span className="ml-3 text-sm text-gray-500">
                        {currentTest.audioFile instanceof File 
                          ? currentTest.audioFile.name 
                          : typeof currentTest.audioFile === 'string' 
                            ? currentTest.audioFile 
                            : 'Ningún archivo seleccionado'}
                      </span>
                    </div>
                    {!currentTest.audioFile && (
                      <p className="mt-1 text-sm text-red-600">Por favor selecciona un archivo de audio</p>
                    )}
                    {typeof currentTest.audioFile === 'string' && currentTest.audioFile && (
                      <div className="mt-2">
                        <audio controls className="w-full">
                          <source src={currentTest.audioFile} type="audio/mpeg" />
                          Tu navegador no soporta el elemento de audio.
                        </audio>
                      </div>
                    )}
                  </div>
                )}

                {currentTest.testType === 'Writing' && (
                  <div>
                    <label htmlFor="writingPrompt" className="block text-sm font-medium text-gray-700 mb-1">
                      Enunciado de Escritura *
                    </label>
                    <textarea
                      id="writingPrompt"
                      value={currentTest.writingPrompt || ''}
                      onChange={handleWritingPromptChange}
                      rows={4}
                      className={`w-full px-3 py-2 border ${!currentTest.writingPrompt?.trim() ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500`}
                      required
                      placeholder="Escribe aquí el enunciado para la prueba de escritura"
                    />
                    {!currentTest.writingPrompt?.trim() && (
                      <p className="mt-1 text-sm text-red-600">Por favor ingresa el enunciado</p>
                    )}
                  </div>
                )}
              </div>

              {(currentTest.testType === 'Comprehension' || currentTest.testType === 'Listening') && (
                <>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Preguntas</h3>
                  
                  {currentTest.questions.map((question, qIndex) => (
                    <div key={question.id} className="mb-8 p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-700">Pregunta {qIndex + 1}</h4>
                        {currentTest.questions.length > 1 && (
                          <button
                            onClick={() => removeQuestion(question.id)}
                            className="text-red-500 text-sm hover:text-red-700"
                          >
                            Eliminar pregunta
                          </button>
                        )}
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor={`question-${question.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Texto de la Pregunta *
                        </label>
                        <input
                          type="text"
                          id={`question-${question.id}`}
                          value={question.text}
                          onChange={(e) => handleQuestionChange(question.id, e.target.value)}
                          className={`w-full px-3 py-2 border ${!question.text.trim() ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500`}
                          required
                        />
                        {!question.text.trim() && (
                          <p className="mt-1 text-sm text-red-600">Por favor escribe la pregunta</p>
                        )}
                      </div>

                      <h5 className="text-sm font-medium text-gray-700 mb-2">Opciones (Selecciona la respuesta correcta) *</h5>
                      
                      {question.options.map((option, oIndex) => (
                        <div key={option.id} className="flex items-center mb-2">
                          <input
                            type="radio"
                            name={`correct-answer-${question.id}`}
                            checked={option.isCorrect}
                            onChange={() => setCorrectAnswer(question.id, option.id)}
                            className="mr-2"
                          />
                          <div className="flex-1">
                            <input
                              type="text"
                              value={option.text}
                              onChange={(e) => handleOptionChange(question.id, option.id, e.target.value)}
                              placeholder={`Opción ${oIndex + 1}`}
                              className={`w-full px-3 py-2 border ${!option.text.trim() ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500`}
                              required
                            />
                            {!option.text.trim() && (
                              <p className="mt-1 text-sm text-red-600">Por favor completa esta opción</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addNewQuestion}
                    className="mb-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    + Añadir otra pregunta
                  </button>
                </>
              )}
              </div>

              <div className="flex justify-end space-x-3 p-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => handleCreateOrUpdateTest(currentTest)}
                  className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700 transition-colors"
                >
                  {currentTest.id ? 'Actualizar Prueba' : 'Guardar Prueba'}
                </button>
              </div>
            </div>
          </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">¿Estás seguro de eliminar esta prueba?</h3>
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