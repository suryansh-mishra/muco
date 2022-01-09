"use strict";
const postBox = document.querySelector(".post__box");
const postId = postBox.dataset.postid;
const view_all_reply_container = document.querySelector(
  ".view_all_reply_container"
);
const getAllReply = async (url, filter) => {
  const promise = await fetch(url);
  const res = await promise.json();
  if (res.status == "success") AppendAllReplies(res.data.post.reply, filter);
  else AlertBoxAppend(res.message);
};
getAllReply(`http://127.0.0.1:3000/api/v1/post/getOnepost/${postId}`);

function AppendAllReplies(allReply, filter = "View Status") {
  if (filter == "View Status") {
    filter = "admin";
  } else {
    filter = "user";
  }
  allReply.forEach((el) => {
    if (el.user.role == filter) {
      const html = `<div class="div_01_reply_sec" data-replyid=${el._id}>
        <div class="post__header post__header__post-1">
            <img src="/img/homepage/user-3.svg" class="tl-users-pf tl-user-pf__post-1" />
            <div class="tl-users-info tl-user-info__post-1">
                <div class="tl-users-name tl-user-name__post-1">${el.user.name}</div>
                <div class="tl-users-loc tl-user-loc__post-1">${el.user.city}</div>
            </div>
        </div>
        <p class="post__text-field post-1--text-field">
            ${el.reply}
        </p>
        <div class="post__imgs--div post--1__img--div">
            <img src="img/p1.jpg" class="post__img post--1__img--1" />
            <div class="post__img-counter post--1__img--counter">+3</div>
        </div>
        <div class="post__foot post-1--foot post_div_last_para ">

            <button class="post__like">
                <img src="img/like-0.svg" class="post__like-img post__like-img-0" />
                <div class="post__like-counter">
                    <span class="post__like-count">2</span> Likes
                </div>
            </button>
        </div>
    </div>`;
      const replybox = document.createElement("div");
      replybox.innerHTML = html;
      view_all_reply_container.append(replybox);
    }
  });
}
const viewReply = document.querySelector(".view_All_Reply");
console.log("hello hye bye", viewReply);
viewReply.addEventListener("click", () => {
  let filter = "View Status";
  [...view_all_reply_container.children].forEach((el) => el.remove());
  const url = `http://127.0.0.1:3000/api/v1/post/getOnepost/${postId}`;
  if (viewReply.dataset.filter == "View Reply") {
    filter = "View Reply";
    viewReply.setAttribute("data-filter", "View Status");
    viewReply.innerText = "View Status";
    document.querySelector(".status_post_details").innerText = "Replies";
  } else {
    filter = "View Status";
    viewReply.setAttribute("data-filter", "View Reply");
    viewReply.innerText = "View Reply";
    document.querySelector(".status_post_details").innerText = "Status";
  }
  getAllReply(url, filter);
});
