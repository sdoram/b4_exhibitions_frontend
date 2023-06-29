import { postSignUpAPI, frontendBaseURL, payload } from "./api.js";

function handleSignUp() {
    const email = document.getElementById("email").value;
    const nickname = document.getElementById('nickname').value;
    const password = document.getElementById('password').value;
    const passwordCheck = document.getElementById('passwordCheck').value;
    const gender = document.getElementById('gender').value;
    const profileImage = document.getElementById('profileImage').files[0];
    const bio = document.getElementById('bio').value;
    // API 전달용 data
    if (password == passwordCheck) {
        const data = new FormData();
        data.append("email", email)
        data.append("nickname", nickname)
        data.append("password", password)
        data.append("password_check", passwordCheck)
        data.append("gender", gender)
        data.append("profile_image", profileImage || '')
        data.append("bio", bio || '')

        postSignUpAPI(data).then(({ response, responseJson }) => {
            if (response.status == 201) {
                alert(responseJson.message);
                window.location.replace(`${frontendBaseURL}/templates/signin.html`);
            } else {
                alert(responseJson.email && "이미 가입된 이메일 입니다"
                    || responseJson.nickname && "이미 존재하는 닉네임 입니다")
            }
        });
    } else {
        alert('비밀번호가 일치하지 않습니다')
    }

}

// 회원가입 function 실행
document.getElementById("signUpButton").addEventListener("click", handleSignUp);

// 로그인 확인
function checkSignIn() {
    if (payload) {
        window.location.replace(`${frontendBaseURL}/`)
    }
}
checkSignIn()