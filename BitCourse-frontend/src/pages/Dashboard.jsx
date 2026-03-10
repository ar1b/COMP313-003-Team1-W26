import "../styles/Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      <div className="dashboard-cards">

        <div className="card">
          <h3>Subjects</h3>
          <p>Manage subjects</p>
        </div>

        <div className="card">
          <h3>Departments</h3>
          <p>View departments</p>
        </div>

        <div className="card">
          <h3>Faculty</h3>
          <p>Manage faculty members</p>
        </div>

        <div className="card">
          <h3>Classes</h3>
          <p>View and manage classes</p>
        </div>

        <div className="card">
          <h3>Enrollments</h3>
          <p>Manage student enrollments</p>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;