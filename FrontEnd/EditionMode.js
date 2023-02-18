const inputFile = document.querySelector("#image")
const uploadedImg = document.createElement("img")
const deleteImg = document.createElement("img")
uploadedImg.classList.add("uploadedImage")
const postForm = document.querySelector("#addWorkForm")
const parentSelect = document.querySelector("#category")
const emptyOption = document.createElement("option")
const galleryEdition = document.querySelector(".galleryEdition")
const jsStop = document.querySelectorAll(".jsStop")
const postBtn = document.querySelector("#validButton")

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
  parentSelect.appendChild(emptyOption)
    for(let category of data){
      let optionCategory = document.createElement("option")
      optionCategory.innerText = category.name
      optionCategory.value = category.id
      parentSelect.appendChild(optionCategory)
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

function closeDeleteThumbnailEvent(){
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
    }   
  })
}

function fileTooLoud(){
  const fileTooLoud = document.createElement('p')
  document.querySelector(".insertPhoto").append(fileTooLoud)
  fileTooLoud.innerText="Le fichier est trop volumineux"
  fileTooLoud.style.color = "#E23D36"
  fileTooLoud.style.fontWeight="bold"
  document.querySelector(".addContent").addEventListener("click",()=>{
      fileTooLoud.innerText=" "
  })
  document.querySelector("#fileSizeMax").style.color = "#E23D36"
  document.querySelector("#fileSizeMax").style.fontWeight="bold"
  document.querySelector(".addContent").addEventListener("click",()=>{
  document.querySelector("#fileSizeMax").style.color = "black"
  document.querySelector("#fileSizeMax").style.fontWeight="normal"
})
}

function jsStopPropagation(){
  for (let element of jsStop) {
    element.addEventListener("click", (e)=>{
     e.stopPropagation()
    })
  }
} 

function fetchDisplayEdition(){
  fetch("http://localhost:5678/api/works")
  .then(function(response){
    if (response.ok) {
      return response.json();
    }
  })
  .then(function(data){
    galleryEdition.innerHTML=" "
    for (let work of data){
      displayWorkEdition(work)
    }
  deleteWork(data)
  })
  .catch (function(err) {
  console.log('Une erreur est survenue',err)
  })
}

function fetchCreateOption(){
  fetch("http://localhost:5678/api/categories")  
  .then(function(response){
    if (response.ok) {
      return response.json();
    }
  })
  .then(function(data){  
    createOptionSelect(data)
  })
  .catch (function(err) {
    console.log('Une erreur est survenue',err)
  })
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
        if(response.status === 204 ) {
          modalWindow.style.display="none";
          thumbnailWindow.style.display="flex";
          createDeleteThumbnail(data[index])
          document.querySelector("#closeBtn").addEventListener("click",()=>{
            closeDeleteThumbnailEvent()
            fetchDisplayEdition()
            fetchDisplayWorksHome() 
          })    
        } 
      })            
    }) 
  } 
}

function postWork(){ 
  postForm.addEventListener("submit",(e)=>{
   e.preventDefault()
    if(inputFile.files[0].size < 400000){
      const formData = new FormData(postForm)
      fetch("http://localhost:5678/api/works",{
        method: "POST",
        headers: {
          'authorization': `Bearer ${userToken}`,
          'accept':'application/json',
        },
        body: formData   
      })
      .then(response => {
        console.log(response)
        reset()
        addWorkWindow.style.display="none"
        fetchDisplayEdition()
        fetchDisplayWorksHome() 
      })
      .catch (function(err) {
        console.log('Une ERREUR est survenue',err)
      })
    }
  }) 
}

function logOut(){
  logOutButton.addEventListener("click", ()=>{
    localStorage.removeItem("token")
    window.location.replace("index.html")
   fetchDisplayWorksHome()
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
  closeAddWorkWindow(document.querySelector("#xClose"))
  closeAddWorkWindow(document.querySelector(".fa-arrow-left"))
  //closeAddWorkWindow(document.querySelector("#validButton"))
  closeAddWorkWindow(addWorkWindow)
  jsStopPropagation()
  postWork()
  formReset(addWorkWindow)
  formReset(document.querySelector("#xClose"))
  formReset(document.querySelector(".fa-arrow-left"))
  
  document.querySelector("#modalLink").addEventListener("click", ()=>{
    modalWindow.style.display ="flex";
  })
                  
  document.querySelector("#openAddModal").addEventListener("click", ()=>{
    addWorkWindow.style.display ="flex";
  })
  
  document.querySelector((".fa-arrow-left")).addEventListener("click", ()=>{
    modalWindow.style.display ="flex";
  })
  
}



