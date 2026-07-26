"use strict";

const $ = (id) => document.getElementById(id);
const state = { running: false, timer: null, tick: 0, rpm: 0, motorTemp: 22, escTemp: 22, batteryTemp: 22, history: [], samples: [] };
const ids = ["rpm","thrust","torque","vibration","voltage","current","electrical","shaft","efficiency","motor-temp","esc-temp","battery-temp"];

function showSection(name, focus = false) {
  document.querySelectorAll('[role="tabpanel"]').forEach((panel) => { panel.hidden = panel.id !== name; });
  document.querySelectorAll('[role="tab"]').forEach((tab) => {
    const active = tab.dataset.section === name;
    tab.setAttribute("aria-selected", String(active)); tab.tabIndex = active ? 0 : -1;
    if (active && focus) tab.focus();
  });
}

document.querySelectorAll('[role="tab"]').forEach((tab, index, tabs) => {
  tab.addEventListener("click", () => showSection(tab.dataset.section));
  tab.addEventListener("keydown", (event) => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); showSection(tabs[next].dataset.section, true); }
  });
});

function message(text, warning = false) {
  const notice = $("notice"); notice.hidden = false; notice.textContent = text;
  notice.classList.toggle("warning", warning); $("announcer").textContent = text;
}

function setStatus(text, kind) {
  const status = $("motor-status"); status.textContent = text; status.className = `status-chip ${kind || ""}`;
}

function simulate() {
  state.tick += 1;
  const target = 6100 + Math.sin(state.tick / 5) * 450 + (Math.random() - .5) * 180;
  state.rpm += (target - state.rpm) * .19;
  const ratio = state.rpm / 6500;
  const current = Math.max(0, 1.1 + 23.5 * ratio ** 2 + (Math.random() - .5) * .5);
  const voltage = Math.max(13, 16.8 - current * .034 + (Math.random() - .5) * .03);
  const torque = Math.max(0, .185 * ratio ** 2 + (Math.random() - .5) * .004);
  const thrust = Math.max(0, 7.9 * ratio ** 2 + (Math.random() - .5) * .12);
  const vibration = Math.max(0, .35 + 2.15 * ratio + Math.sin(state.tick / 2.8) * .22 + (Math.random() - .5) * .1);
  const electrical = voltage * current;
  const shaft = torque * 2 * Math.PI * state.rpm / 60;
  const efficiency = electrical ? Math.min(100, shaft / electrical * 100) : 0;
  state.motorTemp = Math.min(85, state.motorTemp + .045 * ratio + (Math.random() - .5) * .015);
  state.escTemp = Math.min(80, state.escTemp + .035 * ratio + (Math.random() - .5) * .012);
  state.batteryTemp = Math.min(60, state.batteryTemp + .018 * ratio + (Math.random() - .5) * .008);
  const sample = { time: new Date().toLocaleTimeString(), rpm: Math.round(state.rpm), thrust, torque, voltage, current, electrical, shaft, efficiency, vibration };
  state.samples.push(sample); state.history.push(sample); if (state.history.length > 50) state.history.shift();
  renderSample(sample); renderChart(); renderTable();
}

function renderSample(s) {
  $("rpm").textContent = s.rpm.toLocaleString(); $("thrust").textContent = s.thrust.toFixed(2); $("torque").textContent = s.torque.toFixed(3);
  $("vibration").textContent = s.vibration.toFixed(2); $("voltage").textContent = s.voltage.toFixed(2); $("current").textContent = s.current.toFixed(1);
  $("electrical").textContent = s.electrical.toFixed(0); $("shaft").textContent = s.shaft.toFixed(0); $("efficiency").textContent = `${s.efficiency.toFixed(1)}%`;
  $("efficiency-bar").value = s.efficiency; $("motor-temp").textContent = `${state.motorTemp.toFixed(1)} °C`; $("esc-temp").textContent = `${state.escTemp.toFixed(1)} °C`; $("battery-temp").textContent = `${state.batteryTemp.toFixed(1)} °C`;
}

