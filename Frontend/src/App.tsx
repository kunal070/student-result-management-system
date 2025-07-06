import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LayoutProvider } from './context/LayoutContext';
import Home from './pages/Home';
import {AddStudent} from './pages/AddStudent';
import StudentList from './pages/StudentList'; 
import {AddCourse} from './pages/AddCourse';
import CourseList from './pages/CourseList'; 
import {AddResult} from './pages/AddResult';
import ResultList from './pages/ResultList'; 
import {NotFound} from './pages/NotFound'; 
import Layout from './components/layout/Layout';


function App() {
  return (
        <LayoutProvider>

   <Router>
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="add-student" element={<AddStudent />} />
      <Route path="students" element={<StudentList />} />
      <Route path="add-course" element={<AddCourse />} />
      <Route path="courses" element={<CourseList />} />
      <Route path="add-result" element={<AddResult />} />
      <Route path="results" element={<ResultList />} />
      <Route path="*" element={<NotFound />} /> {/* <-- 404 handler */}

    </Route>
  </Routes>
  <Toaster position="top-right" />
</Router>
    </LayoutProvider>


  );
}

export default App;
