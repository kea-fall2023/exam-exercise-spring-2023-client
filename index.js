import "./navigo_EditedByLars.js"  //Will create the global Navigo, with a few changes, object used below
import {
  setActiveLink, renderHtml,loadHtml} from "./utils.js"

import { initLogin,toggleLoginStatus,logout } from "./pages/login/login.js"
import { initSignup } from "./pages/signup/signup.js"
import {initCreateEvent} from "./pages/events/createEvent.js"
import {initListEvents} from "./pages/events/listEvent.js"
import {initFindEditEvent} from "./pages/events/findEditDeleteEvent.js"
import {initRegisterForEvent} from "./pages/eventsAttendee/registerForEvent.js"

//If token existed, for example after a refresh, set UI accordingly
const token = localStorage.getItem("token")
toggleLoginStatus(token)


window.addEventListener("load", async () => {

  const templateSignup = await loadHtml("./pages/signup/signup.html")
  const templateLogin = await loadHtml("./pages/login/login.html")
  const templateNotFound = await loadHtml("./pages/notFound/notFound.html")
  const templateCreateEvent = await loadHtml("./pages/events/createEvent.html")
  const templateAllEvents = await loadHtml("./pages/events/listEvents.html")
  const templateFindEditEvent = await loadHtml("./pages/events/findEditDeleteEvent.html")
  const templateRegisterForEvent = await loadHtml("./pages/eventsAttendee/registerForEvent.html")



  const router = new Navigo("/", { hash: true });
  //Not especially nice, BUT MEANT to simplify things. Make the router global so it can be accessed from all js-files
  window.router = router

  router
    .hooks({
      before(done, match) {
        setActiveLink("menu", match.url)
        done()
      }
    })
    .on({
      //For very simple "templates", you can just insert your HTML directly like below
      "/": () => document.getElementById("content").innerHTML = `
        <h2>Home</h2>
        <h5 style="color:darkorange">Make sure to change, colors and layout if you use this for your own projects</h5>
     `,
      "/create-event": () => {
        renderHtml(templateCreateEvent,"content")
        initCreateEvent()
      },
      "/events": (match) => {
        renderHtml(templateAllEvents,"content")
        initListEvents(match)
      },
      "/find-edit-event": (match) => {
        renderHtml(templateFindEditEvent,"content")
        initFindEditEvent(match)
      },
      "/register-event": ()=>{
        renderHtml(templateRegisterForEvent,"content")
        initRegisterForEvent()
      },
      "/signup": () => {
        renderHtml(templateSignup, "content")
        initSignup()
      },
      "/login": (match) => {
        renderHtml(templateLogin, "content")
        initLogin(match)
      },
      "/logout": () => {
        ()=> router.navigate("/")
        logout()
      }
    })
    .notFound(() => {
      renderHtml(templateNotFound, "content")
    })
    .resolve()
});


window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
  alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber
    + ' Column: ' + column + ' StackTrace: ' + errorObj);
}