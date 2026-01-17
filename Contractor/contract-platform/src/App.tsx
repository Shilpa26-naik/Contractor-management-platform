import BlueprintPage from "./pages/BlueprintPage";
import ContractPage from "./pages/ContractPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  return (
    <>
      <header>
        <h1 style={{ textAlign: "center" }}>CONTRACT MANAGEMENT PLATFORM</h1>
      </header>
      <main className="container">
        <BlueprintPage />
        <ContractPage />
        <DashboardPage />
      </main>
    </>
  );
}
