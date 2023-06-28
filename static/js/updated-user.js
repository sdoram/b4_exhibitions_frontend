import { getUserInfoAPI, payloadParse, frontendBaseURL, patchUserInfoAPI } from "./api.js";

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
    const user_id = payloadParse.user_id
    const nickname = document.getElementById('nickname').value;
    const password = document.getElementById('password').value;
    const passwordCheck = document.getElementById('passwordCheck').value;
    const gender = document.getElementById('gender').value;
    const profileImage = document.getElementById('profileImage').files[0]
    const bio = document.getElementById('bio').value;
    if (password != passwordCheck) {
        alert('비밀번호가 일치하지 않습니다')
    } else {
        const data = new FormData();
        data.append("nickname", nickname)
        if (password) {
            data.append("password", password)
        }
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