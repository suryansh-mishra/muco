'use strict';

const signupModal = document.querySelector('#signup');
const signuplink = document.getElementById('sign-up-link');
const overlay = document.querySelector('.overlay');
const cross = document.querySelector('.cross-modal');

overlay.addEventListener('click', function () {
  /*if (signupModal.classList.contains('hidden'))*/
  signupModal.classList.add('hidden');
  overlay.classList.add('hidden');
});
signuplink.addEventListener('click', function () {
  /*if (
    !signupModal.classList.contains('hidden') &&
    !container.classList.contains('overlay')
  )*/
  console.log('removing overlay and hidden class');
  signupModal.classList.remove('hidden');
  overlay.classList.remove('hidden');
});
cross.addEventListener('click', function () {
  if (
    !signupModal.classList.contains('hidden') &&
    !overlay.classList.contains('hidden')
  ) {
    signupModal.classList.add('hidden');
    overlay.classList.add('hidden');
  }
});
