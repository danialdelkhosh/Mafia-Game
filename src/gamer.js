import React from "react";
import { Col, Card } from "react-bootstrap";

export function renderGamer(props) {
  return (
    <Col xs={6} md={6}>
      <Card onClick={props.onClick} className={gamerStyle(props)}>
        <Card.Header>
          <span
            className={
              props.isGameFinished || props.showRole ? "visible" : "invisible"
            }
          >
            {props.role[0].persianName}
          </span>
        </Card.Header>
        <Card.Body>
          <Card.Title className="display-3">{props.name}</Card.Title>
          <span className="badge badge-dark">
            {props.alive && props.isDumb && props.isDay ? "لال شده" : ""}
          </span>
        </Card.Body>
      </Card>
    </Col>
  );
}

export class Gamer {
  constructor(
    key,
    name,
    role,
    alive,
    roleVisible,
    isShot,
    isDumb,
    isDrunk,
    isDisabled,
    showRole
  ) {
    this.key = key;
    this.name = name;
    this.role = role;
    this.alive = alive;
    this.roleVisible = roleVisible;
    this.isShot = isShot;
    this.isDumb = isDumb;
    this.isDrunk = isDrunk;
    this.isDisabled = isDisabled;
  }
}

function gamerStyle(props) {
  let classNames = "gamerContainer m-3 ";
  if (props.alive) {
    if (props.showRole) return classNames + "text-white bg-primary";
    if (props.roleVisible) return classNames + "text-white bg-success";
    if (props.currentPerson === props.name)
      return classNames + "text-white bg-success";
    if (props.isDumb) return classNames + "text-white bg-danger";
    return classNames + "bg-light";
  } else return classNames + "text-white bg-dark";
}
