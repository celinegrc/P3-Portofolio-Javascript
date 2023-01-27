

window.addEventListener('location.replace', ()=>{
let newH2= document.querySelector("h2")
newH2.innerText= "Je viens du Log In"})
  
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

function ajoutStyleHover(element){
  element.addEventListener("mouseenter",()=>{
    element.style.background ="#1D6154"
    element.style.color ="white"
    element.style.cursor="pointer"})
}
function removeStyleHover(element){
  element.addEventListener("mouseleave",()=>{
  element.style.background ="white"
  element.style.color ="#1D6154"
  element.style.cursor="pointer"})
}


const workButtonContainer = document.createElement("ul")
workButtonContainer.classList.add('button_container')
document.querySelector(".gallery").before(workButtonContainer)

 

fetch("http://localhost:5678/api/works")
    .then(function(response) {
      if (response.ok) {
        return response.json();
      }
    })

    .then(function(data){

      for(let work of data){ 
        displayWork(work)
      }


      const monSet = new Set();

      for(let work of data){
        monSet.add("Tous")
        monSet.add(work.category.name)
       }

      for(let element of monSet){
        let workButton = document.createElement("li")
        workButton.classList.add('buttons')
          if (typeof element==="string"){
          workButton.innerText=element
          workButtonContainer.appendChild(workButton)}
        }
        
        let buttons = document.querySelectorAll('.buttons')
        for(let button of buttons){
          
          button.addEventListener("click",() => {
            document.querySelector(".gallery").innerHTML=" ";
            for (let work of data){
              if (button.innerText === work.category.name){
                displayWork(work)
                }else if (button.innerText === "Tous"){
                  displayWork(work)
                  }

              }
            })
          ajoutStyleHover(button)
          removeStyleHover(button)
          }

      })
     
        .catch(function(err) {
        console.log('Une erreur est survenue',err)
      })
