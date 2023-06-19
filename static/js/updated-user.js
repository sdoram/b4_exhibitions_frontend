console.log('updated-user 연결')

import { myPageAPI, payloadParse, frontendBaseURL, userInfoEditAPI } from "./api.js";

console.log()
window.onload = function () {
    const user_id = new URLSearchParams(window.location.search).get("user_id")

    myPageAPI(user_id).then(({ response, responseJson }) => {
        const userInfo = responseJson

        // 닉네임
        const nickname = document.getElementById('nickname')
        nickname.value = userInfo.nickname

        // 자기소개
        const bio = document.getElementById('bio');
        bio.value = userInfo.bio

        // 성별
        const gender = document.getElementById('gender');
        gender.value = userInfo.gender

        // const profileImage = document.getElementById('profileImage');
        // profileImage.value = userInfo.value
    })
}

function userInfoEdit() {
    console.log('프로필 수정 버튼')
    const user_id = payloadParse.user_id
    const nickname = document.getElementById('nickname').value;
    const password = document.getElementById('password').value;
    const passwordCheck = document.getElementById('passwordCheck').value;
    const gender = document.getElementById('gender').value;
    const bio = document.getElementById('bio').value;
    if (password == passwordCheck) {
        const data = new FormData();

        if (nickname) {
            data.append("nickname", nickname)
        }
        if (password) {
            data.append("password", password)
        }
        if (gender) {
            data.append("gender", gender)
        }
        if (bio) {
            data.append("bio", bio)
        }

        userInfoEditAPI(data).then(({ response, responseJson }) => {
            alert(responseJson.message)
            window.location.href = `${frontendBaseURL}/templates/my-page.html?user_id=${user_id}`
        })
    } else {
        alert('비밀번호가 일치하지 않습니다')
    }
}
document.getElementById("userInfoEditButton").addEventListener("click", userInfoEdit);