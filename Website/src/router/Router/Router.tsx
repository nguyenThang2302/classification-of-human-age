import { Routes, Route } from "react-router-dom";
import { useRoutePaths } from "@/hooks";
import { Home, Login, Metrics, Register, Users, DashboardUser, DashboardAdmin, HistoryImageDetail } from "@/pages";
import { PrivateRoute } from "../PrivateRoute";
import { PublicRoute } from "../PublicRoute";
import { useSession } from "@/hooks";
import { Sidebar, Uploads, History, Profile, SidebarAdmin, Download } from "@/components";
import { useState } from "react";

function Router() {
  const {
    LOGIN_PATH,
    METRICS_PATH,
    REGISTER_PATH,
    ROOT_PATH,
    USERS_PATH,
    USER_PATH,
    DASHBOARD_PATH,
    HISTORYIMAGEDETAIL_PATH,
  } = useRoutePaths();

  const { isAdmin, isAuthenticated } = useSession();

  const [selectedSection, setSelectedSection] = useState('history-image-details');
  const renderSection = () => {
    if (selectedSection === 'uploads') {
      return <Uploads />;
    } else if (selectedSection === 'history') {
      return <History />;
    } else if (selectedSection === 'logout') {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    } else if (selectedSection === 'profile') {
      return <Profile />;
    } else if (selectedSection === 'history-image-details') {
      return <HistoryImageDetail />;
    } else if (selectedSection === 'images-age') {
      return <Download />;
    }
  };

  return (
    <Routes>
      <Route
        path={ROOT_PATH}
        element={
          <PrivateRoute redirectTo={LOGIN_PATH}>
            {isAuthenticated ? (
              isAdmin ? <DashboardAdmin /> : <DashboardUser />
            ) : (
              <Login />
            )}
          </PrivateRoute>
        }
      />

      <Route
        path={DASHBOARD_PATH}
        element={
          <PrivateRoute redirectTo={LOGIN_PATH}>
            {isAdmin ? <DashboardAdmin /> : <DashboardUser />}
          </PrivateRoute>
        }
      />

      <Route
        path={HISTORYIMAGEDETAIL_PATH}
        element={
          <PrivateRoute redirectTo={LOGIN_PATH}>
            <div className="dashboard">
              {isAdmin ? <SidebarAdmin onMenuClick={setSelectedSection} /> : <Sidebar onMenuClick={setSelectedSection} />}
              <div className="content">{renderSection()}</div>
            </div>
          </PrivateRoute>
        }
      />

      <Route
        path={LOGIN_PATH}
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path={REGISTER_PATH}
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      <Route
        path={METRICS_PATH}
        element={
          <PrivateRoute permissions={["metrics.list"]} redirectTo={LOGIN_PATH}>
            <Metrics />
          </PrivateRoute>
        }
      />

      <Route
        path={USERS_PATH}
        element={
          <PrivateRoute permissions={["users.list", "users.create"]}>
            <Users />
          </PrivateRoute>
        }
      />

      <Route
        path={USER_PATH}
        element={
          <PrivateRoute permissions={["users.list", "users.create"]}>
            <Users />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  );
}

export default Router;
