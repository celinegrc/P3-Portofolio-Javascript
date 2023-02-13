//Récupération des données User stockées dans le local storage
let userToken = localStorage.getItem("token")
let userId = localStorage.getItem("userId")

//Non affichage des fenêtres modales dès l'affichage de la page
document.querySelector("#modalWindow").style.display ="none";
document.querySelector("#addWork").style.display ="none";
document.querySelector("#deleteConfirm").style.display ="none";


// Création des éléments html des boutons filtres
const workButtonContainer = document.createElement("ul")
workButtonContainer.classList.add('buttonContainer')
document.querySelector(".gallery").before(workButtonContainer)


 // Création des boutons de filtres
 fetch("http://localhost:5678/api/categories")
    
 .then(function(response) {
   if (response.ok) {
      return response.json();
   }
 })
 
 .then(function(categories){
    const categorySet = new Set();
    categorySet.add("Tous")
    for (let category of categories){
      categorySet.add(category.name)
      console.log(categorySet)
      }
    for (let name of categorySet){
      let workButton = document.createElement("li")
      workButton.classList.add('buttons')
      workButton.innerText = name
      workButtonContainer.appendChild(workButton)
      }
  })
  
 .catch (function(err) {
   console.log('Une erreur est survenue',err)})


//Fonction d'affichage des projets dans la galerie
function displayWork(work){
  const workFigure = document.createElement("figure")
  const workImg = document.createElement("img")
  workImg.src = work.imageUrl
  const workFigcaption = document.createElement("figcaption")
  workFigcaption.innerHTML = work.title
  document.querySelector(".gallery").appendChild(workFigure)
  workFigure.appendChild(workImg)
  workFigure.appendChild(workFigcaption)
 }


fetch("http://localhost:5678/api/works")
  .then(function(response) {
    if (response.ok) {
      return response.json();
    }
  })

  .then(function(data){
     for (let work of data){
      displayWork(work)
    }
    deleteWork(data)
// Boutons-filtres: ajout du style lors de la sélection
    const categoryButtons = document.querySelectorAll('.buttons')
    for(let button of categoryButtons){
      if (button.innerText === "Tous"){
        button.classList.add("active")
      }
      button.addEventListener("click",() => {
        for (let activeButton of categoryButtons)
        {
          activeButton.classList.remove("active")   
        }
      button.classList.add("active")
      })
    }

// Affichage des travaux par filtre
    for(let button of categoryButtons){
      button.addEventListener("click",(e) => {

      //Vider la galerie
      document.querySelector(".gallery").innerHTML=" ";
          
      // Filtrer les projets: création d'un objet qui contient les projets si categorie du projet = texte du bouton cliqué 
      const workFiltres = data.filter(
        data => data.category.name === e.target.innerText
        )
      // Appel à la fonction d'affichage pour les travaux filtrés
      for (let workFiltre of workFiltres){      
          displayWork(workFiltre)
          }
      for (let work of data){       
          if (button.innerText === "Tous") {
              displayWork(work)
            }
          }
      })
    }   
  })

    .catch (function(err) {
    console.log('Une erreur est survenue',err)})



if (userToken === null){

// Suppression des éléments affichés uniquement en mode éditeur
  let modifyTag = document.querySelectorAll(".modifTag")
    for (let tag of modifyTag){
      tag.remove()
      }

    document.querySelector("#logoutButton").remove()
    document.querySelector(".editionMode").remove()
    document.querySelector("#addWork").remove()
    document.querySelector("#modalWindow").remove()
    document.querySelector("#deleteConfirm").remove()
}




