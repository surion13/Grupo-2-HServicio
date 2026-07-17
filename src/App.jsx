import { Route, Routes,Navigate } from "react-router-dom"
import Login from "./pages/auth/Login"
import PageNotFound from "./pages/PageNotFound"
import PrivateRoute from "./components/layout/PrivateRoute"
import RoleRoute from "./components/layout/RoleRoute"
import DashboardAdmin from "./pages/admin/DashboardAdmin"
import DashboardStudent from "./pages/student/DashboardStudent"
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import DashboardRedirect from "./components/layout/DashboardRedirect"

import Categories from "./pages/admin/Categories"; //aqui se importa
import Courses from "./pages/admin/Courses"; //aqui se importa
import UserManagment from "./pages/admin/UserManagement"
function App() {
  const { loading, user } = useContext(AuthContext)
  
  return (
    <>
      <Routes>
        {/* Public Routes */}
       <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route element={<PrivateRoute user={user} isLoading={loading} />} >

          <Route path="/redirect" element={<DashboardRedirect />} />
          
          {/* Rutas exclusivas para ADMIN */}
          <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/dashboard-admin" element={<DashboardAdmin />} />
            <Route path="/user-managment" element={<UserManagment />} />
            <Route path="/admin/categories" element={<Categories />} />
            <Route path="/admin/courses" element={<Courses />} />
          </Route>

          {/* Rutas para ADMIN y STUDENT */}
          <Route element={<RoleRoute allowedRoles={["ADMIN", "STUDENT"]} />} >
            <Route path="/dashboard-student" element={<DashboardStudent />} />
          </Route>

        </Route>

        {/* Captura de rutas no encontradas */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
