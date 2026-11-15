import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Error404 from "./pages/Error404";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/layout/Layout";
import Unauthorized from "./pages/Unauthourized";
import ProtectedRoute from "./components/protected/ProtectedRoute";
import VerifyEmail from "./pages/VerifyEmail";
import ResendVerification from "./pages/ResendVerification";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="signup" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="verify-email/:token" element={<VerifyEmail />} />
          <Route path="resend-verification" element={<ResendVerification />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
          <Route path="unauthorized" element={<Unauthorized />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Router>
  );
}

export default App;
