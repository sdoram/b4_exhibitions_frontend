import { frontendBaseURL, payloadParse, getUserInfoAPI, patchUserInfoAPI } from "./api.js";

window.onload = function () {
    const user_id = new URLSearchParams(window.location.search).get("user_id")
    function checkNotRequestUser() {
        if (payloadParse.user_id != user_id) {
            alert("본인의 정보만 수정 가능합니다.")
            window.location.replace(`${frontendBaseURL}/`)
        }
    }
    checkNotRequestUser()

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

        if (payloadParse.signin_type != 'normal') {
            document.getElementById('password').style.display = "none";
            document.getElementById('passwordCheck').style.display = "none";
        }
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
function socialUserInfoEdit() {
    const user_id = payloadParse.user_id
    const nickname = document.getElementById('nickname').value;
    const gender = document.getElementById('gender').value;
    const profileImage = document.getElementById('profileImage').files[0]
    const bio = document.getElementById('bio').value;

    const data = new FormData();
    data.append("nickname", nickname)
    data.append("gender", gender || '밝히고 싶지 않음')
    if (profileImage) {
        data.append("profile_image", profileImage)
    }
    data.append("bio", bio)

    patchUserInfoAPI(data).then(({ response, responseJson }) => {
        alert(responseJson.message)
        window.location.href = `${frontendBaseURL}/templates/my-page.html?user_id=${user_id}`
    })
}

if (payloadParse.signin_type == 'normal') {
    document.getElementById("userInfoEditButton").addEventListener("click", userInfoEdit);
} else {
    document.getElementById("userInfoEditButton").addEventListener("click", socialUserInfoEdit);
}