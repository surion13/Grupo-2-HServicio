import { Route, Routes } from "react-router-dom"
import Login from "./pages/auth/Login"
import PageNotFound from "./pages/PageNotFound"
import PrivateRoute from "./components/layout/PrivateRoute"
import RoleRoute from "./components/layout/RoleRoute"
import DashboardAdmin from "./pages/admin/DashboardAdmin"
import DashboardStudent from "./pages/student/DashboardStudent"
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import DashboardRedirect from "./components/layout/DashboardRedirect"

function App() {
  const { loading, user } = useContext(AuthContext)
  
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        <Route path="*" element={<PageNotFound />} />

        {/* Protected Routes */}

        <Route element={<PrivateRoute user={user} isLoading={loading} />} >

          <Route path="/redirect" element={<DashboardRedirect />} />
          
          <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/dashboard-admin"  element={<DashboardAdmin />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={["ADMIN", "STUDENT"]} />} >
            <Route path="/dashboard-student" element={<DashboardStudent />} />
          </Route>

        </Route>
      </Routes>
    </>
  );
}

export default App;