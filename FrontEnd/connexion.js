document.querySelector("#loginButton").style.fontWeight ="bold"
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const form = document.querySelector("form")
const logError = document.createElement("p")

function connexionIsOk(data) {
  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.userId)
    window.location.replace("index.html")
  } 
}

function displayLogError(data) {
  console.log(data)
  if (data.message=="user not found") {
    email.after(logError)
    logError.style.color ="#E23D36"
    logError.innerHTML = "Adresse Email inconnue"
  }
  else if (data.error) {
    password.after(logError)
    logError.style.color ="#E23D36"
    logError.innerHTML = "Veuillez vérifier votre mot de passe"
  }
  form.addEventListener("click", ()=> {
    logError.remove()
  })
}

function fetchConnexion(emailValue,passwordValue) {
  fetch("http://localhost:5678/api/users/login", {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify (
      {
        "email": emailValue,
        "password": passwordValue
      }
    )
  })
  .then(response => response.json()
  )
  .then(data => {
    connexionIsOk(data)
    displayLogError(data)   
  })
  .catch((error) => {
    console.log("Erreur : " + error.message);
  });
}

form.addEventListener("submit",function(event) {
  event.preventDefault() 
  const emailValue = email.value;
  const passwordValue = password.value;
  fetchConnexion(emailValue, passwordValue)
})