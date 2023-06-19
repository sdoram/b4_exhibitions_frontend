console.log('my-page 연결')

import { myPageAPI } from "./api.js";

window.onload = function loadUserInfo() {
    // url 객체 생성 후 user_id 값 추출 
    const user_id = new URLSearchParams(window.location.search).get("user_id")
    myPageAPI(user_id).then(({ response, responseJson }) => {
        console.log(response, responseJson)
        const userInfo = responseJson

        // 프로필 이미지
        const profileImg = document.getElementById("profileImg");
        profileImg.setAttribute("src", decodeURIComponent(userInfo.profile_image.split("media/")[1]));

        // 유저아이디
        const nickname = document.getElementById("nickname");
        nickname.innerText = userInfo.nickname

        // 함께한 시간
        const sinceToGether = document.getElementById("sinceToGether")
        sinceToGether.innerText = `${userInfo.since_together}일`

        // 자기소개
        const bio = document.getElementById("bio");
        bio.innerText = userInfo.bio
    })
}