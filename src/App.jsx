import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Signup from './components/signup';
import Login from './components/login';
import Header from './components/header';
import Home from './main/home';
import Projects from './main/projects';
import Sprints from './main/sprints';  // Adjusted to match your component
import Task from './main/task';
import IndividualTask from './main/individual_task';
function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(!!localStorage.getItem('token'));

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Switch>
        <Route exact path="/" render={() => <Home isAuthenticated={isAuthenticated} />} />
        <Route path="/signup" component={Signup} />
        <Route path="/login">
          <Login onLogin={handleLogin} />
        </Route>
        <Route path="/projects" component={Projects} />
        <Route path="/project/:projectId/sprint" component={Sprints} />  {/* Adjusted to match your paths */}
        <Route path="/:projectId/sprint/:sprintId/tasks" component={Task} /> 
        <Route path="/:sprintId/task/:id" component={IndividualTask}/>
      </Switch>
    </Router>
  );
}

export default App;
