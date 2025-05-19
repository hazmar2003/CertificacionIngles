'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';



export const SidebarItems = () => {
  const { authState } = useAuth();
  const pathname = usePathname();
  console.log(authState)
  const roleSpecificItems = () => {
    if (authState?.role === 'student') {
      return [
        { name: 'Inicio', href: '/student/dashboard', iconPlaceholder: '' },
        { name: 'Convocatorias', href: '/teacher/examSessionCrud', iconPlaceholder: '' },
        { name: 'Más Estudiantes', href: '/admin/studentCrud', iconPlaceholder: '' }
      ];
    }
    
    if (authState?.role === 'teacher') {
      return [
        { name: 'Gestionar Pruebas', href: '/teacher/testCrud', iconPlaceholder: '' },
        { name: 'Revisar Pruebas', href: '/teacher/gradeWritingTestCompleted', iconPlaceholder: '' },
        { name: 'Gestionar Convocatorias', href: '/teacher/examSessionCrud', iconPlaceholder: '' },
        { name: 'Estudiantes', href: '/admin/studentCrud', iconPlaceholder: '' }
        
      ];
    }
    
    if (authState?.role === 'admin') {
      return [
        // { name: 'Estudiantes', href: '/admin/studentCrud', iconPlaceholder: '' },
        // { name: 'Profesores', href: '/admin/teacherCrud', iconPlaceholder: '' },
        // { name: 'Administradores', href: '/admin/adminCrud', iconPlaceholder: '' },
        { name: 'Gestionar Usuarios', href: '/admin/userCrud', iconPlaceholder: '' },
        { name: 'Pruebas', href: '/teacher/testCrud', iconPlaceholder: '' },
        { name: 'Convocatorias', href: '/teacher/examSessionCrud', iconPlaceholder: '' }
      ];
    }

    return [];
  };

  const allItems = [...roleSpecificItems()];

  return (
    <div className="space-y-1">
      {allItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
            pathname === item.href
              ? 'bg-indigo-700 text-white'
              : 'text-gray-200 hover:bg-purple-800 hover:text-white'
          }`}
        >
          <span className="mr-3 w-5 text-center">{item.iconPlaceholder}</span>
          {item.name}
        </Link>
      ))}
    </div>
  );
};