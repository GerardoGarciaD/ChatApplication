import "./App.scss";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Chat from "./components/Chat/Chat";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ProtectedRoute from "./components/Router/ProtectedRoute";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <ProtectedRoute exact path="/" component={Chat}></ProtectedRoute>
          <Route path="/login" component={Login}></Route>
          <Route path="/register" component={Register}></Route>
          {/* Esto se renderiza cuando el Switch no encuentra ninguna ruta */}
          <Route render={() => <h1> 404 Page not found</h1>}></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
