
// Style de l'item "login" du menu
document.querySelector("#loginButton").style.fontWeight ="bold"

document.querySelector("form").addEventListener("submit",function(event){
  event.preventDefault() 

//Récupération des valeurs entrées dans le formulaire
  let email = document.querySelector("#email");
  let password = document.querySelector("#password");
  let emailValue = email.value;
  let passwordValue = password.value;

  fetch("http://localhost:5678/api/users/login", {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ 
        "email": emailValue,
        "password": passwordValue
      })
    })
      .then(response => response.json()
      )
      .then(data => {
        console.log(data)

        //Création d'un paragraphe d'erreur de connexion
          let logError = document.createElement("p")

        
          document.querySelector("form").addEventListener("click", ()=>{
          logError.remove()
        })

        //Vérification de la valdité des valeurs de connexion
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.userId)
          window.location.replace("index.html")

        } else if (data.message) {
          
          document.querySelector("#email").after(logError)
          logError.style.color ="#E23D36"
          logError.innerHTML = "Adresse Email inconnue"

        } else if (data.error) {
          document.querySelector("#password").after(logError)
          logError.style.color ="#E23D36"
          logError.innerHTML = "Veuillez vérifier votre mot de passe"
        } 
      })

      .catch((error) => {
        console.log("Erreur : " + error.message);
      });
})

  