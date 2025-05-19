// components/GradeWritingTestCompleted.tsx
'use client';
import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboardLayout';
import { TestCompleted } from '@/types/TestCompleted';
import { Student } from '@/types/Student';
import { Test } from '@/types/Test';
import { Answer } from '@/types/Answer';

// Sample data in English with all required fields
const sampleWritingTestsCompleted: TestCompleted[] = [
  {
    id: '1',
    test: {
      id: 'w1',
      title: 'Advanced Writing Test',
      description: 'Write an essay about your ideal vacation',
      testType: 'Writing',
      writingPrompt: 'Describe your ideal vacation destination in 250 words. Include details about the place, activities, and why you would recommend it.',
      createdBy: 'teacher1@example.com',
      createdAt: '2023-05-15',
      questions: [], // Empty array for writing tests
      audioFile: '' // Added to match Test type
    } as Test,
    examSession: {
      id: 's1',
      date: '2023-06-01T10:00:00',
      test: undefined, // Added to match ExamSession type
      students: [] // Added to match ExamSession type
    },
    student: {
      id: 'std1',
      user: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        officialId: '123456789', // Added to match User type
        password: '' // Added to match User type
      },
      phoneNumber: '', // Added to match Student type
      address: '', // Added to match Student type
      faculty: '', // Added to match Student type
      group: '' // Added to match Student type
    } as Student,
    writingResponse: 'My ideal vacation destination would be Japan. I would love to visit Tokyo for its mix of modernity and tradition. I would walk around Shibuya district, visit ancient temples in Kyoto, and try authentic ramen. I would recommend Japan for its fascinating culture, delicious food, and kind people. Additionally, I would like to experience an onsen (traditional hot spring) and see cherry blossoms in spring.',
    completedAt: '2023-06-01T11:30:00',
    status: 'submitted',
    answers: [] as Answer[] // Empty array for writing tests
  },
  {
    id: '2',
    test: {
      id: 'w2',
      title: 'Opinion Essay Test',
      description: 'Write an essay about technology in education',
      testType: 'Writing',
      writingPrompt: 'Do you think technology improves education? Write a 200-word essay expressing your opinion with concrete examples.',
      createdBy: 'teacher2@example.com',
      createdAt: '2023-06-10',
      questions: [], // Empty array for writing tests
      audioFile: '' // Added to match Test type
    } as Test,
    examSession: {
      id: 's2',
      date: '2023-06-15T09:00:00',
      test: undefined, // Added to match ExamSession type
      students: [] // Added to match ExamSession type
    },
    student: {
      id: 'std2',
      user: {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        officialId: '987654321', // Added to match User type
        password: '' // Added to match User type
      },
      phoneNumber: '', // Added to match Student type
      address: '', // Added to match Student type
      faculty: '', // Added to match Student type
      group: '' // Added to match Student type
    } as Student,
    writingResponse: 'In my opinion, technology significantly improves education. Platforms like online courses allow learning from anywhere. Tools like virtual simulators help practice complex skills safely. However, it is important to use it in a balanced way. For example, at my school we use tablets for research but we also keep physical books. The ideal is to combine the best of both worlds: the immediacy of technology with the depth of traditional methods.',
    completedAt: '2023-06-15T10:15:00',
    status: 'submitted',
    answers: [] as Answer[] // Empty array for writing tests
  }
];

export default function GradeWritingTestCompleted() {
  const [selectedTest, setSelectedTest] = useState<TestCompleted | null>(null);
  const [grade, setGrade] = useState<string>('Below A1');
  const [feedback, setFeedback] = useState<string>('');

  const handleGradeTest = () => {
    if (!selectedTest) return;
    
    alert(`Test graded!\n\nStudent: ${selectedTest.student.user?.firstName} ${selectedTest.student.user?.lastName}\nTest: ${selectedTest.test.title}\nAssigned level: ${grade}\nFeedback: ${feedback || 'None'}`);
    
    // In a real implementation, this would go to the backend
    console.log('Grade saved:', {
      testId: selectedTest.id,
      grade,
      feedback
    });
    
    setSelectedTest(null);
    setGrade('B1');
    setFeedback('');
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Revisar Pruebas de Escritura</h2>
        
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estudiante</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prueba</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de realización</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sampleWritingTestsCompleted.map((test) => (
                <tr key={test.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {test.student.user?.firstName} {test.student.user?.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{test.student.user?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{test.test.title}</div>
                    <div className="text-sm text-gray-500 line-clamp-1">{test.test.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(test.completedAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedTest(test)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Revisar Prueba
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Grading Modal */}
        {selectedTest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
                <h3 className="text-lg font-semibold text-gray-800">
                  Revisar Prueba: {selectedTest.test.title}
                </h3>
                <button 
                  onClick={() => setSelectedTest(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700">Student</h4>
                    <p className="mt-1">{selectedTest.student.user?.firstName} {selectedTest.student.user?.lastName}</p>
                    <p className="text-sm text-gray-500">{selectedTest.student.user?.email}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700">Test</h4>
                    <p className="mt-1">{selectedTest.test.title}</p>
                    <p className="text-sm text-gray-500">{selectedTest.test.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700">Submission Date</h4>
                    <p className="mt-1">{new Date(selectedTest.completedAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Test Prompt</h4>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="whitespace-pre-line">{selectedTest.test.writingPrompt}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Student's Response</h4>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="whitespace-pre-line">{selectedTest.writingResponse}</p>
                  </div>
                </div>

                <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                      Assigned Level *
                    </label>
                    <select
                      id="grade"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    >
                      <option value="Below A1">Below A1</option>
                      <option value="A1">A1</option>
                      <option value="A2">A2</option>
                      <option value="B1">B1</option>
                      <option value="B2">B2</option>
                      <option value="C1">C1</option>
                      <option value="C2">C2</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                      Feedback (optional)
                    </label>
                    <textarea
                      id="feedback"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Escribe tus comentarios para el estudiante..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 p-4 border-t">
                <button
                  onClick={() => setSelectedTest(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGradeTest}
                  className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700 transition-colors"
                >
                  Guardar Calificación
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}