import "./App.css";
import Header from "./components/form/Header";
import AdvancedSurveyForm from "./components/Test";

function App() {
  return (
    <div className="min-h-screen p-4 bg-[#F0F4F9] ">
      <div className="max-w-5xl mx-auto">
        <Header
          title="Form Header"
          description="This is a description"
          postedBy="John Doe"
          createdAt="2023-01-01"
          modifiedAt="2023-01-02"
          isMultiStep={true}
        />
        <AdvancedSurveyForm />
      </div>
    </div>
  );
}

export default App;
