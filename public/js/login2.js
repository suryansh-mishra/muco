/////////////////////////// PUG //////////////////////////////////////////////
/////////////////////////////////////////////
////////////////////////////////

const appendalert = function (status, classname, message) {
  const alert = document.querySelector(`.${classname}`);
  alert.innerText = message;
  alert.classList.remove("hidden");
  alert.classList.add(`${status}`);
  setTimeout(() => {
    alert.classList.add("hidden");
    alert.classList.remove(`${status}`);
  }, 3000);
};
const login = async (reqBody, url) => {
  try {
    const data = await fetch(url, {
      method: "POST",

      // Adding body or contents to send
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const res = await data.json();
    //console.log(res);
    if (res.status == "success") {
      appendalert("success", "alert-login-page", "Successfully Logged in");
      window.setTimeout(() => {
        location.assign("/home");
      }, 1500);
    }
    if (res.status == "fail") {
      appendalert("failure", "alert-login-page", res.message);
    }
    if (res.status == "error") {
      appendalert("failure", "alert-login-page", "Something went wrong");
    }
  } catch (err) {
    console.log(err);
  }
};
const loginbutton = document.querySelector(".submit");
loginbutton.addEventListener("click", (e) => {
  e.preventDefault();
  const email = document.querySelector(".login-user").value;
  const password = document.querySelector(".login-password").value;
  console.log(email, password);
  const url = "http://127.0.0.1:3000/api/v1/users/login";
  login({ email, password }, url);
});

//////////////////////////////
////////////Sign-Up

const signupRegister = async (reqBody, url) => {
  try {
    const data = await fetch(url, {
      method: "POST",

      // Adding body or contents to send
      body: JSON.stringify(reqBody),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const res = await data.json();
    console.log(res);
    if (res.status == "success") {
      appendalert("success", "alert-signin-page", res.message);
      document.querySelector(".cross-admin").click();
    }
    if (res.status == "Fail" || res.status == "fail") {
      appendalert("failure", "alert-signin-page", res.message);
    }
    if (res.status == "error") {
      appendalert("failure", "alert-signin-page", res.message);
    }
  } catch (err) {
    console.log(err.message);
  }
};
const signupForm = document.querySelectorAll("form");
signupForm.forEach((el) => {
  el.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(e.target.dataset.type);
    if (e.target.dataset.type === "signup") {
      const fname = document.querySelector("#fname").value;
      const lname = document.querySelector("#lname").value;
      const name = [fname, lname].join(" ");
      const email = document.querySelector("#mail").value;
      const city = document.querySelector("#city").value;
      const password = document.querySelector("#init-pwd").value;
      const confirmpassword = document.querySelector("#re-pwd").value;
      const url = "http://127.0.0.1:3000/api/v1/users/signup/verify";
      console.log({ name, email, city, password, confirmpassword });
      signupRegister({ name, email, city, password, confirmpassword }, url);
    }
    if (e.target.dataset.type === "admin") {
      const email = document.querySelector("#admin-mail").value;
      const password = document.querySelector("#city-password").value;
      const secretcode = document.querySelector("#secret-pwd").value;
      const name = document.querySelector("#cityname").value;
      const url = "http://127.0.0.1:3000/api/v1/city/registeradmin";
      console.log(name);
      signupRegister({ email, name, password, secretcode }, url);
    }
  });
});
