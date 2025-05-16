'use client';
import { Student } from '@/types/Student';
import { useState, useEffect } from 'react';

interface StudentFormProps {
  student: Student;
  onSubmit: (student: Student) => void;
  onCancel: () => void;
}

export default function StudentForm({ student: initialStudent, onSubmit, onCancel }: StudentFormProps) {
  const [student, setStudent] = useState<Student>(initialStudent);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setStudent(initialStudent);
    setPasswordConfirm('');
    setErrors({});
  }, [initialStudent]);

  const validateOfficialId = (officialId: string) => {
    if (!officialId) return "El carnet es obligatorio";
    if (!/^\d+$/.test(officialId)) return "El carnet solo puede contener números";
    if (officialId.length !== 11) return "El carnet debe tener exactamente 11 dígitos";
    
    // Extraer las partes de la fecha
    const day = parseInt(officialId.substring(4, 6));
    const month = parseInt(officialId.substring(2, 4));
    const year = parseInt(officialId.substring(0, 2));

    // Validar mes (01-12)
    if (month < 1 || month > 12) return "Los dígitos 3-4 deben ser un mes válido (01-12)";

    // Validar día según el mes
    const daysInMonth = new Date(2000, month, 0).getDate();
    if (day < 1 || day > daysInMonth) return `Los días (digitos 5-6) deben estar entre 01 y ${daysInMonth.toString().padStart(2, '0')} para el mes ${month.toString().padStart(2, '0')}`;

    // Validar año (00-06 o 60-99)
    if (!((year >= 60 && year <= 99) || (year <= 6 ))) {
      return "Los dígitos 1-2 deben ser un año válido (00-06 o 60-99)";
    }

    return "";
  };

  const validateEmail = (email: string) => {
    if (!email) return "El email es obligatorio";
    if (!/^[^@]+@estudiante\.uci\.cu$/.test(email)) {
      return "El email debe tener el formato username@estudiante.uci.cu";
    }
    return "";
  };

  const validatePhoneNumber = (phoneNumber: string) => {
    if (!phoneNumber) return "El teléfono es obligatorio";
    if (!/^\+53\d{8}$/.test(phoneNumber)) {
      return "El teléfono debe empezar con +53 seguido de 8 dígitos";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    if (!initialStudent.id && !password) return "La contraseña es obligatoria";
    
    if (password) {
      if (password.length < 8) {
        return "La contraseña debe tener al menos 8 caracteres";
      }
      
      if (!/[A-Z]/.test(password)) {
        return "Debe contener al menos una letra mayúscula";
      }
      
      if (!/[a-z]/.test(password)) {
        return "Debe contener al menos una letra minúscula";
      }
      
      if (!/[0-9]/.test(password)) {
        return "Debe contener al menos un número";
      }
      
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return "Debe contener al menos un carácter especial (ej. !@#$%^&*)";
      }
    }
    
    return "";
  };

  const validatePasswordConfirm = (confirm: string) => {
    if (student.user?.password && student.user.password !== confirm) {
      return "Las contraseñas no coinciden";
    }
    if (!initialStudent.id && !confirm) return "Debe confirmar la contraseña";
    return "";
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'officialId':
        return validateOfficialId(value);
      case 'email':
        return validateEmail(value);
      case 'phoneNumber':
        return validatePhoneNumber(value);
      case 'password':
        return validatePassword(value);
      case 'passwordConfirm':
        return validatePasswordConfirm(value);
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'firstName' || name === 'lastName' || name === 'email' || name === 'officialId') {
      setStudent(prev => ({ 
        ...prev, 
        user: { ...prev.user, [name]: value } 
      }));
    } else if (name === 'password') {
      setStudent(prev => ({
        ...prev,
        user: {
          ...prev.user,
          password: value
        }
      }));
    } else {
      setStudent(prev => ({ ...prev, [name]: value }));
    }

    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handlePasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPasswordConfirm(value);
    const error = validatePasswordConfirm(value);
    setErrors(prev => ({ ...prev, passwordConfirm: error }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validar campos obligatorios
    if (!student.user?.firstName) newErrors.firstName = "El nombre es obligatorio";
    if (!student.user?.lastName) newErrors.lastName = "El apellido es obligatorio";
    if (!student.address) newErrors.address = "La dirección es obligatoria";
    if (!student.faculty) newErrors.faculty = "La facultad es obligatoria";
    if (!student.group) newErrors.group = "El grupo es obligatorio";

    // Validar campos con reglas específicas
    newErrors.officialId = validateOfficialId(student.user?.officialId || '');
    newErrors.email = validateEmail(student.user?.email || '');
    newErrors.phoneNumber = validatePhoneNumber(student.phoneNumber || '');
    newErrors.password = validatePassword(student.user?.password || '');
    newErrors.passwordConfirm = validatePasswordConfirm(passwordConfirm);

    setErrors(newErrors);

    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(student);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre*</label>
          <input
            type="text"
            name="firstName"
            value={student.user?.firstName || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500`}
          />
          {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
        </div>
   
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Apellido*</label>
          <input
            type="text"
            name="lastName"
            value={student.user?.lastName || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500`}
          />
          {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Carnet de Identidad*</label>
          <input
            type="text"
            name="officialId"
            value={student.user?.officialId || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.officialId ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500`}
            maxLength={11}
          />
          {errors.officialId && <p className="mt-1 text-sm text-red-600">{errors.officialId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
          <input
            type="email"
            name="email"
            value={student.user?.email || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono*</label>
          <input
            type="tel"
            name="phoneNumber"
            value={student.phoneNumber || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500`}
            maxLength={11}
          />
          {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
        </div>

        {(!initialStudent.id || student.user?.password) && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {initialStudent.id ? 'Nueva Contraseña' : 'Contraseña*'}
              </label>
              <input
                type="input"
                name="password"
                value={student.user?.password || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500`}
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {initialStudent.id ? 'Confirmar Nueva Contraseña' : 'Confirmar Contraseña*'}
              </label>
              <input
                type="input"
                name="passwordConfirm"
                value={passwordConfirm}
                onChange={handlePasswordConfirmChange}
                className={`w-full px-3 py-2 border ${errors.passwordConfirm ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500`}
              />
              {errors.passwordConfirm && <p className="mt-1 text-sm text-red-600">{errors.passwordConfirm}</p>}
            </div>
          </>
        )}

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Dirección*</label>
          <input
            type="text"
            name="address"
            value={student.address || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500`}
          />
          {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Facultad*</label>
          <input
            type="text"
            name="faculty"
            value={student.faculty || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.faculty ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500`}
          />
          {errors.faculty && <p className="mt-1 text-sm text-red-600">{errors.faculty}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Grupo*</label>
          <input
            type="text"
            name="group"
            value={student.group || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.group ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500`}
          />
          {errors.group && <p className="mt-1 text-sm text-red-600">{errors.group}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de Colocación</label>
          <select
            name="ColocationLevel"
            value={student.ColocationLevel || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Ninguno</option>
            <option value="Below">Below (Insuficiente)</option>
            <option value="A1">A1 (Principiante)</option>
            <option value="A2">A2 (Básico)</option>
            <option value="B1">B1 (Intermedio)</option>
            <option value="B2">B2 (Intermedio Alto)</option>
            <option value="C1">C1 (Avanzado)</option>
            <option value="C2">C2 (Maestría)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de Comprensión</label>
          <select
            name="ComprehensionLevel"
            value={student.ComprehensionLevel || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Ninguno</option>
            <option value="Below">Below (Insuficiente)</option>
            <option value="A1">A1 (Principiante)</option>
            <option value="A2">A2 (Básico)</option>
            <option value="B1">B1 (Intermedio)</option>
            <option value="B2">B2 (Intermedio Alto)</option>
            <option value="C1">C1 (Avanzado)</option>
            <option value="C2">C2 (Maestría)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de Escritura</label>
          <select
            name="WritingLevel"
            value={student.WritingLevel || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Ninguno</option>
            <option value="Below">Below (Insuficiente)</option>
            <option value="A1">A1 (Principiante)</option>
            <option value="A2">A2 (Básico)</option>
            <option value="B1">B1 (Intermedio)</option>
            <option value="B2">B2 (Intermedio Alto)</option>
            <option value="C1">C1 (Avanzado)</option>
            <option value="C2">C2 (Maestría)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de Escucha</label>
          <select
            name="ListeningLevel"
            value={student.ListeningLevel || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Ninguno</option>
            <option value="Below">Below (Insuficiente)</option>
            <option value="A1">A1 (Principiante)</option>
            <option value="A2">A2 (Básico)</option>
            <option value="B1">B1 (Intermedio)</option>
            <option value="B2">B2 (Intermedio Alto)</option>
            <option value="C1">C1 (Avanzado)</option>
            <option value="C2">C2 (Maestría)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de Habla</label>
          <select
            name="SpeakingLevel"
            value={student.SpeakingLevel || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Ninguno</option>
            <option value="Below">Below (Insuficiente)</option>
            <option value="A1">A1 (Principiante)</option>
            <option value="A2">A2 (Básico)</option>
            <option value="B1">B1 (Intermedio)</option>
            <option value="B2">B2 (Intermedio Alto)</option>
            <option value="C1">C1 (Avanzado)</option>
            <option value="C2">C2 (Maestría)</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
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
          {initialStudent?.id ? 'Actualizar Estudiante' : 'Guardar Estudiante'}
        </button>
      </div>
    </form>
  );
}