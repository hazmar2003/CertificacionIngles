'use client';
import { Admin } from '@/types/Admin';
import { useState, useEffect } from 'react';

interface AdminFormProps {
  admin: Admin;
  onSubmit: (admin: Admin) => void;
  onCancel: () => void;
}

export default function AdminForm({ admin: initialAdmin, onSubmit, onCancel }: AdminFormProps) {
  const [admin, setAdmin] = useState<Admin>(initialAdmin);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setAdmin(initialAdmin);
    setPasswordConfirm('');
    setErrors({});
  }, [initialAdmin]);

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
    const daysInMonth = new Date(2000, month, 0).getDate(); // Usamos año 2000 (bisiesto) para cubrir febrero
    if (day < 1 || day > daysInMonth) return `Los días (dígitos 5-6) deben estar entre 01 y ${daysInMonth.toString().padStart(2, '0')} para el mes ${month.toString().padStart(2, '0')}`;
  
    // Validar año (00-06 o 60-99)
    if (!((year >= 60 && year <= 99) || (year <= 6 ))) {
      return "Los dígitos 1-2 deben ser un año válido (00-06 o 60-99)";
    }
  
    return "";
  };
  const validateEmail = (email: string) => {
    if (!email) return "El email es obligatorio";
    if (!/^[^@]+@admin\.uci\.cu$/.test(email)) {
      return "El email debe tener el formato username@admin.uci.cu";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    if (!initialAdmin.id && !password) return "La contraseña es obligatoria";
    
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
    if (admin.user?.password && admin.user.password !== confirm) {
      return "Las contraseñas no coinciden";
    }
    if (!initialAdmin.id && !confirm) return "Debe confirmar la contraseña";
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'firstName' || name === 'lastName' || name === 'email' || name === 'officialId') {
      setAdmin(prev => ({ 
        ...prev, 
        user: { ...prev.user, [name]: value } 
      }));
    } else if (name === 'password') {
      setAdmin(prev => ({
        ...prev,
        user: {
          ...prev.user,
          password: value
        }
      }));
    }

    if (name === 'password') {
      const error = validatePassword(value);
      setErrors(prev => ({ ...prev, password: error }));
    }
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
    if (!admin.user?.firstName) newErrors.firstName = "El nombre es obligatorio";
    if (!admin.user?.lastName) newErrors.lastName = "El apellido es obligatorio";
    if (!admin.user?.officialId) newErrors.officialId = "El carnet es obligatorio";
    if (!admin.user?.email) newErrors.email = "El email es obligatorio";

    // Validar campos con reglas específicas
    newErrors.officialId = validateOfficialId(admin.user?.officialId || '');
    newErrors.email = validateEmail(admin.user?.email || '');
    newErrors.password = validatePassword(admin.user?.password || '');
    newErrors.passwordConfirm = validatePasswordConfirm(passwordConfirm);

    setErrors(newErrors);

    // Verificar si hay algún error
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(admin);
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
            value={admin.user?.firstName || ''}
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
            value={admin.user?.lastName || ''}
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
            value={admin.user?.officialId || ''}
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
            value={admin.user?.email || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        {(!initialAdmin.id || admin.user?.password) && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {initialAdmin.id ? 'Nueva Contraseña' : 'Contraseña*'}
              </label>
              <input
                type="password"
                name="password"
                value={admin.user?.password || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500`}
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {initialAdmin.id ? 'Confirmar Nueva Contraseña' : 'Confirmar Contraseña*'}
              </label>
              <input
                type="password"
                name="passwordConfirm"
                value={passwordConfirm}
                onChange={handlePasswordConfirmChange}
                className={`w-full px-3 py-2 border ${errors.passwordConfirm ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500`}
              />
              {errors.passwordConfirm && <p className="mt-1 text-sm text-red-600">{errors.passwordConfirm}</p>}
            </div>
          </>
        )}
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
          {initialAdmin?.id ? 'Actualizar Administrador' : 'Guardar Administrador'}
        </button>
      </div>
    </form>
  );
}