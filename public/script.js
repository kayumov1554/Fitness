function showMain() {
  document.getElementById("main").style.display = "block";
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "none";
}

function showLoginForm() {
  document.getElementById("main").style.display = "none";
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("registerForm").style.display = "none";
}

function showRegisterForm() {
  document.getElementById("main").style.display = "none";
  document.getElementById("registerForm").style.display = "block";
  document.getElementById("loginForm").style.display = "none";
}

function showLoader() {
  document.getElementById("loader").style.display = "block";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
}

async function login() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  if (!username || !password) {
    document.getElementById("loginMessage").innerText =
      "Username va parolni kiriting.";
    return;
  }

  showLoader();

  const response = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  hideLoader();

  if (response.ok) {
    document.getElementById("loginMessage").innerText = await response.text();
    setTimeout(function () {
      window.location.href = "welcome.html";
    }, 2000);
  } else {
    document.getElementById("loginMessage").innerText = await response.text();
  }
}

async function register() {
  const username = document.getElementById("registerUsername").value;
  const password = document.getElementById("registerPassword").value;

  if (!username || !password) {
    document.getElementById("registerMessage").innerText =
      "Username va parolni kiriting.";
    return;
  }
  showLoader();

  const response = await fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    document.getElementById("registerMessage").innerText =
      await response.text();
    setTimeout(function () {
      hideLoader();
      showLoginForm();
    }, 1500);
  } else {
    hideLoader();
    document.getElementById("registerMessage").innerText =
      await response.text();
  }
}
