"use strict";
const saveChanges = document.querySelector("#usr_info_save-changes");
const passwordChange = document.querySelector("#usr_confirm-change-pwd");
const appendAlert = (message, timer) => {
  const alertBox = document.querySelector(".alert");
  alertBox.innerText = message;
  alertBox.classList.remove("hidden");
  setTimeout(() => {
    alertBox.classList.add("hidden");
  }, timer || 3000);
};
const changeprofile = async (reqBody, url, message) => {
  const promise = await fetch(url, {
    method: "PATCH",
    body: JSON.stringify(reqBody),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (message == "Password-change") {
    appendAlert("Please Wait", 2000);
  }
  const res = await promise.json();
  appendAlert(res.message);
  if (res.status == "success" && message == "Profile-change") {
    document.querySelector(".nav__profile__user-name").innerText =
      res.data.value.name;
    document.querySelector(".nav__profile__user-loc").innerText =
      res.data.value.city;
  }
  if (res.status == "success" && message == "Password-change") {
    window.setTimeout(() => {
      location.assign("/login");
    }, 4000);
  }
};
saveChanges.addEventListener("click", (e) => {
  e.preventDefault();
  let firstname = document.querySelector(".first-name");
  firstname = firstname.value || firstname.getAttribute("placeholder");
  let lastname = document.querySelector(".last-name");
  lastname = lastname.value || lastname.getAttribute("placeholder");
  const name = [firstname, lastname].join(" ");
  let city = document.querySelector(".user-cityname");
  city = city.value || city.getAttribute("placeholder");
  const url = `http://127.0.0.1:3000/api/v1/users/updateMe`;
  changeprofile({ name, city }, url, "Profile-change");
});
passwordChange.addEventListener("click", (e) => {
  e.preventDefault();
  const currentPassword = document.querySelector("#usr_curr-pwd").value;
  const password = document.querySelector("#usr_new-pwd").value;
  const confirmpassword = document.querySelector("#usr_confirm-pwd").value;
  const url = "http://127.0.0.1:3000/api/v1/users/passwordUpdate";
  changeprofile(
    { currentPassword, password, confirmpassword },
    url,
    "Password-change"
  );
});
