if (userToken !== null){

//Supression des boutons de filtres et du login
  document.querySelector("#loginButton").remove()
  document.querySelector(".buttonContainer").remove()

// Deconnexion 
  document.querySelector("#logoutButton").addEventListener("click", ()=>{
    localStorage.removeItem("token")
    window.location.replace('index.html')
  })

// Récupération des catégories ID & Name pour le menu déroulant d'ajout de photos
  fetch("http://localhost:5678/api/categories")  
  .then(function(response) {
    if (response.ok) {
      return response.json();
    }
  })
  .then(function(data){  
  //Création des Select du menu déroulant du formulaire d'ajout de photo
    const parentSelect = document.querySelector("#categoryForm")
    for(let category of data){
      let optionCategory = document.createElement("option")
      optionCategory.innerText = category.name
      optionCategory.value = category.id
      parentSelect.appendChild(optionCategory)
    }
  })
  .catch (function(err) {
    console.log('Une erreur est survenue',err)
  })


 //Création de la fonction d'affichage de la galerie dans la modale
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

//Affichage des travaux dans la modale 
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
            
// ouverture de la modale
  document.querySelector("#modalLink").addEventListener("click", ()=>{
  document.querySelector("#modalWindow").style.display ="flex";
  })
                  
// Ouverture de la fenêtre pour ajouter des photos
  document.querySelector("#openAddModal").addEventListener("click", ()=>{
    document.querySelector("#addWork").style.display ="flex";
    document.querySelector("#modalWindow").style.display="none";
  })
                
// Fermeture de la modale 
  document.querySelector(".fa-xmark").addEventListener("click", ()=>{
    document.querySelector("#modalWindow").style.display="none";
  })
  document.querySelector("#modalWindow").addEventListener("click", ()=>{
    document.querySelector("#modalWindow").style.display="none";
  })
                                 
// Fermeture de la fenêtre d'ajout de photos et réinitialisation du formulaire 
  document.querySelector("#xClose").addEventListener("click", ()=>{
    document.querySelector("#addWork").style.display="none";
    document.querySelector("#addWorkForm").reset()
    document.querySelector(".uploadedImage").remove()   
  })
  document.querySelector("#addWork").addEventListener("click", ()=>{
    document.querySelector("#addWork").style.display="none";
    document.querySelector("#addWorkForm").reset()
    document.querySelector(".uploadedImage").remove()   
  })
  
// Revenir en arrière sur le formulaire d'ajout  et réinitialisation du formulaire 
  document.querySelector(".fa-arrow-left").addEventListener("click", ()=>{
    document.querySelector("#addWork").style.display="none";
    document.querySelector("#modalWindow").style.display="flex"
    document.querySelector("#addWorkForm").reset()
    document.querySelector(".uploadedImage").remove() 
  })
                    
// Ne pas fermer les fenêtres quand on clique à l'intérieur de la fenêtre 
  const jsStop = document.querySelectorAll(".jsStop")
    for (let js of jsStop) {
      js.addEventListener("click", (e)=>{
       e.stopPropagation()
      })
    }
               
    
// Form ajout de photo : affichage de la miniature après chargement
    
  const inputFile = document.querySelector("#file")  
  inputFile.addEventListener('change', function () {
    let reader = new FileReader();
    reader.addEventListener("load", function(){
      let uploadedImg = document.createElement("img")
      uploadedImg.classList.add("uploadedImage")
      uploadedImg.src= reader.result
      document.querySelector(".insertPhoto").append(uploadedImg);
    })
      reader.readAsDataURL(inputFile.files[0]);
  });


 // Création de la fonction d'ajout d'un projet   
  const form = document.querySelector("#addWorkForm")
  form.addEventListener("submit",(e)=>{
    e.preventDefault()
    const formData = new FormData(addWorkForm)
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
      document.querySelector("#addWork").style.display="none"
      //Réinitialiser les données du formulaire
      document.querySelector("#addWorkForm").reset()
      document.querySelector(".uploadedImage").remove()
      //Afficher le nouveau projet
      displayWork(data)
      displayWorkEdition(data)
      })
    .catch (function(err) {
      console.log('Une ERREUR est survenue',err)
    })
  }) 
}

// Création de la fonction de suppression d'un projet
function deleteWork(data){
  const trashes = document.querySelectorAll(".fa-trash-can")
    
//Récupération de l'ID du projet à supprimer
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

        //Fermeture de la modale
          document.querySelector("#modalWindow").style.display="none";

        //Ouverture de la fenêtre d'affichage du projet supprimé
          document.querySelector("#deleteConfirm").style.display="flex";

        //Création et affichage de la miniature de la photo du projet supprimé
          let deleteImg = document.createElement("img")
          deleteImg.src = data[index].imageUrl 
          document.querySelector("#imgContainer").appendChild(deleteImg)
        
        //
          document.querySelector("#closeBtn").addEventListener("click",()=>{
            document.querySelector("#deleteConfirm").style.display="none"
            document.querySelector(".gallery").innerHTML=" "
            document.querySelector(".galleryEdition").innerHTML=" "
        //Réaffichage des travaux en excluant le projet supprimé
            for (let work of data){
                if(work.id !== id) {
                  displayWork(work)
                  displayWorkEdition(work)
                }
            }
          document.querySelector("#publishButton").classList.add("publish")
            
            }) /*fin de l'evenement fermer deleteConfirm*/ 

          // 
          document.querySelector("#publishButton").addEventListener("click",()=>
            window.location.replace("index.html"))           
          } /* fin du if*/
        }) /*fin du then */           
      }) /* fin de l'evenement clic trash*/
  } /*fin de la boucle for*/
}  /* fin de la fonction delete work*/