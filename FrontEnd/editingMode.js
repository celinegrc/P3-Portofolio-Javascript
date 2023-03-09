const inputFile = document.querySelector("#image")
const postForm = document.querySelector("#addWorkForm")
const galleryEdition = document.querySelector(".galleryEdition")
const jsStop = document.querySelectorAll(".jsStop")
const postBtn = document.querySelector("#validButton")
const arrow = document.querySelector(".fa-arrow-left")
const xClose = (document.querySelector("#xClose"))

const uploadedImg = document.createElement("img")
const deleteImg = document.createElement("img")
const emptyOption = document.createElement("option")
const labelForCategory = document.createElement("label")
const selectCategory = document.createElement("select")
const tooLoudMessage = document.createElement('p')

function initSetArribute() {
  selectCategory.setAttribute("name","category")
  selectCategory.setAttribute("id","category")
  selectCategory.setAttribute("required","required")
  labelForCategory.innerText="Catégorie"
  labelForCategory.setAttribute("for","category")
}

function displayWorkEdition(work) {
  const figureEdition = document.createElement("figure")
  figureEdition.setAttribute("id", "edition"+work.id)
  figureEdition.classList.add("editionImg")
  const deleteIcon = document.createElement("div")
  deleteIcon.innerHTML= `<i class="fa-solid fa-trash-can"></i>`
  deleteIcon.setAttribute("id",work.id)
  const imgEdition = document.createElement("img")
  imgEdition.src = work.imageUrl
  const figcaptionEdition = document.createElement("figcaption")
  figcaptionEdition.innerHTML = "éditer"
  galleryEdition.appendChild(figureEdition)
  figureEdition.appendChild(deleteIcon)
  figureEdition.appendChild(imgEdition)
  figureEdition.appendChild(figcaptionEdition)
}

function createOptionSelect(data) {
  initSetArribute()
  document.querySelector(".forBorder").append(labelForCategory)
  labelForCategory.after(selectCategory)
  selectCategory.appendChild(emptyOption)
    for(let category of data) {
      let optionCategory = document.createElement("option")
      optionCategory.innerText = category.name
      optionCategory.value = category.id
      selectCategory.appendChild(optionCategory)
    }
}

function closeModalWindow (element) {
  element.addEventListener("click",()=> {
  modalWindow.style.display="none"
  })
}

function closeAddWorkWindow (element) {
  element.addEventListener("click",()=> {
  addWorkWindow.style.display="none"
  })
}

function closeAddWorkWindow (element) {
  element.addEventListener("click",()=> {
  addWorkWindow.style.display="none"
  })
}

function resetAll() {
  postForm.reset()
  if (uploadedImg){
    uploadedImg.remove()
  }
}

function formReset (element) {
  element.addEventListener("click",()=> {
    resetAll()
  })
}

function reader() {
  inputFile.addEventListener("change", ()=> {
     const reader = new FileReader();
    reader.addEventListener ("load", ()=> {
      uploadedImg.classList.add("uploadedImage")
      uploadedImg.src= reader.result
      document.querySelector(".insertPhoto").append(uploadedImg) 
    })
    if (inputFile.files[0].size < 4000000) {
      reader.readAsDataURL(inputFile.files[0])
    } else {
      fileTooLoud()
      resetFileTooLoud(xClose)
      resetFileTooLoud(arrow)
      resetFileTooLoud(inputFile)
      resetFileTooLoud(addWorkWindow)
    } 
  })
}

function fileTooLoud() {
  document.querySelector(".insertPhoto").before(tooLoudMessage)
  tooLoudMessage.innerText="Le fichier est trop volumineux"
  tooLoudMessage.style.color = "#E23D36"
  tooLoudMessage.style.margin="0px"
  document.querySelector("#fileSizeMax").style.color = "#E23D36"
}

function resetFileTooLoud(element) {
  element.addEventListener("click",()=> {
    tooLoudMessage.innerText=" "
    document.querySelector("#fileSizeMax").style.color = "#000000"
  })
}
 
function jsStopPropagation() {
  for (let element of jsStop) {
    element.addEventListener("click", (e)=> {
      e.stopPropagation()
    })
  }
} 

function logOut() {
  logOutButton.addEventListener("click", ()=> {
    localStorage.removeItem("token")
    window.location.replace("index.html")
  })
}

async function fetchDisplayEdition() {
  try {
    const response = await  fetch("http://localhost:5678/api/works")
    const data = await response.json()
    galleryEdition.innerHTML=" "
      for (let work of data){
        displayWorkEdition(work)
      }
  } catch (err) {
  console.log('Une erreur est survenue',err)
  }
}

async function fetchCreateOption() {
  try {
  const response = await fetch("http://localhost:5678/api/categories")
  const data = await response.json()
  createOptionSelect(data)
  } catch (err) {
    console.log('Une erreur est survenue',err)
  }
}

function deleteWork() {
  const trashes = document.querySelectorAll(".fa-trash-can")
  for (trashCan of trashes) {
    trashCan.addEventListener("click",(e)=> {
      const id = ((e.target).parentNode.id)
      const figureToDelete = document.getElementById("idWork"+id)
      const figureToDeleteEdition = document.getElementById("edition"+id) 
      fetch(`http://localhost:5678/api/works/${id}`,{
        method:"DELETE",
         headers: {
        'authorization': `Bearer ${userToken}`,
        }
      })
      .then (response => {
        if (response.status === 204 ) {
        modalWindow.style.display="none";
        figureToDelete.remove()
        figureToDeleteEdition.remove() 
        } 
      }) 
    }) 
  } 
}

async function fetchPostWork(formData) {
  try {
    const response = await fetch("http://localhost:5678/api/works",{
      method: "POST",
      headers: {
        'authorization': `Bearer ${userToken}`,
        'accept':'application/json',
      },
      body: formData  
    })
    const rep = await response.json() 
      resetAll()
      addWorkWindow.style.display="none"
      console.log(rep)
     displayWork(rep)
     displayWorkEdition(rep)
  } catch (err) {
    console.log('Une erreur est survenue',err)
  }
}

function postWork() { 
  postForm.addEventListener("submit",(e)=> {
    e.preventDefault()
    if (inputFile.files[0].size < 4000000) {
      const formData = new FormData(postForm)
      fetchPostWork(formData)
    }
  }) 
}

if (userToken !== null) {
  logInButton.remove()
  workButtonContainer.remove()
  fetchCreateOption()
  logOut()
  fetchDisplayEdition()
  reader()
  closeModalWindow(document.querySelector(".fa-xmark"))
  closeModalWindow(modalWindow)
  closeModalWindow(document.querySelector("#openAddModal"))
  closeAddWorkWindow(xClose)
  closeAddWorkWindow(arrow)
  closeAddWorkWindow(addWorkWindow)
  jsStopPropagation()
  postWork()
  formReset(addWorkWindow)
  formReset(xClose)
  formReset(arrow)
   
  document.querySelector("#modalLink").addEventListener("click", ()=> {
    modalWindow.style.display ="flex";
    deleteWork()
  })  
  document.querySelector("#openAddModal").addEventListener("click", ()=> {
    addWorkWindow.style.display ="flex";
  })
  arrow.addEventListener("click", ()=> {
    modalWindow.style.display ="flex";
  }) 
}
