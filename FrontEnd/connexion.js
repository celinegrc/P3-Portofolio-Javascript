
/* Style de l'item "login" du menu*/ 
document.querySelector("#loginButton").style.fontWeight ="bold"


document.querySelector("form").addEventListener("submit",function(event){
  event.preventDefault() 

  let email = document.querySelector("#email");
  let password = document.querySelector("#password")
  let emailValue=email.value;
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

        /* Création du message d'erreur de connexion*/
        let logError = document.createElement("p")
        document.querySelector("h2").after(logError)
        logError.style.color ="#E23D36"
        document.querySelector("form").addEventListener("click", ()=>{
          logError.remove()
        })

        /*Vérification de la valdité des valeurs de connexion*/
        if (data.token) {
          localStorage.setItem("token", data.token);
          window.location.replace("index.html")

        } else if (data.message) {
          logError.innerHTML = "Adresse Email inconnue"

        } else if (data.error) {
          logError.innerHTML = "Veuillez vérifier votre mot de passe"
        } 
      })

      .catch((error) => {
        console.log("Erreur : " + error.message);
      });
})

  