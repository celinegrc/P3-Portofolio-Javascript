const userToken = localStorage.getItem("token")
const workButtonContainer = document.createElement("ul")
const gallery = document.querySelector(".gallery")
const modalWindow = document.querySelector("#modalWindow")
const addWorkWindow = document.querySelector("#addWork")
const thumbnailWindow = document.querySelector("#thumbnailWindow")
const categoryButtons = document.querySelectorAll(".buttons")
const logOutButton =  document.querySelector("#logoutButton")
const logInButton = document.querySelector("#loginButton")
const headerEdition = document.querySelector(".edition_mode")
const modifyTag = document.querySelectorAll(".modifTag")
const editionModeElement =[logOutButton, headerEdition, modalWindow, addWorkWindow, thumbnailWindow]
const windowsEditionMode = [modalWindow, addWorkWindow, thumbnailWindow]

function pushModifyTag() {
  for (let tag of modifyTag){
      editionModeElement.push(tag)
  }
}

function undisplayEditionModeElement() {
  pushModifyTag()
  for (let element of editionModeElement){
    element.remove()
  }
} 

function undisplayWindowsEdition () {
  for (let window of windowsEditionMode) {
    window.style.display ="none"
  }
}

function displayWork(work) {
  const workFigure = document.createElement("figure")
  const workImg = document.createElement("img")
  workImg.src = work.imageUrl
  const workFigcaption = document.createElement("figcaption")
  workFigcaption.innerHTML = work.title
  gallery.appendChild(workFigure)
  workFigure.appendChild(workImg)
  workFigure.appendChild(workFigcaption)
}

function createContainerFilterButtons() {
  workButtonContainer.classList.add("buttonContainer")
  gallery.before(workButtonContainer)
}

function createCategorySet(categories) {
  const categorySet = new Set();
  categorySet.add("Tous")
  for (let category of categories) {
    categorySet.add(category.name)
  } 
  createCategoryButtons(categorySet)
  styleActiveButtons()
}

function createCategoryButtons(categorySet) {
  for (let name of categorySet) {
    const workButton = document.createElement("li")
    workButton.classList.add("buttons")
    workButton.innerText = name
    workButtonContainer.appendChild(workButton)
  } 
}

function displayFilter(data) {
  const categoryButtons = document.querySelectorAll('.buttons')
  for (let button of categoryButtons) {
    button.addEventListener("click",(e) => {
      gallery.innerHTML=" ";
      const workFiltres = data.filter(
      data => data.category.name === e.target.innerText
      )
      for (let workFiltre of workFiltres){      
        displayWork(workFiltre)
      }
      for (let work of data) {       
        if (button.innerText === "Tous") {
          displayWork(work)
        }
      }
    })
  }   
}

function styleActiveButtons() {
  const categoryButtons = document.querySelectorAll(".buttons")
  for (let button of categoryButtons) {
    if (button.innerText === "Tous") {
      button.classList.add("active")
    }
  button.addEventListener("click",() => {
    for (let activeButton of categoryButtons){
      activeButton.classList.remove("active")   
    }
    button.classList.add("active")
  })
  }
}

async function fetchCategorySet() {
  try {
    const response = await fetch("http://localhost:5678/api/categories") 
    const categories = await response.json()
    createCategorySet(categories)
  } catch (err) {
   console.log('Une erreur est survenue',err)
  }
}

async function fetchDisplayWorksHome() {
  try {
  const response = await fetch("http://localhost:5678/api/works")
  const data = await response.json()
  gallery.innerHTML=" "
    for (let work of data) {
      displayWork(work)
    }
    styleActiveButtons()
    displayFilter(data) 
  } catch (err) {
    console.log('Une erreur est survenue',err)
  }
}

fetchCategorySet()
fetchDisplayWorksHome() 
createContainerFilterButtons()
undisplayWindowsEdition()

if (userToken === null) {
  undisplayEditionModeElement()
}







