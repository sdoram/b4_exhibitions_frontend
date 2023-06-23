console.log('updated-user 연결')

import { getUserInfoAPI, payloadParse, frontendBaseURL, patchUserInfoAPI } from "./api.js";

console.log()
window.onload = function () {
    const user_id = new URLSearchParams(window.location.search).get("user_id")

    getUserInfoAPI(user_id).then(({ response, responseJson }) => {
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
    const profileImage = document.getElementById('profileImage').files[0]
    const bio = document.getElementById('bio').value;
    if (!password | !passwordCheck | password != passwordCheck) {
        alert('올바른 비밀번호를 입력해주세요')
    } else {
        const data = new FormData();
        data.append("nickname", nickname)
        data.append("password", password)
        data.append("gender", gender)
        if (profileImage) {
            data.append("profile_image", profileImage)
        }
        data.append("bio", bio)


        patchUserInfoAPI(data).then(({ response, responseJson }) => {
            alert(responseJson.message)
            window.location.href = `${frontendBaseURL}/templates/my-page.html?user_id=${user_id}`
        })
    }
}
document.getElementById("userInfoEditButton").addEventListener("click", userInfoEdit);