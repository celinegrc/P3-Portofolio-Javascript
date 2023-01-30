document.querySelector("#modalWindow").style.display ="none";

function displayWork(work){
  const workFigure = document.createElement("figure")
  const workImg = document.createElement("img")
  workImg.setAttribute("crossorigin", "anonymous")
  workImg.src = work.imageUrl
  const workFigcaption = document.createElement("figcaption")
  workFigcaption.innerHTML = work.title
  document.querySelector(".gallery").appendChild(workFigure)
  workFigure.appendChild(workImg)
  workFigure.appendChild(workFigcaption)
}

const workButtonContainer = document.createElement("ul")
workButtonContainer.classList.add("categoryNav")
workButtonContainer.classList.add('button_container')
document.querySelector(".gallery").before(workButtonContainer)


fetch("http://localhost:5678/api/works")
  .then(function(response) {
    if (response.ok) {
      return response.json();
    }
  })

  .then(function(data){

    const categorySet = new Set();
    for(let work of data){ 
      displayWork(work)
      displayWorkEdition(work)
      categorySet.add("Tous")
      categorySet.add(work.category.name)
    }

    for(let element of categorySet){
      let workButton = document.createElement("li")
      workButton.classList.add('buttons')
      workButton.innerText=element
      workButtonContainer.appendChild(workButton)
    }
        
    let categoryButtons = document.querySelectorAll('.buttons')
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
  .catch(function(err) {
    console.log('Une erreur est survenue',err)
  })


let userToken = localStorage.getItem("token")

if(userToken){
  document.querySelector("#loginButton").remove()
  document.querySelector(".categoryNav").remove()
  function deconnect(){
    localStorage.clear("token")
  }
  document.querySelector("#logoutButton").addEventListener("click", ()=>{
    deconnect()
    window.location.replace('index.html')
  })

  document.querySelector("#modalLink").addEventListener("click", ()=>{
    document.querySelector("#modalWindow").style.display ="flex";
  })
  document.querySelector(".fa-xmark").addEventListener("click", ()=>{
    document.querySelector("#modalWindow").style.display="none";
  })
} else {
    let modifyTag= document.querySelectorAll(".modification")
    for (let tag of modifyTag){
      tag.remove()
    }
    document.querySelector("#logoutButton").remove()
    document.querySelector(".editionMode").remove() 
}

function displayWorkEdition(work){
const figureEdition = document.createElement("figure")
const deleteIcon  = document.createElement("div")
deleteIcon.innerHTML= `<i class="fa-solid fa-trash-can"></i>`
const imgEdition = document.createElement("img")
imgEdition.setAttribute("crossorigin", "anonymous")
imgEdition.src = work.imageUrl
const figcaptionEdition = document.createElement("figcaption")
figcaptionEdition.innerHTML = "éditer"
document.querySelector(".galleryEdition").appendChild(figureEdition)
figureEdition.appendChild(deleteIcon)
figureEdition.appendChild(imgEdition)
figureEdition.appendChild(figcaptionEdition)}





