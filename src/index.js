import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
//--------------------------------------------------------------------
import "./css/mafia.css";
import "bootstrap/dist/css/bootstrap.min.css";
//--------------------------------------------------------------------
import InitGame from "./initGame";
import Game from "./game";
//--------------------------------------------------------------------

ReactDOM.render(
  <BrowserRouter>
    <div>
      <Route exact path="/" component={InitGame} />
      <Route exact path="/game" component={Game} />
    </div>
  </BrowserRouter>,
  document.getElementById("root")
);
