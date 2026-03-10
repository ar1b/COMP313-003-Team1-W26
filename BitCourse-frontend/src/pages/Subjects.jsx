 import "../styles/Subjects.css";

function SubjectPage() {
  // Example subjects — you can later fetch from backend
  const subjects = [
    { name: "Math 101", description: "Introduction to Mathematics" },
    { name: "Physics 201", description: "Mechanics and Waves" },
    { name: "Chemistry 101", description: "Basics of Chemistry" },
    { name: "Biology 101", description: "Introduction to Biology" },
    { name: "English 101", description: "Basic English" },
    { name: "History 101", description: "World History Overview" },
  ];

  return (
    <div className="subject-container">
      <h1>Subjects</h1>

      <div className="subject-cards">
        {subjects.map((subject, index) => (
          <div key={index} className="card">
            <h3>{subject.name}</h3>
            <p>{subject.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubjectPage;