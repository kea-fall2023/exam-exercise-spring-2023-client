import { API_URL } from "../../settings.js"
import { handleHttpErrors, makeOptions, sanitizeStringWithTableRows } from "../../utils.js"

const URL = `${API_URL}/events`
let selectedEventId = ""
let btnRegister
let errorParagraph
let myEvents = []
let tbody;
export function initRegisterForEvent() {
  selectedEventId = ""
  btnRegister = document.getElementById("btn-register-event")
  document.getElementById("btn-fetch-event").onclick = fetchEvent
  btnRegister.onclick = register
  errorParagraph = document.getElementById("error")
  getMyEvents()
  tbody = document.getElementById("tbody")
  tbody.onclick = unregisterEvent
}

async function unregisterEvent(evt){
  const target = evt.target
  if(!target.id.includes("btn-unregister-")){
    return
  }
  const reservationId = target.id.replace("btn-unregister-","")
  const options = makeOptions("DELETE",null,true)
  try{
  const response = await fetch(`${URL}/unregister/${reservationId}`,options).then(handleHttpErrors)
  getMyEvents()
  } catch (err){
    alert(err.message)
  }
  
}
async function getMyEvents() {
  try {
    const options = makeOptions("GET", null, true)
    myEvents = await fetch(URL + "/myevents", options).then(handleHttpErrors)
    const rows = myEvents.map(r => `
    <tr>
      <td>${r.reservationId}</td>
      <td>${r.eventName}</td>
      <td>${r.eventDate}</td>
      <td>${r.locationName}</td>
      <td><a class="btn btn-dark btn-sm"
      id="btn-unregister-${r.reservationId}">Unregister </a>
      </tr>
    `).join("")
    document.getElementById("tbody").innerHTML = sanitizeStringWithTableRows(rows)
  } catch (err) {
    console.log(err.message)
  }
}
async function fetchEvent() {
  selectedEventId = ""
  errorParagraph.innerText = ""
  const eventId = document.getElementById("event-id-input").value
  if (eventId == "") {
    errorParagraph.innerText = "Please provide an id!"
    return
  }
  try {
    const theEvent = await fetch(URL + "/" + eventId, makeOptions("GET", null, true)).then(handleHttpErrors)
    document.getElementById("the-event").innerText = JSON.stringify(theEvent)
    selectedEventId = theEvent.id
  } catch (err) {
    errorParagraph.innerText = err.message
  }
  finally {
    btnRegister.style.display = (selectedEventId != "") ? "block" : "none"
  }
}

async function register() {
  document.getElementById("response").innerText = ""
  try {
    const options = makeOptions("POST", null, true)
    const response = await fetch(`${URL}/register/${selectedEventId}`, options).then(handleHttpErrors)
    document.getElementById("response").innerText = JSON.stringify(response)
    getMyEvents()
  } catch (err) {
    errorParagraph.innerText = err.message
  }
}