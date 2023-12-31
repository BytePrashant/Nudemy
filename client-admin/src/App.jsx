import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Appbar from "./components/Appbar";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Courses from "./components/Courses";
import HomePage from "./components/Homepage";
import AddCourse from "./components/AddCourse";
import Course from "./components/Course";
import { RecoilRoot } from "recoil";

function App() {
  return (
    <div>
      <RecoilRoot>
        <Router>
          <Appbar />
          <Routes>
            <Route path="/" element={<HomePage />} />;
            <Route path="/addcourse" element={<AddCourse />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/courses/" element={<Courses />} />
            <Route path="/courses/:courseId" element={<Course />} />
          </Routes>
        </Router>
      </RecoilRoot>
    </div>
  );
}

export default App;
