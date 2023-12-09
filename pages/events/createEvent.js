import {API_URL} from "../../settings.js"
import {handleHttpErrors, makeOptions } from "../../utils.js"
const URL = `${API_URL}/events`

export function initCreateEvent(){
    document.getElementById('submit-event').onclick = saveEvent
}

async function saveEvent(){
    let name = document.getElementById('name').value;
    let date = document.getElementById('date').value;
    let description = document.getElementById('description').value;
    let capacity = document.getElementById('capacity').value;
    let locationId = document.getElementById('locationId').value;

    let data = {
        "name": name,
        "date": new Date(date),
        "description": description,
        "capacity": parseInt(capacity),
        "locationId": parseInt(locationId)
    };

    try{
        const res = await fetch(URL,makeOptions("POST",data)).then(handleHttpErrors)
        document.getElementById("response").innerText = JSON.stringify(res)
    } catch (err){
       alert("Please provide a better way to report errors")
    }


}