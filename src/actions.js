import { logInsert } from "./log";
import { isObjectInArray } from "./utility";
import { showRole, gameStarted } from "./constant";

function checkGameStatus(state) {
  if (state.finish) return;
  let mafiaCount = state.gamers.filter(
    gamer => !getPersonality(gamer) && gamer.alive
  ).length;
  let citizenCount = state.gamers.filter(
    gamer => getPersonality(gamer) && gamer.alive
  ).length;
  if (!mafiaCount) {
    logInsert("شهروندها برنده شدند", state);
    state.finish = true;
  } else if (mafiaCount >= citizenCount) {
    logInsert("مافیا برنده شدند", state);
    state.finish = true;
  }
}
//####################################################################################
function kill(gamer, state) {
  if (typeof gamer === "undefined") return;
  gamer.alive = false;
  logInsert(
    (state.day ? "درطول روز با رای گیری " : "در شب ") +
      gamer.name +
      "(" +
      gamer.role[0].persianName +
      ")" +
      " کشته شد",
    state
  );
  if (getRole(gamer, "godfather")) deliverGun(gamer, state);
  else if (getRole(gamer, "joker") && state.day) {
    if (state.gamers.filter(gamer => gamer.alive).length > 2) {
      state.finish = true;
      logInsert("جوکر برنده شد", state);
    }
  }
  checkGameStatus(state);
}
//####################################################################################
function deliverGun(currentOwner, state) {
  let gamerArray = [...state.gamers].sort(function(a, b) {
    return a.role[0].order - b.role[0].order;
  });
  let newGodfather = gamerArray.find(function(element) {
    return element.alive && !getPersonality(element);
  });
  if (newGodfather) {
    newGodfather.role.push(getRole(currentOwner, "godfather"));
  }
}
//####################################################################################
function startDay(state) {
  // اعمال عملیات بر روی نقش ها
  while (state.actions.length > 0) {
    let action = state.actions.shift();
    action();
  }
  var deadlist = state.gamers.filter(gamer => gamer.isShot);
  for (var index in deadlist) {
    kill(deadlist[index], state);
  }
  resetGamerState(state);
  //--------------------------------------------------------------------------------
  state.currentOrder = -1;
  state.info = "";
  state.currentRole = {};
  state.nightLog = [];
  state.day = true;
  state.timer = 0;
  state.gamers.sort(() => Math.random() - 0.5);
}
//####################################################################################
export function startNight(state) {
  if (state.finish) return;
  logInsert("در شب بعد:", state);

  state.gamers.map(gamer => {
    gamer.isDumb = false;
    return true;
  });
  state.day = false;
}
//####################################################################################
function getRole(gamer, roleName) {
  let role = gamer.role.find(role => {
    return role.name === roleName;
  });
  return role;
}
//####################################################################################
function getPersonality(gamer) {
  let role = gamer.role.find(function(role) {
    return role.personality === false;
  });
  return typeof role === "undefined";
}
//####################################################################################
export function whoIsNext(state) {
  var myGamer = [...state.gamers].filter(function(gamer) {
    return gamer.alive;
  });
  var tmpArray = [];
  myGamer.map(function(gamer) {
    gamer.role.map(function(role) {
      tmpArray.push({
        key: gamer.key,
        name: gamer.name,
        role: role
      });
      return true;
    });
    return true;
  });
  tmpArray = tmpArray.sort(function(a, b) {
    return a.key === b.key ? a.role.order - b.role.order : a.key - b.key;
  });
  tmpArray = tmpArray.filter(x => !isObjectInArray(x, state.nightLog));
  let currentPerson = tmpArray.find(element => {
    return element.key >= state.currentOrder ? true : false;
  });

  if (currentPerson) {
    if (state.currentOrder !== currentPerson.key) {
      var audio = new Audio("beep.mp3");
      audio.play();
    }
    state.currentOrder = currentPerson.key;
    state.currentRole = currentPerson.role;
    state.info = currentPerson.name;
    state.nightLog.push({
      key: currentPerson.key,
      name: currentPerson.name,
      role: currentPerson.role
    });
    return true;
  } else return false;
}
//####################################################################################
function resetGamerState(state) {
  state.gamers.map(gamer => {
    gamer.isShot = false;
    gamer.isDrunk = false;
    gamer.isDisabled = false;
    state.actions = new Array(8).fill(function() {});
    return true;
  });
}
//####################################################################################
function insertGamerLog(state, target, message) {
  logInsert(`${target.name} (${target.role[0].persianName}) ${message}`, state);
}
//####################################################################################
function insertِDrunkLog(state, target, gamer, message) {
  logInsert(
    `${gamer.name} مست بود و سعی کرد ${target.name}(${target.role[0].persianName}) را ${message}`,
    state
  );
}
//####################################################################################
export function gamerSelected(target, state) {
  //--------------------------------------------------------
  // اگر در مرحله نمایش نقش ها هستیم
  if (state.step === showRole) {
    if (target.roleVisible) {
      if (!target.role[0].personality) {
        let mafiaNames = "";
        state.gamers.map(gamer => {
          mafiaNames +=
            gamer.name !== target.name && !gamer.role[0].personality
              ? gamer.name + " " + gamer.role[0].persianName + " | "
              : "";
          return true;
        });
        state.info = target.role[0].persianName + "(" + mafiaNames + ")";
      } else state.info = target.role[0].persianName;
    } else state.info = "";
    let remainGamer = state.gamers.find(gamer => gamer.roleVisible === true);
    if (!remainGamer) {
      state.step = gameStarted;
      startDay(state);
    }
    target.roleVisible = false;
    //-------------------------------------------------------------------------
    // اگر بازی آغاز شده است
  } else {
    if (state.day) {
      kill(target, state);
      startNight(state);
    } else {
      let currentGamer = state.gamers.find(
        gamer => gamer.key === state.currentOrder
      );
      gamerAction(currentGamer, state.currentRole, target, state);
    }
    // اگر هنوز بازی ادامه دارد برو به نفر بعدی
    if (!state.finish) {
      // اگر فردی جهت انجام نقش باقی نمانده است روز را شروع کن
      if (!whoIsNext(state)) startDay(state);
    }
  }
}
//####################################################################################
function gamerAction(gamer, gamerRole, target, state) {
  switch (gamerRole.name) {
    case "barman":
      if (getRole(target, "sniper")) {
        state.actions[0] = function() {
          barmanAction(state, target, gamer);
        };
      } else {
        state.actions[1] = function() {
          barmanAction(state, target, gamer);
        };
      }
      break;
    case "wizard":
      if (getRole(target, "barman")) {
        state.actions[0] = function() {
          wizardAction(state, target, gamer);
        };
      } else {
        state.actions[2] = function() {
          wizardAction(state, target, gamer);
        };
      }
      break;
    case "godfather":
      state.actions[3] = function() {
        godfatherAction(state, target, gamer);
      };
      break;
    case "sniper":
      state.actions[4] = function() {
        sniperAction(state, target, gamer);
      };
      break;
    case "doctor":
      state.actions[5] = function() {
        doctorAction(state, target, gamer);
      };
      break;
    case "natasha":
      state.actions[6] = function() {
        natashaAction(state, target, gamer);
      };
      break;
    case "priest":
      state.actions[7] = function() {
        priestAction(state, target, gamer);
      };
      break;
    case "joker":
      break;
    case "citizen":
      break;
    default:
      break;
  }
}
//####################################################################################
function barmanAction(state, target, gamer) {
  if (!gamer.isDisabled) {
    target.isDrunk = true;
    insertGamerLog(state, target, "مست شد");
  } else insertِDrunkLog(state, target, gamer, "مست کند");
}
function wizardAction(state, target, gamer) {
  // اگر افسونگر مست شده گادفادر هم باشد نقش گادفادر مست میشود
  if (!gamer.isDrunk || getRole(gamer, "godfather")) {
    target.isDisabled = true;
    insertGamerLog(state, target, "مسخ شد");
  } else insertِDrunkLog(state, target, gamer, "مسخ کند");
}
function godfatherAction(state, target, gamer) {
  if (!gamer.isDrunk || getRole(target, "barman")) {
    target.isShot = true;
    insertGamerLog(state, target, "توسط گادفادر تیر خورد");
  } else insertِDrunkLog(state, target, gamer, "هدف قرار دهد");
  gamer.isDrunk = false;
}
function natashaAction(state, target, gamer) {
  if (!gamer.isDrunk || getRole(target, "barman")) {
    target.isDumb = true;
    insertGamerLog(state, target, "لال شد");
  } else {
    gamer.isDumb = true;
    insertGamerLog(state, gamer, "لال شد");
  }
}
function sniperAction(state, target, gamer) {
  if (!gamer.isDrunk && !gamer.isDisabled) {
    target.isShot = true;
    insertGamerLog(state, target, "توسط اسنایپر تیر خورد");
  } else insertِDrunkLog(state, target, gamer, "هدف قرار دهد");
}
function doctorAction(state, target, gamer) {
  if (!gamer.isDrunk && !gamer.isDisabled) {
    if (target.isShot) {
      target.isShot = false;
      insertGamerLog(state, target, "توسط دکتر مداوا شد");
    } else
      insertGamerLog(state, target, "به اشتباه توسط دکتر جهت مداوا انتخاب شد");
  } else insertِDrunkLog(state, target, gamer, "مداوا کند");
}
function priestAction(state, target, gamer) {
  if (!gamer.isDrunk && !gamer.isDisabled && target.isDumb) {
    if (target.isDumb) {
      target.isDumb = false;
      insertGamerLog(state, target, "توسط کشیش شفا یافت");
    } else insertGamerLog(state, target, "به اشتباه توسط کشیش شفا یافت");
  } else insertِDrunkLog(state, target, gamer, "شفا دهد");
}
