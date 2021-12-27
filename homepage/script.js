'use strict';

/* ****** Declaring variables *******/
const app_wrapper = document.querySelector('.app-wrapper');
const timeline = document.querySelector('.timeline');
const city_mng = document.querySelector('.city-mng');
const nav__profile = document.querySelector('.nav__profile');
const nav__options = document.querySelectorAll('.nav__options');
const nav__buttons = document.querySelectorAll('.nav__buttons');
const nav__city = document.querySelector('.nav__city');
const profile__modal = document.querySelector('.profile__modal');
const users_posts__modal = document.querySelector('.users_posts__modal');
const modals_wrapper = document.querySelector('.modals-wrapper');
const post_like_buttons = document.querySelectorAll('.post__like');

const app_pane = document.querySelector('.app-pane');
const user_posts_pg = document.querySelector('.user_posts-pg');
const city_dropdown = document.querySelector('.nav__city-dropdown');
const liked_posts_pg = document.querySelector('.liked_posts-pg');

const nav__cities_list = document.querySelector('.nav_cities-list');
const activeDot = document.createElement('div');
/* ****** Hoisting functions ********/

function splashScreen() {
  setTimeout(() => {
    // document.querySelector('.splash').classList.add('splashOut');
    document.querySelector('.splash').remove();
  }, 0);
}

function hide(elm) {
  elm.classList.add('hidden');
}

function unhide(elm) {
  elm.classList.remove('hidden');
}

function hideModalsWrapper() {
  [...modals_wrapper.children].forEach((el) => {
    hide(el);
  });
}

function hideRightPane(bool) {
  console.log(bool);
  if (bool) {
    [...app_wrapper.children].forEach((e) => {
      hide(e);
    });
    app_wrapper.firstElementChild.classList.remove('hidden');
  } else {
    hide(app_pane);
    unhide(timeline);
    unhide(city_mng);
  }
}

function activeNav(e) {
  nav__buttons.forEach((nav_butt) => {
    if (nav_butt.classList.contains('active-nav'))
      nav_butt.classList.remove('active-nav');
  });
  e.classList.add('active-nav');
}

function addActiveDot(el) {
  el.appendChild(activeDot).classList.add('active-dot');
}

function goHome() {
  activeNav(document.querySelector('.nav__user-home'));
  hideModalsWrapper();
  hideRightPane(false);
}

document.addEventListener('DOMContentLoaded', splashScreen);

/* **** like button logic **** */

[...post_like_buttons].forEach((currButton) => {
  const count = currButton.children[1].firstChild;
  // const currButton = currButton;
  const like_img = currButton.children[0];

  currButton.addEventListener('click', (e) => {
    if (!currButton.classList.contains('liked')) {
      currButton.style.background = 'white';
      currButton.style.color = 'black';
      count.innerHTML = Number(count.innerHTML) + 1;
      like_img.src = 'img/like-1.svg';
      currButton.classList.add('liked');
    } else {
      currButton.classList.remove('liked');
      currButton.style.background = 'whitesmoke';
      currButton.style.color = 'black';
      count.innerHTML = Number(count.innerHTML) - 1;
      like_img.src = 'img/like-0.svg';
    }
  });
});

/* *********** */

/*  profile modal */

nav__profile.addEventListener('click', () => {
  unhide(modals_wrapper);
  unhide(profile__modal);
});

modals_wrapper.addEventListener('click', (e) => {
  if (
    e.target.parentNode.classList.contains('app-wrapper') ||
    e.target.classList.contains('cross-modal')
  ) {
    hide(modals_wrapper);
    hide(profile__modal);
  }
});

/* ***** */

/* **** NAV BUTTONS **** */

nav__buttons.forEach((currElement) => {
  if (currElement.classList.contains('nav__user-home')) {
    currElement.addEventListener('click', (e) => {
      if (!city_dropdown.classList.contains('hidden')) hide(city_dropdown);
      goHome();
    });
    return;
  } else if (currElement.classList.contains('nav__city')) {
    return;
  }
  currElement.addEventListener('click', (e) => {
    [...app_wrapper.children].forEach((e) => {
      hide(e);
    });
    if (!city_dropdown.classList.contains('hidden')) hide(city_dropdown);
    nav__buttons.forEach((nav_butt) => {
      if (nav_butt.classList.contains('active-nav'))
        nav_butt.classList.remove('active-nav');
    });

    app_wrapper.firstElementChild.classList.remove('hidden');
    if (e.target.classList.contains('nav__user-posts')) {
      e.target.classList.add('active-nav');
      unhide(app_pane);
      user_posts_pg.classList.remove('hidden');
    } else if (e.target.classList.contains('nav_liked-posts')) {
      e.target.classList.add('active-nav');
      unhide(app_pane);
      liked_posts_pg.classList.remove('hidden');
    }
  });
});

/* ***** */

nav__city.addEventListener('click', () => {
  unhide(city_dropdown);
  activeNav(nav__city);
});

nav__cities_list.addEventListener('click', (e) => {
  if (e.target.classList.contains('select_nav_city')) {
    // [...nav__cities_list.children].forEach((elm) => {
    //   if (elm.hasChildNodes()) {
    //     console.log(elm.children[0]);
    //   }
    // });
    if (e.target.classList.contains('select-ranchi')) {
      hide(nav__cities_list.parentElement);
      addActiveDot(e.target);
    }
    if (e.target.classList.contains('select-mumbai')) {
      hide(nav__cities_list.parentElement);
      addActiveDot(e.target);
    }
    if (e.target.classList.contains('select-chennai')) {
      hide(nav__cities_list.parentElement);
      addActiveDot(e.target);
    }
    if (e.target.classList.contains('select-kolkata')) {
      hide(nav__cities_list.parentElement);
      addActiveDot(e.target);
    }
    if (e.target.classList.contains('select-bengaluru')) {
      hide(nav__cities_list.parentElement);
      addActiveDot(e.target);
    }
  }
});

// nav__profile.addEventListener('click', () => {
//   /*if (profile__modal.classList.contains('hidden')) {
//     [...app_wrapper.children].forEach((e) => {
//       e.classList.add('hidden');
//     });
//     app_wrapper.firstElementChild.classList.remove('hidden');

//     modals_wrapper.classList.remove('hidden');
//     [...modals_wrapper.children].forEach((ele) => {
//       ele.classList.add('hidden');
//     });
//     profile__modal.classList.remove('hidden');
//   }*/
// });
