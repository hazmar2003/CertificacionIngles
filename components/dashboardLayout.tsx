"use client";
import { ReactNode} from "react";
import { useAuth } from "@/context/AuthContext";
import { SidebarItems } from "./SidebarItems";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { authState, logout } = useAuth();
  const router = useRouter();

  // Si no está autenticado, redirigir al login
  if (!authState.isAuthenticated) {
    router.push("/login");
    return null;
  }


  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Tonos azules y púrpuras */}
      <div className="hidden md:flex flex-col w-64 bg-gradient-to-b from-blue-800 to-purple-700 text-white">
        {/* Logo y marca */}
        <div className="flex items-center justify-center h-20 px-6 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <img
              src="/assets/img/uci_logo.png"
              alt="UCI Logo"
              className="h-16 w-44"
            />
          </Link>
        </div>

        {/* Información del usuario */}
        <div className="px-6 py-5 border-b border-white/10">
          <p className="font-medium truncate">  {authState?.role === 'student'
    ? `${authState.student?.user?.firstName || ''} ${authState.student?.user?.lastName || ''}`.trim()
    : authState?.role === 'teacher'
      ? `${authState.teacher?.user?.firstName || ''} ${authState.teacher?.user?.lastName || ''}`.trim()
      : authState?.role === 'admin'
        ? `${authState.admin?.user?.firstName || ''} ${authState.admin?.user?.lastName || ''}`.trim()
        : 'Usuario'}</p>
 
   <p className="text-sm text-white/80">
  {(() => {
    switch(authState?.role) {
      case 'student':
        return `Estudiante · ${authState.faculty || 'Sin facultad'}`;
      case 'teacher':
        return `Profesor · Departamento de Idiomas`;
      case 'admin':
        return `Administrador · Departamento de Idiomas`;
      default:
        return 'Usuario';
    }
  })()}
</p>
         
          {/* Cambiado aquí */}
        </div>

        {/* Menú de navegación */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            <SidebarItems/>{" "}
            {/* Pasamos role original, no roleDisplay */}
          </nav>
        </div>

        {/* Botón de logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header móvil - Coherencia con sidebar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-800 to-purple-700 text-white">
          <Link href="/dashboard">
            <img
              src="/assets/img/uci_logo.png"
              alt="UCI Logo"
              className="h-8"
            />
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-white hover:text-amber-300"
          >
            Salir
          </button>
        </header>

        {/* Área de contenido */}
        <main className="flex-1 overflow-y-auto bg-white">
          {/* Header del contenido - Sutil y profesional */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-800">
                Panel de Control
              </h1>

            </div>
          </div>

          {/* Contenido con espacio y fondo claro */}
          <div className="p-6 bg-white">{children}</div>
        </main>
      </div>
    </div>
  );
};