function renderChart() {
  $("waiting").hidden = state.history.length > 0;
  const points = (key, max) => state.history.map((sample, i) => `${50 + (i / 49) * 730},${255 - Math.min(sample[key] / max, 1) * 225}`).join(" ");
  $("rpm-line").setAttribute("points", points("rpm", 10000)); $("vib-line").setAttribute("points", points("vibration", 5));
  const latest = state.history.at(-1); if (latest) { const description = `Latest sample: ${latest.rpm} RPM and ${latest.vibration.toFixed(2)} meters per second squared vibration. ${state.history.length} samples shown.`; $("trace-desc").textContent = description; $("chart-summary").textContent = description; }
}

function renderTable() {
  $("results-body").innerHTML = state.samples.slice(-20).reverse().map((s) => `<tr><td>${s.time}</td><td>${s.rpm}</td><td>${s.thrust.toFixed(2)} N</td><td>${s.torque.toFixed(3)} N·m</td><td>${s.voltage.toFixed(2)} V</td><td>${s.current.toFixed(1)} A</td><td>${s.electrical.toFixed(0)} W</td><td>${s.shaft.toFixed(0)} W</td><td>${s.efficiency.toFixed(1)}%</td><td>${s.vibration.toFixed(2)} m/s²</td></tr>`).join("");
}

function start() {
  if (state.running) return; state.running = true; setStatus("Running · simulated", ""); message("Simulation running. Measurements update twice per second.");
  $("start").disabled = true; $("stop").disabled = false; simulate(); state.timer = window.setInterval(simulate, 500);
}
function stop(status = "Stopped · disarmed") { if (state.timer) clearInterval(state.timer); state.timer = null; state.running = false; setStatus(status, "stopped"); $("start").disabled = false; $("stop").disabled = true; }
$("start").addEventListener("click", start);
$("stop").addEventListener("click", () => { stop(); message("Simulation stopped. Last measurements remain visible."); });
$("zero").addEventListener("click", () => message("Zero complete: accelerometer, thrust load cell, and torque load cell were zeroed (simulated)."));
$("estop").addEventListener("click", () => { stop("Emergency Stop"); $("motor-status").className = "status-chip emergency"; message("EMERGENCY STOP: Simulation halted immediately. A real device must also interrupt motor power through a dedicated hardware circuit.", true); });

$("balance-form").addEventListener("submit", (event) => {
  event.preventDefault(); if (!event.currentTarget.reportValidity()) return;
  const rpm = Number($("balance-rpm").value), radius = Number($("correction-radius").value), trialAngle = Number($("trial-angle").value);
  const addAngle = (trialAngle + 114) % 360, removeAngle = (addAngle + 180) % 360, mass = Math.max(.02, Number($("trial-mass").value) * .7);
  $("recommendation").innerHTML = `<p class="eyebrow">DEMONSTRATION DATA · NOT A REAL BALANCING CALCULATION</p><h3>Correction recommendation</h3><div class="result-main">Add ${mass.toFixed(2)} g at ${addAngle.toFixed(0)}°</div><p>The correction may be placed anywhere around the rotor; it is not restricted to a blade. One-blade propellers are supported.</p><div class="result-grid"><div><small>Correction radius</small><strong>${radius.toFixed(0)} mm</strong></div><div><small>Measured at</small><strong>${rpm.toLocaleString()} RPM</strong></div><div><small>Equivalent remove-mass position</small><strong>${removeAngle.toFixed(0)}°</strong></div><div><small>Rotation direction</small><strong>${$("rotation").value}</strong></div></div>`;
  $("announcer").textContent = `Mock recommendation generated: add ${mass.toFixed(2)} grams at ${addAngle.toFixed(0)} degrees.`;
});

function download(filename, type, content) { const blob = new Blob([content], { type }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 0); message(`${filename} export generated from ${state.samples.length} simulated samples.`); }
$("csv").addEventListener("click", () => { const columns = ["time","rpm","thrust","torque","voltage","current","electrical","shaft","efficiency","vibration"]; const csv = [columns.join(","), ...state.samples.map((s) => columns.map((key) => s[key]).join(","))].join("\n"); download("openproplab-mock-results.csv", "text/csv", csv); });
$("json").addEventListener("click", () => download("openproplab-mock-results.json", "application/json", JSON.stringify({ mock: true, exportedAt: new Date().toISOString(), samples: state.samples }, null, 2)));
$("appearance").addEventListener("change", (event) => { document.documentElement.dataset.theme = event.target.value; });
