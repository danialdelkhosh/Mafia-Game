import React, { Component } from "react";
import { Redirect } from "react-router";
import {
  Container,
  Row,
  Col,
  FormControl,
  Button,
  Card
} from "react-bootstrap";
//----------------------------------------------------------
import { Gamer } from "./gamer";
import {
  saveState,
  getState,
  getGamerList,
  addGamerToList
} from "./stateManager";
import { emptyState, roleList, Role } from "./constant";
import { arrayRemove, objectCompare, isObjectInArray } from "./utility";

export default class InitGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      finish: false,
      allGamers: [],
      selectedGamers: [],
      allRoles: [],
      selectedRoles: []
    };
    // اگر بازی در جریان نیست
    let gameState = getState();
    if (!gameState || objectCompare(gameState, [])) {
      this.state.allGamers = getGamerList();
      this.state.allRoles = roleList;
    } else this.state.finish = true;
  }
  //----------------------------------------------------------
  startGameClick() {
    var newState = emptyState;
    initializeGame(
      newState,
      [...this.state.selectedGamers],
      [...this.state.selectedRoles]
    );
    saveState(newState);
    this.setState({ finish: true });
  }
  //----------------------------------------------------------
  newGamerClick() {
    let gamer = this.newGamerName.value;
    if (isObjectInArray(gamer, getGamerList())) return;
    addGamerToList(gamer);
    this.setState({ allGamers: getGamerList() });
    this.newGamerName.value = "";
  }
  //----------------------------------------------------------
  addGamerClick(gamer) {
    if (isObjectInArray(gamer, this.state.selectedGamers))
      this.setState({
        selectedGamers: arrayRemove(this.state.selectedGamers, gamer)
      });
    else {
      this.state.selectedGamers.push(gamer);
      this.setState({
        selectedGamers: this.state.selectedGamers
      });
    }
  }
  //----------------------------------------------------------
  addRoleClick(role) {
    if (isObjectInArray(role, this.state.selectedRoles))
      this.setState({
        selectedRoles: arrayRemove(this.state.selectedRoles, role)
      });
    else {
      this.state.selectedRoles.push(role);
      this.setState({
        selectedRoles: this.state.selectedRoles
      });
    }
  }
  //----------------------------------------------------------
  render() {
    if (this.state.finish) return <Redirect push to="/game" />;
    else {
      return (
        <Container className="mt-3">
          <div className="box">
            <h1>انتخاب بازیکن ها</h1>
            <Row>
              <Col>
                <FormControl
                  type="text"
                  name="gamerNames"
                  className="m-2"
                  ref={input => (this.newGamerName = input)}
                />
              </Col>
              <Col>
                <Button size="lg" onClick={() => this.newGamerClick()} block>
                  افزودن بازیکن
                </Button>
              </Col>
            </Row>
            <Row>
              {this.state.allGamers.map((gamer, i) => {
                return (
                  <Col md={4} key={i}>
                    <Card
                      className="h1 m-3 rtl"
                      onClick={() => this.addGamerClick(gamer, this.state)}
                    >
                      <Card.Body>{gamer}</Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
            <Row>
              <Col>
                <FormControl
                  block
                  type="text"
                  name="gamerNames"
                  className="p-5 m-2 fs-2"
                  value={this.state.selectedGamers.join("-")}
                ></FormControl>
                <Button
                  size="lg"
                  variant="danger"
                  block
                  onClick={() => this.setState({ selectedGamers: [] })}
                >
                  پاک کردن افراد ({this.state.selectedGamers.length})
                </Button>
              </Col>
            </Row>
          </div>
          <div className="box">
            <h1>انتخاب نقش ها</h1>
            <Row>
              {this.state.allRoles.map((role, i) => {
                return (
                  <Col md={4} key={i}>
                    <Card
                      className="h1 m-3 rtl"
                      onClick={() => this.addRoleClick(role, this.state)}
                    >
                      <Card.Body>{role.persianName}</Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
            <Row>
              <Col>
                <FormControl
                  block
                  type="text"
                  name="gamerNames"
                  className="p-5 m-2 fs-2"
                  value={getSelectedRoles(this.state.selectedRoles)}
                ></FormControl>
                <Button
                  size="lg"
                  variant="danger"
                  block
                  onClick={() => this.setState({ selectedRoles: [] })}
                >
                  پاک کردن نقش ها ({this.state.selectedRoles.length})
                </Button>
              </Col>
            </Row>
          </div>
          <Row>
            <Col>
              <Button
                size="lg"
                block
                variant="success"
                onClick={() => this.startGameClick(this.state)}
              >
                شروع بازی
              </Button>
            </Col>
          </Row>
        </Container>
      );
    }
  }
}
//----------------------------------------------------------------------------------
function getSelectedRoles(roles) {
  let roleNames = "";
  roles.map(role => (roleNames += role.persianName + "-"));
  return roleNames;
}
//----------------------------------------------------------------------------------
function initializeGame(state, gamerList, roleList) {
  let i;
  const gameRoles = roleList;
  const allGamer = [...gamerList];
  while (gamerList.length > 0) {
    i = Math.floor(Math.random() * gamerList.length);
    let gamer = new Gamer();
    gamer.key = allGamer.indexOf(gamerList[i]);
    gamer.name = gamerList[i];
    gamer.alive = true;
    gamer.roleVisible = true;
    if (gameRoles.length > 0) gamer.role = [gameRoles[0]];
    else gamer.role = [new Role("citizen", "شهروند", true, 99)];
    state.gamers.push(gamer);
    gamerList.splice(i, 1);
    gameRoles.splice(0, 1);
  }
  state.gamers.sort(() => Math.random() - 0.5);
}
