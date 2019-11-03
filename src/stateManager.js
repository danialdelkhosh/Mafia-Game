import { whoIsNext, startNight, startDay } from "./actions";
import { showRole } from "./constant";
import { arrayRemove } from "./utility";
//---------------------------------------------------------------------------------
// فراخوانی وضعیت ذخیره شده برنامه در زمان ریفرش شدن صفحه
export function initState(state) {
  let gameState = window.localStorage.getItem("GameState");
  let stateArr = JSON.parse(gameState);
  let prevState;
  if (stateArr && stateArr.length > 0) {
    prevState = stateArr.pop();
    state.gamers = prevState.gamers;
    state.framasons = prevState.framasons;
    state.nightLog = prevState.nightLog;
    state.currentOrder = prevState.currentOrder;
    state.currentRole = prevState.currentRole;
    state.day = prevState.day;
    state.finish = prevState.finish;
    state.info = prevState.info;
    state.timer = prevState.timer;
    state.step = prevState.step;
    state.logs = prevState.logs;
    return true;
  } else return false;
}
//---------------------------------------------------------------------------------
export function prevStep(state) {
  if (state.finish) clearState();
  else {
    let gameState = window.localStorage.getItem("GameState");
    let stateArr = JSON.parse(gameState);
    let prevState;
    do {
      prevState = stateArr.pop();
    } while (
      stateArr.length > 0 &&
      prevState.currentOrder === state.currentOrder
    );

    if (prevState && prevState.step !== showRole) {
      state.gamers = prevState.gamers;
      state.framasons = prevState.framasons;
      state.nightLog = prevState.nightLog;
      state.currentOrder = prevState.currentOrder;
      state.currentRole = prevState.currentRole;
      state.day = prevState.day;
      state.finish = prevState.finish;
      state.info = prevState.info;
      state.timer = prevState.timer;
      state.step = prevState.step;
      state.logs = prevState.logs;
      window.localStorage.setItem("GameState", JSON.stringify(stateArr));
    }
  }
}
//---------------------------------------------------------------------------------
export function nextStep(state) {
  saveState(state);
  if (state.day) startNight(state);
  if (!state.finish) if (!whoIsNext(state)) startDay(state);
}
//---------------------------------------------------------------------------------
export function saveState(state) {
  let prevState = window.localStorage.getItem("GameState");
  let stateArr = [];
  if (prevState != null) stateArr = JSON.parse(prevState);
  stateArr.push(state);
  window.localStorage.setItem("GameState", JSON.stringify(stateArr));
}
//---------------------------------------------------------------------------------
export function getState() {
  return JSON.parse(window.localStorage.getItem("GameState"));
}
//---------------------------------------------------------------------------------
export function clearState() {
  window.localStorage.setItem("GameState", "[]");
  window.location = "/";
}
//---------------------------------------------------------------------------------
export function addGamerToList(gamerName) {
  let gamerArray = JSON.parse(window.localStorage.getItem("GamerList"));
  if (!gamerArray) gamerArray = [];
  gamerArray.push(gamerName);
  window.localStorage.setItem("GamerList", JSON.stringify(gamerArray));
}
//----------------------------------------------------------------------------------
export function removeGamerFromList(gamerName) {
  let gamerArray = JSON.parse(window.localStorage.getItem("GamerList"));
  gamerArray = arrayRemove(gamerArray, gamerName);
  window.localStorage.setItem("GamerList", JSON.stringify(gamerArray));
}
//----------------------------------------------------------------------------------
export function getGamerList() {
  let gamerArray = window.localStorage.getItem("GamerList");
  if (gamerArray) return JSON.parse(gamerArray);
  else return [];
}
