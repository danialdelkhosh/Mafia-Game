import React from "react";

export function renderLog(state) {
  if (state.finish) {
    return (
      <ul className="row gameLogs list-group">
        {state.logs.map((log, index) => {
          return (
            <li key={index} className="list-group-item display-5">
              <div className={logStyle(log)}>{log}</div>
            </li>
          );
        })}
      </ul>
    );
  }
}
//####################################################################################
export function logInsert(txt, state) {
  state.logs.push(txt);
}
//####################################################################################
function logStyle(log) {
  if (log.includes("تیر خورد")) return "alert alert-danger";
  if (log.includes("توسط دکتر مداوا شد")) return "alert alert-success";
  if (log.includes("لال شد")) return "alert alert-warning";
  if (log.includes("مست شد")) return "alert alert-info";
  if (log.includes("مسخ شد")) return "alert alert-info";
  if (log.includes("کشته شد")) return "alert alert-secondary";
  return "";
}
