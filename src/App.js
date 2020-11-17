import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import Challenge from "./components/Challenge";
import Navigation from "./components/Navigation";

const App = () => {

  return (
    <div>
      <BrowserRouter>
      <Navigation />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/challenge" component={Challenge} />
          <Route exact path="/home" component={Home} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;