import { Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import PageNotFound from "./pages/PageNotFound";
import PrivateRoute from "./components/layout/PrivateRoute";
import RoleRoute from "./components/layout/RoleRoute";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import DashboardStudent from "./pages/student/DashboardStudent";
import UserManagment from "./pages/admin/UserManagement";

import Categories from "./pages/admin/Categories"; //aqui se importa
import Courses from "./pages/admin/Courses"; //aqui se importa
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<PrivateRoute />}>
          <Route element={<RoleRoute roleUser="ADMIN" />}>
            <Route path="/dashboard-admin" element={<DashboardAdmin />} />
            <Route path="/user-managment" element={<UserManagment />} />
            <Route path="/dashboard-admin" element={<DashboardAdmin />} />
            //aqui se agrega la ruta componente Categories y Courses
            <Route path="/admin/categories" element={<Categories />} />
            <Route path="/admin/courses" element={<Courses />} />
          </Route>

          <Route element={<RoleRoute roleUser="STUDENT" />}>
            <Route path="/dashboard-student" element={<DashboardStudent />} />
          </Route>
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
