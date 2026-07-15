import { useEffect } from "react";
import Header from "../../components/common/Header";
import useApi from "../../hooks/useApi";
import { userService } from "../../services/funvalApi";
import { useState } from "react";

export default function UserManagment() {
  const { loading, error, execute: cargandoLista } = useApi(userService.list);
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    async function traerDatos() {
      try {
        const usuarios = await cargandoLista();
        console.log(usuarios);
        setDatos(usuarios);
      } catch (error) {
        console.error(error);
      }
    }
    traerDatos();
  }, []);

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col h-screen w-72 bg-surface-container-low border-r border-outline-variant shadow-md z-40 sticky top-0 mt-6">
        <div className="px-md py-sm flex items-center gap-md bg-surface-container rounded-lg mx-md mb-lg">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-container flex items-center justify-center">
            <img
              alt="Admin Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGhPnaPjuFO0crvQ7t8umM3sius0LSyX6PagHiKTcTmjjW7kVqKeiHlQEYjVlTne6eVqksHWywjgCLlOiHTHYO9OIr_ED3IxPDBDD9pBJv1JYTFLBAaif84N2_D6Zj27dfKXuobZZV0B_n_B26mYxOBClDLKyyu74wee7lUH8O-2YOG61dtZI1NF5Et8EStmpxecarNbGdWirzrQniI141sTnnff0-NYlaVog0UxTrNpxxzJgPCpR2SjU1AOoYiR9qgPnCsx-_hMw"
            />
          </div>
          <div>
            <p className="text-label-md font-label-md text-on-surface">
              Admin Panel
            </p>
            <p className="text-body-sm font-body-sm text-on-surface-variant">
              Management System
            </p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <div className="space-y-1">
            <a
              className="text-on-surface-variant mx-2 my-1 px-4 py-3 flex items-center gap-md hover:bg-surface-container-highest transition-colors rounded-full"
              href="#"
            >
              <span className="material-symbols-outlined" data-icon="dashboard">
                dashboard
              </span>
              <span className="text-label-md font-label-md">Dashboard</span>
            </a>
            <a
              className="text-on-surface-variant mx-2 my-1 px-4 py-3 flex items-center gap-md hover:bg-surface-container-highest transition-colors rounded-full"
              href="#"
            >
              <span className="material-symbols-outlined" data-icon="group">
                group
              </span>
              <span className="text-label-md font-label-md">
                Student Records
              </span>
            </a>
            <a
              className="text-on-surface-variant mx-2 my-1 px-4 py-3 flex items-center gap-md hover:bg-surface-container-highest transition-colors rounded-full"
              href="#"
            >
              <span
                className="material-symbols-outlined"
                data-icon="assignment_late"
              >
                assignment_late
              </span>
              <span className="text-label-md font-label-md">Reports Queue</span>
            </a>
            <a
              className="bg-primary-container text-on-primary-container rounded-full mx-2 my-1 px-4 py-3 flex items-center gap-md translate-x-1 transition-transform"
              href="#"
            >
              <span
                className="material-symbols-outlined"
                data-icon="manage_accounts"
              >
                manage_accounts
              </span>
              <span className="text-label-md font-label-md">
                User Management
              </span>
            </a>
            <a
              className="text-on-surface-variant mx-2 my-1 px-4 py-3 flex items-center gap-md hover:bg-surface-container-highest transition-colors rounded-full"
              href="#"
            >
              <span className="material-symbols-outlined" data-icon="settings">
                settings
              </span>
              <span className="text-label-md font-label-md">Settings</span>
            </a>
          </div>
        </nav>
      </aside>
      <Header />
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative mt-14 px-2">
        {/* Content Area */}
        <div className="flex-1 p-container-margin-mobile md:p-container-margin-desktop pb-24 md:pb-lg">
          {/* Mobile Title */}
          <div className="md:hidden mb-md">
            <h1 className="text-headline-lg-mobile font-headline-lg-mobile text-on-background">
              Gestión de Usuarios
            </h1>
            <p className="text-body-sm font-body-sm text-on-surface-variant">
              Administra el acceso y roles del personal educativo.
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md mb-lg">
            <div className="hidden md:block">
              <p className="text-body-md font-body-md text-on-surface-variant">
                Total: 124 usuarios activos
              </p>
            </div>
            <button className="w-full sm:w-auto bg-primary text-on-primary font-label-md text-label-md px-lg py-md rounded-lg flex items-center justify-center gap-sm shadow-md hover:opacity-90 active:scale-95 transition-all">
              <span className="material-symbols-outlined" data-icon="add">
                add
              </span>
              Crear Nuevo Usuario
            </button>
          </div>

          {/* Bento Grid - Data Table */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low border-b border-outline-variant">
                  <tr>
                    <th className="px-lg py-md text-label-md font-label-md text-on-surface">
                      Usuario
                    </th>
                    <th className="px-lg py-md text-label-md font-label-md text-on-surface">
                      Email
                    </th>
                    <th className="px-lg py-md text-label-md font-label-md text-on-surface">
                      Rol
                    </th>
                    <th className="px-lg py-md text-label-md font-label-md text-on-surface text-right">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {datos.map((dato) => (
                    <tr className="hover:bg-surface-container-low transition-colors group">
                      <td className="px-lg py-md">
                        <div className="flex items-center gap-md">
                          <div>
                            <p className="text-body-md font-semibold text-on-surface">
                              {dato.first_name} {dato.last_name}
                            </p>
                            <p className="text-body-sm text-on-surface-variant md:hidden">
                              {dato.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-lg py-md hidden md:table-cell">
                        <span className="text-body-md text-on-surface-variant">
                          {dato.email}
                        </span>
                      </td>
                      <td className="px-lg py-md">
                        <span className="soft-fill-emerald px-sm py-xs rounded-full text-label-sm font-label-sm font-bold uppercase tracking-wider">
                          {dato.role}
                        </span>
                      </td>
                      <td className="px-lg py-md text-right">
                        <div className="flex justify-end gap-sm">
                          <button
                            className="p-sm text-primary hover:bg-primary-fixed-dim rounded-full transition-colors"
                            title="Editar"
                          >
                            <span
                              className="material-symbols-outlined"
                              data-icon="edit"
                            >
                              edit
                            </span>
                          </button>
                          <button
                            className="p-sm text-error hover:bg-error-container rounded-full transition-colors"
                            title="Eliminar"
                          >
                            <span
                              className="material-symbols-outlined"
                              data-icon="delete"
                            >
                              delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {/* Row 2 */}
                  <tr className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-md">
                        <div className="w-10 h-10 rounded-full bg-tertiary-fixed-dim flex items-center justify-center text-on-tertiary-fixed font-bold">
                          MV
                        </div>
                        <div>
                          <p className="text-body-md font-semibold text-on-surface">
                            Marta Villalobos
                          </p>
                          <p className="text-body-sm text-on-surface-variant md:hidden">
                            marta.v@escuela.edu
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-lg py-md hidden md:table-cell">
                      <span className="text-body-md text-on-surface-variant">
                        marta.villalobos@escuela.edu
                      </span>
                    </td>
                    <td className="px-lg py-md">
                      <span className="soft-fill-amber px-sm py-xs rounded-full text-label-sm font-label-sm font-bold uppercase tracking-wider">
                        Editor
                      </span>
                    </td>
                    <td className="px-lg py-md text-right">
                      <div className="flex justify-end gap-sm">
                        <button
                          className="p-sm text-primary hover:bg-primary-fixed-dim rounded-full transition-colors"
                          title="Editar"
                        >
                          <span
                            className="material-symbols-outlined"
                            data-icon="edit"
                          >
                            edit
                          </span>
                        </button>
                        <button
                          className="p-sm text-error hover:bg-error-container rounded-full transition-colors"
                          title="Eliminar"
                        >
                          <span
                            className="material-symbols-outlined"
                            data-icon="delete"
                          >
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-md">
                        <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold">
                          JS
                        </div>
                        <div>
                          <p className="text-body-md font-semibold text-on-surface">
                            Jorge Soto
                          </p>
                          <p className="text-body-sm text-on-surface-variant md:hidden">
                            jorge.s@escuela.edu
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-lg py-md hidden md:table-cell">
                      <span className="text-body-md text-on-surface-variant">
                        jorge.soto@escuela.edu
                      </span>
                    </td>
                    <td className="px-lg py-md">
                      <span className="bg-surface-container px-sm py-xs rounded-full text-label-sm font-label-sm font-bold text-outline-variant uppercase tracking-wider">
                        Lector
                      </span>
                    </td>
                    <td className="px-lg py-md text-right">
                      <div className="flex justify-end gap-sm">
                        <button
                          className="p-sm text-primary hover:bg-primary-fixed-dim rounded-full transition-colors"
                          title="Editar"
                        >
                          <span
                            className="material-symbols-outlined"
                            data-icon="edit"
                          >
                            edit
                          </span>
                        </button>
                        <button
                          className="p-sm text-error hover:bg-error-container rounded-full transition-colors"
                          title="Eliminar"
                        >
                          <span
                            className="material-symbols-outlined"
                            data-icon="delete"
                          >
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 4 */}
                  <tr className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-md">
                        <div className="w-10 h-10 rounded-full bg-on-tertiary-container flex items-center justify-center text-tertiary font-bold">
                          CP
                        </div>
                        <div>
                          <p className="text-body-md font-semibold text-on-surface">
                            Carmen Paz
                          </p>
                          <p className="text-body-sm text-on-surface-variant md:hidden">
                            carmen.p@escuela.edu
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-lg py-md hidden md:table-cell">
                      <span className="text-body-md text-on-surface-variant">
                        carmen.paz@escuela.edu
                      </span>
                    </td>
                    <td className="px-lg py-md">
                      <span className="soft-fill-amber px-sm py-xs rounded-full text-label-sm font-label-sm font-bold uppercase tracking-wider">
                        Editor
                      </span>
                    </td>
                    <td className="px-lg py-md text-right">
                      <div className="flex justify-end gap-sm">
                        <button
                          className="p-sm text-primary hover:bg-primary-fixed-dim rounded-full transition-colors"
                          title="Editar"
                        >
                          <span
                            className="material-symbols-outlined"
                            data-icon="edit"
                          >
                            edit
                          </span>
                        </button>
                        <button
                          className="p-sm text-error hover:bg-error-container rounded-full transition-colors"
                          title="Eliminar"
                        >
                          <span
                            className="material-symbols-outlined"
                            data-icon="delete"
                          >
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 5 */}
                  <tr className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-md">
                        <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold">
                          RT
                        </div>
                        <div>
                          <p className="text-body-md font-semibold text-on-surface">
                            Ricardo Tellez
                          </p>
                          <p className="text-body-sm text-on-surface-variant md:hidden">
                            ricardo.t@escuela.edu
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-lg py-md hidden md:table-cell">
                      <span className="text-body-md text-on-surface-variant">
                        ricardo.tellez@escuela.edu
                      </span>
                    </td>
                    <td className="px-lg py-md">
                      <span className="soft-fill-rose px-sm py-xs rounded-full text-label-sm font-label-sm font-bold uppercase tracking-wider">
                        Suspendido
                      </span>
                    </td>
                    <td className="px-lg py-md text-right">
                      <div className="flex justify-end gap-sm">
                        <button
                          className="p-sm text-primary hover:bg-primary-fixed-dim rounded-full transition-colors"
                          title="Editar"
                        >
                          <span
                            className="material-symbols-outlined"
                            data-icon="edit"
                          >
                            edit
                          </span>
                        </button>
                        <button
                          className="p-sm text-error hover:bg-error-container rounded-full transition-colors"
                          title="Eliminar"
                        >
                          <span
                            className="material-symbols-outlined"
                            data-icon="delete"
                          >
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pagination Desktop */}
            <div className="px-lg py-md bg-surface-container-low flex justify-between items-center border-t border-outline-variant">
              <span className="text-body-sm text-on-surface-variant">
                Mostrando 1-5 de 124 usuarios
              </span>
              <div className="flex items-center gap-xs">
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-highest transition-colors disabled:opacity-30"
                  disabled={true}
                >
                  <span
                    className="material-symbols-outlined"
                    data-icon="chevron_left"
                  >
                    chevron_left
                  </span>
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-on-primary text-label-md">
                  1
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-highest text-label-md">
                  2
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-highest text-label-md">
                  3
                </button>
                <span className="px-2">...</span>
                <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-highest text-label-md">
                  25
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-highest transition-colors">
                  <span
                    className="material-symbols-outlined"
                    data-icon="chevron_right"
                  >
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* BottomNavBar (Mobile) */}
      <nav className="md:hidden fixed bottom-0 w-full bg-surface shadow-lg h-20 flex justify-around items-center z-50 px-2 rounded-t-xl border-t border-outline-variant">
        <a
          className="flex flex-col items-center justify-center text-on-surface-variant"
          href="#"
        >
          <span className="material-symbols-outlined" data-icon="home">
            home
          </span>
          <span className="text-label-sm font-label-sm">Home</span>
        </a>
        <a
          className="flex flex-col items-center justify-center text-on-surface-variant"
          href="#"
        >
          <span className="material-symbols-outlined" data-icon="description">
            description
          </span>
          <span className="text-label-sm font-label-sm">Reports</span>
        </a>
        <a
          className="flex flex-col items-center justify-center text-on-surface-variant"
          href="#"
        >
          <span
            className="material-symbols-outlined text-headline-md"
            data-icon="add_circle"
          >
            add_circle
          </span>
          <span className="text-label-sm font-label-sm">New</span>
        </a>
        <a
          className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-full px-4 py-1 scale-95 transition-transform duration-150"
          href="#"
        >
          <span
            className="material-symbols-outlined"
            data-icon="admin_panel_settings"
          >
            admin_panel_settings
          </span>
          <span className="text-label-sm font-label-sm">Admin</span>
        </a>
      </nav>

      {/* Toast Notification (Hidden by default as per your original template classes) */}
      <div
        className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-lg py-md rounded-lg shadow-xl hidden z-[60] flex items-center gap-md"
        id="toast"
      >
        <span
          className="material-symbols-outlined text-primary-fixed"
          data-icon="check_circle"
        >
          check_circle
        </span>
        <span className="text-body-sm font-body-sm">
          Usuario eliminado con éxito.
        </span>
      </div>
    </div>
  );
}
