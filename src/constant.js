export const showRole = "SHOWROLE";
export const gameStarted = "GAMESTARTED";
export class Role {
  constructor(name, persianName, personality, order) {
    this.name = name;
    this.persianName = persianName;
    this.personality = personality;
    this.order = order;
  }
}

export const emptyState = {
  gamers: [],
  nightLog: [],
  currentOrder: -1,
  currentRole: {},
  currentPerson: "",
  day: false,
  finish: false,
  info: "",
  timer: 0,
  step: showRole,
  actions: new Array(8).fill(function() {}),
  logs: []
};

export const roleList = [
  new Role("barman", "ساقی", true, 1),
  new Role("wizard", "افسونگر", false, 2),
  new Role("godfather", "گادفادر", false, 3),
  new Role("sniper", "اسنایپر", true, 4),
  new Role("doctor", "دکتر", true, 5),
  new Role("natasha", "ناتاشا", false, 6),
  new Role("priest", "کشیش", true, 7),
  new Role("joker", "جوکر", true, 99)
];
