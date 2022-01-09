"use script";

let city = document.querySelector(".nav__profile__user-loc").innerText;
//console.log(window);
let options = {
  root: null,
  rootMargin: "0px",
  threshold: 0.8,
};
const callback = (e) => {
  // console.log(e);
  if (e[0].isIntersecting) {
    url = `http://127.0.0.1:3000/api/v1/post/getAllpost/${city}?page=${page}`;
    getPosts(url);
  }
};

const getPosts = async (url) => {
  const promise = await fetch(url);
  const posts = await promise.json();
  if (posts.status == "success") {
    //console.log(posts);
    renderPosts(posts);
  } //else appendAlert(posts.message);
};
const renderPosts = (posts) => {
  const upcomingPosts = posts.data.Post;
  const currentUserId = document.querySelector(".nav__profile").dataset.userid;
  upcomingPosts.forEach((el) => {
    const user = el.user;
    let like_dislike_image;
    let className = "";
    if (el.likedBy.includes(currentUserId)) {
      like_dislike_image = "/img/homepage/like-1.svg";
      className = "liked";
    } else {
      like_dislike_image = "/img/homepage/like-0.svg";
    }
    const postElement = document.createElement("div");
    const html = `<div class="post__box post-1" data-postid=${el._id} >
    <div class="post__header post__header__post-1">
      <img
        src=${user.profile || "/img/homepage/user-3.svg"}
        class="tl-users-pf tl-user-pf__post-1"
      />
      <div class="tl-users-info tl-user-info__post-1">
        <div class="tl-users-name tl-user-name__post-1">${user.name}</div>
        <div class="tl-users-loc tl-user-loc__post-1">${user.city}</div>
      </div>
    </div>
    <!--Post header-->

    <div class="post__status post-1--status">${el.status}</div>
    <p class="post__text-field post-1--text-field">
     ${el.discription}
    </p>

    <div class="post__imgs--div post--1__img--div">
      <img src="/img/homepage/p1.jpg" class="post__img post--1__img--1" />
      <div class="post__img-counter post--1__img--counter">+3</div>
    </div>

    <div class="post__foot post-1--foot">
      <button class="post__view post-1--view">View More</button>
      <button class="post__like ${className}">
        <img
          src=${like_dislike_image}
          class="post__like-img post__like-img-0"
        />
        <div class="post__like-counter">
          <span class="post__like-count">${el.likes}</span> Likes
        </div>
      </button>
    </div>
  </div>`;
    postElement.innerHTML = html;
    allPosts.append(postElement);
  });
  page++;
  activateLikeButton();
  //console.log(allPosts.children[allPosts.children.length - 1]);
};
const allPosts = document.querySelector(".posts");
let totalPosts = allPosts.children.length;
let page = 1;
if (totalPosts < 1) {
  const url = `http://127.0.0.1:3000/api/v1/post/getAllpost/${city}?page=1`;
  getPosts(url);
}
setInterval(() => {
  let observer = new IntersectionObserver(callback, options);
  if (allPosts.children[0])
    observer.observe(allPosts.children[allPosts.children.length - 1]);
  // console.log("hello", allPosts.children[allPosts.children.length - 1]);
}, 5000);

const cityDropDown = document.querySelector(".nav__city-dropdown");
cityDropDown.addEventListener("click", (e) => {
  //console.log(e.target.innerText);
  city = e.target.innerText;
  url = `http://127.0.0.1:3000/api/v1/post/getAllpost/${city}?page=1`;
  page = 1;
  //console.log([...allPosts.children]);
  [...allPosts.children].forEach((el) => {
    el.remove();
  });
  getPosts(url);
});

//////////////////////////////////// Posts TimeLine//////////////////////
const postTimeline = document.querySelector(".posts");
console.log(postTimeline);
postTimeline.addEventListener("click", (e) => {
  if (e.target.classList.contains("post__view")) {
    const postId = e.target.closest(".post__box").dataset.postid;
    const url = `/postDetail/${postId}`;
    location.assign(url);
  }
});
