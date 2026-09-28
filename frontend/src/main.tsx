import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { routes } from "./router/routes";
import { StatusBadge } from "./components/common/StatusBadge";
import { DashboardPage } from "./pages/DashboardPage";
import { DevicesPage } from "./pages/DevicesPage";
import "./styles.css";

const pageRegistry: Record<string, () => React.ReactElement> = {
  "/dashboard": DashboardPage,
  "/devices": DevicesPage
};

function Page({ name, route }: { name: string; route: string }) {
  const Registered = pageRegistry[route];
  if (Registered) return <Registered />;
  return <section className="page">
    <section className="page-head">
      <div>
        <p className="eyebrow">fire-inspect</p>
        <h1>{name}</h1>
      </div>
      <StatusBadge value="LOCAL_DATA" />
    </section>
    <section className="panel">
      <p>该模块正在建设中，当前评审请使用「消防合规总览」与「消防设备台账」。</p>
    </section>
  </section>;
}

function App() {
  const [active, setActive] = useState<string>(routes[0]?.route ?? "/dashboard");
  const current = routes.find((route) => route.route === active) ?? routes[0];
  return <div className="shell">
    <aside>
      <div className="brand">消防设施巡检维保平台</div>
      <nav>{routes.map((route) => <button key={route.route} className={active === route.route ? "active" : ""} onClick={() => setActive(route.route)}>{route.name}</button>)}</nav>
    </aside>
    <div className="page">
      <Page name={current?.name ?? "工作台"} route={current?.route ?? "/dashboard"} />
    </div>
  </div>;
}

createRoot(document.getElementById("root")!).render(<App />);

