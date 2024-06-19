import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardBar from "../components/shared/DashboardBar";
import DashboardProfile from "../components/shared/DashboardProfile";
const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState<string>("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabParma = urlParams.get("tab");
    if (tabParma) {
      setTab(tabParma);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* sideNav */}
        <DashboardBar tab={tab} />
      </div>
      {/* profile */}
      {tab === "profile" ? <DashboardProfile /> : ""}
    </div>
  );
};

export default Dashboard;
