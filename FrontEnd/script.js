//console.log(localStorage)
let userToken = localStorage.getItem("token")
console.log(userToken)



document.querySelector("#modalWindow").style.display ="none";
document.querySelector("#addWork").style.display ="none";
document.querySelector("#deleteConfirm").style.display ="none";


function displayWork(data){
  const workFigure = document.createElement("figure")
  const workImg = document.createElement("img")
  workImg.setAttribute("crossorigin", "anonymous")
  workImg.src = data.imageUrl
  const workFigcaption = document.createElement("figcaption")
  workFigcaption.innerHTML = data.title
  document.querySelector(".gallery").appendChild(workFigure)
  workFigure.appendChild(workImg)
  workFigure.appendChild(workFigcaption)
}


function displayWorkEdition(data){
  const figureEdition = document.createElement("figure")
  const deleteIcon  = document.createElement("div")
  deleteIcon.innerHTML= `<i class="fa-solid fa-trash-can"></i>`
  const imgEdition = document.createElement("img")
  imgEdition.setAttribute("crossorigin", "anonymous")
  imgEdition.src = data.imageUrl
  const figcaptionEdition = document.createElement("figcaption")
  figcaptionEdition.innerHTML = "éditer"
  document.querySelector(".galleryEdition").appendChild(figureEdition)
  figureEdition.appendChild(deleteIcon)
  figureEdition.appendChild(imgEdition)
  figureEdition.appendChild(figcaptionEdition)
}

const workButtonContainer = document.createElement("ul")
workButtonContainer.classList.add("categoryNav")
workButtonContainer.classList.add('button_container')
document.querySelector(".gallery").before(workButtonContainer)
//if(userToken){
const parentSelect = document.querySelector("#categoryForm")



fetch("http://localhost:5678/api/works")
  .then(function(response) {
    if (response.ok) {
      return response.json();
    }
  })

  .then(function(data){

    const categorySet = new Set();
    categorySet.add("Tous")
  

    for (i=0; i<data.length; i++){
      displayWork(data[i])
      categorySet.add(data[i].category.name)
    }

        if(userToken){
        for (i=0; i<data.length; i++){
         displayWorkEdition(data[i])}
        

         const deleteIcones = document.querySelectorAll(".modalContenu .fa-trash-can")
         let arr = (Array.from(deleteIcones))

          for (icone of arr){
             icone.addEventListener("click",(e)=> {
              let number = (arr.indexOf(e.target))
              console.log(number + "index du tableau")
              let id = (data[number].id)
              console.log(id + "identifiant")
              console.log(data[number].title)
              document.querySelector("#deleteConfirm").style.display="block";
             let deleteImg = document.querySelector("#imgContainer img")
             deleteImg.setAttribute("crossorigin", "anonymous")
             deleteImg.src = data[number].imageUrl 
              
               document.querySelector("#confirmBtn").addEventListener("click", ()=>{
                   fetch(`http://localhost:5678/api/works/${id}`,{
                   method:"delete",
                   headers: {
                       'authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json;charset=utf-8',
                      }
                          })
                    .then(response => response.json()
                    )
                    .then(data => {console.log(data)
                      alert(` photo ${id} supprimée`)
                      })
              })
            })
          }
        }
      

      //Création des Select du menu déroulant Ajout travaux
//if(userToken){
    for(let element of categorySet){
      let selectCategory = document.createElement("option")
      selectCategory.classList.add('selec')
      selectCategory.innerText=element
       parentSelect.appendChild(selectCategory)}
//}
/*Création des boutons filtres de la galerie*/
    for(let element of categorySet){
      let workButton = document.createElement("li")
      workButton.classList.add('buttons')
      workButton.innerText=element
      workButtonContainer.appendChild(workButton)
    }
/* Ajout du style des filtres catégorie sélectionnée*/  
    const categoryButtons = document.querySelectorAll('.buttons')
    for(let button of categoryButtons){
        button.addEventListener("click",() => {
          for (let activeButton of categoryButtons){
            activeButton.classList.remove("active")   
          }
            button.classList.add("active")
          })
        }
/*Affichage des travaux dans la galerie avec les boutons filtres*/
        for(let button of categoryButtons){
     
          button.addEventListener("click",() => {

          document.querySelector(".gallery").innerHTML=" ";  
          for (let work of data){
            if (button.innerText === work.category.name){
              displayWork(work)
             
              } else if (button.innerText === "Tous") {
                displayWork(work)
              }
            }
        })
      }
    })
     .catch (function(err) {
    console.log('Une erreur est survenue',err)})




if(userToken){
  document.querySelector("#loginButton").remove()
  document.querySelector(".categoryNav").remove()
  document.querySelector("#logoutButton").addEventListener("click", ()=>{
    localStorage.removeItem("token")
    window.location.replace('index.html')
  })

 
/* ouvrir la modale*/
  document.querySelector("#modalLink").addEventListener("click", ()=>{
    document.querySelector("#modalWindow").style.display ="flex";
  })
  
/* Ouvrir la 2ème modale pour ajouter des travaux*/
document.querySelector("#openAddModal").addEventListener("click", ()=>{
  document.querySelector("#addWork").style.display ="flex";
  document.querySelector("#modalWindow").style.display="none";
})

/* Fermer la modale*/
  document.querySelector(".fa-xmark").addEventListener("click", ()=>{
    document.querySelector("#modalWindow").style.display="none";
  })
 document.querySelector("#modalWindow").addEventListener("click", ()=>{
    document.querySelector("#modalWindow").style.display="none";
  })
  /*Ne pas fermer la modale quand on clique dans la fenêtre contenu*/
  document.querySelector(".jsStop").addEventListener("click", (e)=>{
    e.stopPropagation()})

   /* Fermer la 2ème modale*/
document.querySelector("#xClose").addEventListener("click", ()=>{
document.querySelector("#addWork").style.display="none";
})
document.querySelector("#addWork").addEventListener("click", ()=>{
  document.querySelector("#addWork").style.display="none";
})
  document.querySelector(".jsStop2").addEventListener("click", (e)=>{
    e.stopPropagation()})

/*fermer la fenêtre de confirmation de suppression avec annuler*/
document.querySelector("#cancelBtn").addEventListener("click", ()=> {
  document.querySelector("#deleteConfirm").style.display="none";
})

} else {
    let modifyTag= document.querySelectorAll(".modifTag")
    for (let tag of modifyTag){
      tag.remove()
    }
    document.querySelector("#logoutButton").remove()
    document.querySelector(".editionMode").remove()
    document.querySelector("#addWork").remove()
    document.querySelector("#modalWindow").remove()
    document.querySelector("#deleteConfirm").remove()

}







