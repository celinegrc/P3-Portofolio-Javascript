const inputFile = document.querySelector("#image")
const uploadedImg = document.createElement("img")
const deleteImg = document.createElement("img")
uploadedImg.classList.add("uploadedImage")
const postForm = document.querySelector("#addWorkForm")
const emptyOption = document.createElement("option")
const labelForCategory = document.createElement("label")
labelForCategory.innerText="Catégorie"
labelForCategory.setAttribute("for","category")
const selectCategory = document.createElement("select")
selectCategory.setAttribute("name","category"  )
selectCategory.setAttribute("id","category")
selectCategory.setAttribute("required","required")
const galleryEdition = document.querySelector(".galleryEdition")
const jsStop = document.querySelectorAll(".jsStop")
const postBtn = document.querySelector("#validButton")
const arrow = document.querySelector(".fa-arrow-left")
const xClose = (document.querySelector("#xClose"))
const tooLoudMessage = document.createElement('p')

function displayWorkEdition(work){
  const figureEdition = document.createElement("figure")
  figureEdition.classList.add("editionImg")
  const deleteIcon  = document.createElement("div")
  deleteIcon.innerHTML= `<i class="fa-solid fa-trash-can"></i>`
  const imgEdition = document.createElement("img")
  imgEdition.src = work.imageUrl
  const figcaptionEdition = document.createElement("figcaption")
  figcaptionEdition.innerHTML = "éditer"
  galleryEdition.appendChild(figureEdition)
  figureEdition.appendChild(deleteIcon)
  figureEdition.appendChild(imgEdition)
  figureEdition.appendChild(figcaptionEdition)
}

function createOptionSelect(data){
  document.querySelector(".forBorder").append(labelForCategory)
  labelForCategory.after(selectCategory)
  selectCategory.appendChild(emptyOption)
    for(let category of data){
      let optionCategory = document.createElement("option")
      optionCategory.innerText = category.name
      optionCategory.value = category.id
      selectCategory.appendChild(optionCategory)
    }
}

function closeModalWindow (element){
  element.addEventListener("click",()=>{
  modalWindow.style.display="none"
  })
}

function closeAddWorkWindow (element){
  element.addEventListener("click",()=>{
  addWorkWindow.style.display="none"
  })
}

function closeAddWorkWindow (element){
  element.addEventListener("click",()=>{
  addWorkWindow.style.display="none"
  })
}

function reset(){
  postForm.reset()
  if (uploadedImg){
    uploadedImg.remove()
  }
}

function formReset (element){
  element.addEventListener("click",()=>{
    reset()
  })
}

function createDeleteThumbnail(data){
  deleteImg.src = data.imageUrl 
  document.querySelector("#thumbnailContainer").appendChild(deleteImg)
  deleteImg.classList.add("deleteImg") 
}

function closeDeleteThumbnail(){
  deleteImg.remove()
  thumbnailWindow.style.display="none" 
}

function reader(){
  inputFile.addEventListener("change", ()=> {
    const reader = new FileReader();
    reader.addEventListener ("load", ()=>{
      uploadedImg.src= reader.result
      document.querySelector(".insertPhoto").append(uploadedImg) 
    })
    if (inputFile.files[0].size < 400000){
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

function fileTooLoud(){
  document.querySelector(".insertPhoto").before(tooLoudMessage)
  tooLoudMessage.innerText="Le fichier est trop volumineux"
  tooLoudMessage.style.color = "#E23D36"
  tooLoudMessage.style.margin="0px"
  document.querySelector("#fileSizeMax").style.color = "#E23D36"
}

function resetFileTooLoud(element){
  element.addEventListener("click",()=>{
    tooLoudMessage.innerText=" "
    document.querySelector("#fileSizeMax").style.color = "black"
    reset()
  })
}
  
function jsStopPropagation(){
  for (let element of jsStop) {
    element.addEventListener("click", (e)=>{
     e.stopPropagation()
    })
  }
} 

function logOut(){
  logOutButton.addEventListener("click", ()=>{
    localStorage.removeItem("token")
    window.location.replace("index.html")
    //fetchDisplayWorksHome()
  })
}

function eventCloseThumbnail(){
  document.querySelector("#closeBtn").addEventListener("click",()=>{
  closeDeleteThumbnail()
  fetchDisplayEdition()
  fetchDisplayWorksHome()
  })
}

async function fetchDisplayEdition(){
  try {
    const response = await  fetch("http://localhost:5678/api/works")
    const data = await response.json()
    galleryEdition.innerHTML=" "
      for (let work of data){
        displayWorkEdition(work)
      }
    deleteWork(data)
  }
  catch (err) {
  console.log('Une erreur est survenue',err)
  }
}

async function fetchCreateOption(){
  try {
  const response = await fetch("http://localhost:5678/api/categories")
  const data = await response.json()
  createOptionSelect(data)
  }
  catch (err) {
    console.log('Une erreur est survenue',err)
  }
}



function deleteWork(data){
  const trashes = document.querySelectorAll(".fa-trash-can")
  for (trashCan of trashes){
    trashCan.addEventListener("click",(e)=> {
      const index =((Array.from(trashes)).indexOf(e.target))
      const id = (data[index].id)
      fetch(`http://localhost:5678/api/works/${id}`,{
        method:"DELETE",
        headers: {
          'authorization': `Bearer ${userToken}`,
        }
      })
      .then (response => {
        if (response.status === 204 ) {
          modalWindow.style.display="none";
          thumbnailWindow.style.display="flex";
          createDeleteThumbnail(data[index])
          eventCloseThumbnail()     
        } 
      })            
    }) 
  } 
}

async function fetchPostWork(formData){
  try{
    const response = await fetch("http://localhost:5678/api/works",{
      method: "POST",
      headers: {
        'authorization': `Bearer ${userToken}`,
        'accept':'application/json',
      },
      body: formData   
    })
    const rep = await response.json() 
      reset()
      addWorkWindow.style.display="none"
      fetchDisplayEdition()
      fetchDisplayWorksHome()    
  }
  catch (err) {
    console.log('Une ERREUR est survenue',err)
  }
}

function postWork(){ 
  postForm.addEventListener("submit",(e)=>{
    e.preventDefault()
    if(inputFile.files[0].size < 400000){
      const formData = new FormData(postForm)
      fetchPostWork(formData)
    }
  }) 
}

if (userToken !== null){
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
  
  document.querySelector("#modalLink").addEventListener("click", ()=>{
    modalWindow.style.display ="flex";
  })             
  document.querySelector("#openAddModal").addEventListener("click", ()=>{
    addWorkWindow.style.display ="flex";
  })
  arrow.addEventListener("click", ()=>{
    modalWindow.style.display ="flex";
  }) 
}



