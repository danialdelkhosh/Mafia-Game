import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { renderGamer } from "./gamer";
import { renderLog } from "./log";
import { showRole } from "./constant";
import { initState, prevStep, nextStep, saveState } from "./stateManager";
import { gamerSelected } from "./actions";

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = initState();
  }
  //####################################################################################
  tick() {
    this.setState(prevState => ({
      timer: prevState.timer + 1
    }));
  }
  //####################################################################################
  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }
  //####################################################################################
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  //####################################################################################
  handleClick(i) {
    let target = this.state.gamers.find(gamer => gamer.key === i);
    if (this.state.finish || !target.alive) return;
    saveState(this.state);
    gamerSelected(target, this.state);
  }
  //####################################################################################
  render() {
    return (
      <Container
        fluid
        className={
          this.state.day ? "dayContainer h-100" : "nightContainer h-100"
        }
      >
        <Row>
          <Col>
            <button
              className="btn btn-primary btn-lg btn-block p-4"
              onClick={() => {
                if (this.state.step !== showRole) {
                  this.setState({ ...prevStep(this.state) });
                }
              }}
            >
              {this.state.finish ? "شروع مجدد بازی" : "مرحله قبل"}
            </button>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="info alert alert-secondary mb-3">
              <h1 className="alert-heading">
                {!this.state.day
                  ? this.state.info
                  : `${Math.floor(this.state.timer / 60)}:${this.state.timer %
                      60}`}
              </h1>
            </div>
          </Col>
        </Row>
        <Row>
          {this.state.gamers.map(gamer => {
            return renderGamer({
              key: gamer.key,
              name: gamer.name,
              role: gamer.role,
              alive: gamer.alive,
              isShot: gamer.isShot,
              isDumb: gamer.isDumb,
              isDrunk: gamer.isDrunk,
              isAccused: gamer.isAccused,
              showRole: gamer.showRole,
              roleVisible: gamer.roleVisible,
              isDay: this.state.day,
              isGameFinished: this.state.finish,
              currentPerson: this.state.currentPerson,
              onClick: () => this.handleClick(gamer.key, this.state)
            });
          })}
        </Row>
        <Row>
          <Col>{renderLog(this.state)}</Col>
        </Row>
        <Row>
          <Col>
            {!this.state.finish ? (
              <button
                className="btn btn-info btn-lg btn-block p-4 mt-2"
                onClick={() => {
                  nextStep(this.state);
                }}
              >
                {"نفر/مرحله بعد"}
              </button>
            ) : (
              ""
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}
