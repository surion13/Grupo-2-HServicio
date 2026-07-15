import { Route, Routes } from "react-router-dom"
import Login from "./pages/auth/Login"
import PageNotFound from "./pages/PageNotFound"
import PrivateRoute from "./components/layout/PrivateRoute"
import RoleRoute from "./components/layout/RoleRoute"
import DashboardAdmin from "./pages/admin/DashboardAdmin"
import DashboardStudent from "./pages/student/DashboardStudent"



function App() {

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<PrivateRoute />} >
          <Route element={<RoleRoute roleUser="ADMIN" />}>
            <Route
              path="/dashboard-admin"
              element={<DashboardAdmin />} 
            />
          </Route>

          <Route element={<RoleRoute roleUser="STUDENT" />}>
            <Route 
              path="/dashboard-student"
              element={<DashboardStudent />}
            />
          </Route>
        </Route> 
        
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  )
}

export default App
