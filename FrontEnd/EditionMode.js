if (userToken !== null){

  const inputFile = document.querySelector("#file")
  const uploadedImg = document.createElement("img")
  uploadedImg.classList.add("uploadedImage")
  const form = document.querySelector("#addWorkForm")
  const parentSelect = document.querySelector("#categoryForm")
  const emptyOption = document.createElement("option")

  logInButton.remove()
  workButtonContainer.remove()
  logOutButton.addEventListener("click", ()=>{
    localStorage.removeItem("token")
    window.location.replace('index.html')
  })

  function displayWorkEdition(work){
    const figureEdition = document.createElement("figure")
    figureEdition.classList.add("editionImg")
    const deleteIcon  = document.createElement("div")
    deleteIcon.innerHTML= `<i class="fa-solid fa-trash-can"></i>`
    const imgEdition = document.createElement("img")
    imgEdition.src = work.imageUrl
    const figcaptionEdition = document.createElement("figcaption")
    figcaptionEdition.innerHTML = "éditer"
    document.querySelector(".galleryEdition").appendChild(figureEdition)
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

  fetch("http://localhost:5678/api/categories")  
  .then(function(response) {
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


 
  fetch("http://localhost:5678/api/works")
  .then(function(response) {
    if (response.ok) {
      return response.json();
    }
  })
  .then(function(data){
    for (let work of data){
      displayWorkEdition(work)
    }
   deleteWork(data)
  })
  .catch (function(err) {
    console.log('Une erreur est survenue',err)
  })
            
  document.querySelector("#modalLink").addEventListener("click", ()=>{
    modalWindow.style.display ="flex";
    })
                  
  document.querySelector("#openAddModal").addEventListener("click", ()=>{
    addWorkWindow.style.display ="flex";
    modalWindow.style.display="none";
  })
                
  document.querySelector(".fa-xmark").addEventListener("click", ()=>{
    modalWindow.style.display="none";
  })
  modalWindow.addEventListener("click", ()=>{
    modalWindow.style.display="none";
  })
                                 
  document.querySelector("#xClose").addEventListener("click", ()=>{
    addWorkWindow.style.display="none";
    form.reset()
    if (document.querySelector(".uploadedImage")){
      document.querySelector(".uploadedImage").remove()
    }
  })
  addWorkWindow.addEventListener("click", ()=>{
    addWorkWindow.style.display="none";
    form.reset()
    if (document.querySelector(".uploadedImage")){
      document.querySelector(".uploadedImage").remove()
    } 
  })
  
  document.querySelector(".fa-arrow-left").addEventListener("click", ()=>{
    addWorkWindow.style.display="none";
    document.querySelector("#modalWindow").style.display="flex"
    form.reset()
    document.querySelector(".uploadedImage").remove() 
  })
                    

  const jsStop = document.querySelectorAll(".jsStop")
    for (let js of jsStop) {
      js.addEventListener("click", (e)=>{
       e.stopPropagation()
      })
    }
                
   
  inputFile.addEventListener('change', function () {
    let reader = new FileReader();
    reader.addEventListener("load", function(){
      
      uploadedImg.src= reader.result
      document.querySelector(".insertPhoto").append(uploadedImg);
    })
      reader.readAsDataURL(inputFile.files[0]);
  });


  
  form.addEventListener("submit",(e)=>{
    e.preventDefault()
    console.log (inputFile.files[0].size)
    if(inputFile.files[0].size > 4000000){
      console.log("trop lourd")
    } else {
      const formData = new FormData(form)
      fetch("http://localhost:5678/api/works",{
        method: "POST",
        headers: {
          'authorization': `Bearer ${userToken}`,
          'accept':'application/json',
        },
        body:formData   
      })
      .then(response => response.json()
      )
      .then(data => {
        console.log(data)
        addWorkWindow.style.display="none"
        form.reset()
        document.querySelector(".uploadedImage").remove()
        displayWork(data)
        displayWorkEdition(data)
      })
      .catch (function(err) {
        console.log('Une ERREUR est survenue',err)
      })
    }
  }) 
}


function deleteWork(data){
  const trashes = document.querySelectorAll(".fa-trash-can")
  for (trashCan of trashes){
      trashCan.addEventListener("click",(e)=> {
        let index =((Array.from(trashes)).indexOf(e.target))
        let id = (data[index].id)
        
        fetch(`http://localhost:5678/api/works/${id}`,{
          method:"DELETE",
          headers: {
            'authorization': `Bearer ${userToken}`,
          }
        })
        .then (response => {
          if(response.status === 204 ) {
            document.querySelector("#modalWindow").style.display="none";
            document.querySelector("#deleteConfirm").style.display="flex";
            let deleteImg = document.createElement("img")
            deleteImg.src = data[index].imageUrl 
            document.querySelector("#imgContainer").appendChild(deleteImg)
            document.querySelector("#closeBtn").addEventListener("click",()=>{
              document.querySelector("#deleteConfirm").style.display="none"
              document.querySelector(".gallery").innerHTML=" "
              document.querySelector(".galleryEdition").innerHTML=" "

              for (let work of data){
                if(work.id !== id) {
                  displayWork(work)
                  displayWorkEdition(work)
                }
              }
              document.querySelector("#publishButton").classList.add("publish")
            })  

            document.querySelector("#publishButton").addEventListener("click",()=>
            window.location.replace("index.html"))           
          } 
        })            
      }) 
  } 
}  