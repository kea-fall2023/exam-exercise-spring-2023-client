import { handleHttpErrors,makeOptions } from "../../utils.js"
import { API_URL } from "../../settings.js"

//Add id to this URL to get a single user
const URL = `${API_URL}/events`

//Store reference to commonly used nodes
let eventIdInput
let eventInputName
let eventInputDate
let eventInputCapacity
let eventInputDescription
let eventInputLocation

export async function initFindEditEvent(match) {
  document.getElementById("btn-fetch-event").onclick = getEventIdFromInputField
  document.getElementById("btn-submit-edited-event").onclick = submitEditedEvent
  document.getElementById("btn-delete-event").onclick = deleteEvent;
  eventIdInput = document.getElementById("event-id")
  eventInputName = document.getElementById("name")
  eventInputDate = document.getElementById("date-time")
  eventInputCapacity = document.getElementById("capacity")
  eventInputDescription = document.getElementById("description")
  eventInputLocation = document.getElementById("location-id")
 

  setInfoText("");
  //Check if id is provided as a Query parameter
  if (match?.params?.id) {
    const id = match.params.id
    try {
      fetchEvent(id)
    } catch (err) {
      setStatusMsg("Could not find event: " + id, true)
    }
  } else {
    clearInputFields()
  }
}

/**
 * Delete the event, with the given ID
 */
async function deleteEvent() {
  try {
    const idForEventToDelete = document.getElementById("event-id").value
    if (idForEventToDelete === "") {
      setStatusMsg("No event found to delete", true)
      return
    }
    const options = makeOptions("DELETE",null,true)
    await fetch(URL + "/" + idForEventToDelete, options).then(handleHttpErrors)
    setStatusMsg("Event successfully deleted", false)
    clearInputFields()
  }
  catch (err) {
    if (err.apiError) {
      setStatusMsg(err.apiError.message, true)
    }
    else {
      setStatusMsg(err.message,true)
    }
  }
}

function getEventIdFromInputField() {
  const id = document.getElementById("event-id-input").value
  if (!id) {
    setStatusMsg("Please provide an id", true)
    return
  }
  fetchEvent(id)
}

async function fetchEvent(id) {
  setStatusMsg("", false)
  try {
    const options = makeOptions("GET",null,true)
    const event = await fetch(URL + "/" + id,options).then(handleHttpErrors)
    renderEvent(event)
    setInfoText("Edit values and press 'Submit changes' or delete if needed")
  } catch (err) {
    if (err.apiError) {
      setStatusMsg(err.apiError.message, true)
    } else {
      setStatusMsg(err.message, true)
    }
  }
}

/**
 * Set's the status message, either styled as an error, or as a normal message
 * @param {String} msg The status message to display
 * @param {boolean} [isError] true, to style in red
 */
function setStatusMsg(msg, isError) {
  const color = isError ? "red" : "darkgreen"
  const statusNode = document.getElementById("status")
  statusNode.style.color = color
  statusNode.innerText = msg
}

function setInfoText(txt) {
  document.getElementById("info-text").innerText = txt
}

function renderEvent(evt) {
  eventIdInput.value = evt.id
  eventInputName.value = evt.name
  eventInputDate.value = evt.date
  eventInputCapacity.value = evt.capacity
  eventInputDescription.value = evt.description
  eventInputLocation.value = evt.locationId
}


async function submitEditedEvent(evt) {
  evt.preventDefault()

  try {
    const data = {}
    // data.id  = eventIdInput.value
    data.name = eventInputName.value
    data.date = eventInputDate.value
    data.capacity = eventInputCapacity.value
    data.description = eventInputDescription.value
    data.location = eventInputLocation.value


    if (data.name === "" || data.date === "" || data.description == "") {
      setStatusMsg(`Missing fields required for a submit`, false)
      return
    }

    const options = makeOptions("PUT",data,true)
 
    const PUT_URL = URL + "/" + eventIdInput.value
    const editedEvent = await fetch(PUT_URL, options).then(handleHttpErrors)
    clearInputFields()
    setStatusMsg(`Event with id '${editedEvent.id}' was successfully edited`)
  } catch (err) {
    if (err.apiError) {
      setStatusMsg(err.apiError.message, true)
    } else {
      console.log(err.message)
    }
  }
}

function clearInputFields() {
  document.getElementById("event-id-input").value = ""
  //********************* */
  eventIdInput.value = "";
  eventInputName.value = "";
  eventInputDate.value = "";
  eventInputCapacity.value = "";
  eventInputDescription.value = "";
}