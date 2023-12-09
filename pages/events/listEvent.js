import {API_URL} from "../../settings.js"
import * as dateFns from 'https://esm.run/date-fns';

const API_ENDPOINT = API_URL+"/events"
import { sanitizeStringWithTableRows, makeOptions,handleHttpErrors } from "../../utils.js"


let pageSize = 10;
let sortColumn = 'name';
let sortDirection = 'asc';
let queryString
let isInitialized = false;

const navigoRoute = "events"



export async function initListEvents(match) {  //Pass in match if needed
  const page =  0

  if (!isInitialized) {  //No reason to setup event handlers if it's already been done
    isInitialized = true;
    document.querySelector('#paginator').addEventListener('click', handlePaginationClick)
    document.querySelector('#tbody').addEventListener('click', navigate)
  }

  fetchData(Number(page)); //Fetch data for the first page
}


function handlePaginationClick(evt) {
  evt.preventDefault()
  if (evt.target.tagName === 'A' && evt.target.hasAttribute('data-page')) {
    const page = parseInt(evt.target.getAttribute('data-page'));
    fetchData(page);
  }
}

function displayPagination(totalPages, currentPage) {
  let paginationHtml = '';
  if (currentPage > 0) { // Previous Page
    paginationHtml += `<li class="page-item"><a class="page-link" data-page="${currentPage - 1}" href="#">Previous</a></li>`
  }
  // Display page numbers
  let startPage = Math.max(0, currentPage - 2);
  let endPage = Math.min(totalPages - 1, currentPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    if (i === currentPage) {
      paginationHtml += `<li class="page-item active"><a class="page-link" href="#">${i + 1}</a></li>`
    } else {
      paginationHtml += `<li class="page-item"><a class="page-link" data-page="${i}" href="#">${i + 1}</a></li>`
    }
  }
  if (currentPage < totalPages - 1) { // Next Page
    paginationHtml += `<li class="page-item"><a class="page-link" data-page="${currentPage + 1}" href="#">Next</a></li>`
  }


  document.querySelector('#paginator').innerHTML = paginationHtml;
}
async function fetchData(page = 0) {
  const size = pageSize
  //Build a query string like this to match expectations on the server: ?page=0&size=10&sort=author,desc
  queryString = `?page=${page}&size=${size}&sort=${sortColumn},${sortDirection}`
  const data = await fetch(`${API_ENDPOINT}${queryString}`).then(res => res.json())//TODO: Handle error cases
  displayData(data.content);
  displayPagination(data.totalPages, page);
}

function displayData(events){
 
  const rows = events.map(evt => `
  <tr>
    <td>${evt.id}</td>
    <td>${evt.name}</td>
    <td>${dateFns.format(dateFns.parseISO(evt.date),'dd-MM-yyyy (HH:mm)')}</td>
    <td>${evt.description}</td>
    <td>${evt.capacity}</td>
    <td>${evt.freeSeats}</td>
    <td><button id="btn-id-${evt.id}" class="btn btn-sm btn-info">Details</button></td>
  `).join("")

  //DON'T forget to sanitize the string before inserting it into the DOM
  const tbody =  document.getElementById("tbody")
  tbody.innerHTML = sanitizeStringWithTableRows(rows)
}


function navigate(evt){
  const target = evt.target
  if(!target.id.includes("btn-id-")){
    return
  }
  const id = target.id.replace("btn-id-","")
  router.navigate("find-edit-event?id="+id)

}