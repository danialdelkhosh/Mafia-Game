import React from "react";
import { Col, Card } from "react-bootstrap";

export function renderGamer(props) {
  return (
    <Col xs={6} md={6}>
      <Card
        onClick={props.onClick}
        className={gamerStyle(props.alive, props.roleVisible, props.isDumb)}
      >
        <Card.Header>
          <span className={props.isGameFinished ? "visible" : "hidden"}>
            {props.role[0].persianName}
          </span>
        </Card.Header>
        <Card.Body>
          <Card.Title className="display-2">{props.name}</Card.Title>
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
    isDisabled
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

function gamerStyle(alive, roleVisible, isDumb) {
  let classNames = "gamerContainer m-3 ";
  if (alive) {
    if (roleVisible) {
      return classNames + "text-white bg-success";
    } else if (isDumb) return classNames + "text-white bg-danger";
    else return classNames + "bg-light";
  } else return classNames + "text-white bg-dark";
}
