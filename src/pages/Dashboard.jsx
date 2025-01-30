import { useEffect, useState } from "react";
import { api } from "../api/api";

const Dashboard = () => {
  // NOTE: ONLY FOR TESTING. WILL BE CHANGED SOON
  const [r, sr] = useState();

  useEffect(() => {
    const f = async () => {
      const response = await api.get("/protected");
      sr(response.data.success);
    };
    f();
  }, []);

  return <h1>Yeah: {r}</h1>;
};

export default Dashboard;
