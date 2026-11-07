import { useEffect, useState } from "react";

import { api } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/button/Button";

function Dashboard() {
  const { user, logout } = useAuth();

  const [message, setMessage] = useState("");

  useEffect(() => {
    const getDashboard = async () => {
      try {
        const response = await api.get("/auth/me");

        setMessage(response.data.message);
      } catch (error) {
        console.error(error);
      }
    };

    getDashboard();
  }, []);

  return (
    <div className="p-2">
      <div className="flex justify-between lg:p-4">
        <div>
          {" "}
          <h1 className="font-bold text-base md:text-md lg:text-lg">
            Welcome, {user?.firstName}
          </h1>
          <p>{message}</p>
          <p>Role: {user?.role}</p>
        </div>

        <Button onClick={logout} variant="primary">
          Log Out
        </Button>
      </div>
      {user?.role === "admin" && (
        <div>
          <h2>Admin Dashboard</h2>

          <p>You can manage users and system settings.</p>
          <Button onClick={logout} variant="secondary">
            Log Out
          </Button>
        </div>
      )}
      <div>
        <h2>User Dashboard</h2>

        <p>Welcome to your personal dashboard.</p>
      </div>
    </div>
  );
}

export default Dashboard;
