console.log('my-page 연결')

import { myPageAPI, payloadParse, payload, frontendBaseURL, withdrawalAPI } from "./api.js";


window.onload = function loadUserInfo() {
    // url 객체 생성 후 user_id 값 추출 
    const user_id = new URLSearchParams(window.location.search).get("user_id")
    console.log(user_id)
    myPageAPI(user_id).then(({ response, responseJson }) => {
        console.log(response, responseJson)
        const userInfo = responseJson

        // 프로필 이미지
        const profileImg = document.getElementById("profileImg");
        if (userInfo.profile_image) {
            profileImg.setAttribute("src", decodeURIComponent(userInfo.profile_image.split("media/")[1]));
        }

        // 유저아이디
        const nickname = document.getElementById("nickname");
        nickname.innerText = userInfo.nickname

        // 함께한 시간
        const sinceToGether = document.getElementById("sinceToGether")
        sinceToGether.innerText = `${userInfo.since_together}일`

        // 자기소개
        const bio = document.getElementById("bio");
        bio.innerText = userInfo.bio

        if (payload) {
            if (user_id == payloadParse.user_id) {
                const btnsPart = document.getElementById("btnsPart")

                const profileEditButton = document.createElement("button")
                profileEditButton.setAttribute("id", `profileEdit${payloadParse.user_id}`)
                profileEditButton.addEventListener("click", function () {
                    profileEdit(this.id.split('profileEdit')[1])
                })
                profileEditButton.innerText = "회원정보 수정하기"


                const withdrawalButton = document.createElement("button")
                withdrawalButton.setAttribute("id", `withdrawal${payloadParse.user_id}`)
                withdrawalButton.innerText = "회원 탈퇴하기"
                withdrawalButton.addEventListener("click", function () {
                    withdrawal(this.id.split('withdrawal')[1])
                })

                btnsPart.appendChild(profileEditButton)
                btnsPart.appendChild(withdrawalButton)
            }
        }
    })
}

function profileEdit(user_id) {
    console.log('프로필 수정', user_id)
    window.location.href = `${frontendBaseURL}/templates/updated-user.html?user_id=${user_id}`
}

function withdrawal(user_id) {
    console.log('회원 탈퇴', user_id)
    withdrawalAPI(user_id).then(({ response, responseJson }) => {
        if (response.status == 200) {
            localStorage.removeItem("access")
            localStorage.removeItem("refresh")
            localStorage.removeItem("payload")
            location.reload();
        }
    })
}