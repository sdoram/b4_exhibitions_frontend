console.log('signup 연결')
import { signUpAPI, frontendBaseURL, payload } from "./api.js";

function handleSignUp() {
    console.log('회원가입 버튼')
    const email = document.getElementById("email").value;
    const nickname = document.getElementById("nickname").value;
    const password = document.getElementById("password").value;
    const passwordCheck = document.getElementById("passwordCheck").value;
    const gender = document.getElementById("gender").value;
    // API 전달용 data
    const data = {
        "email": email,
        "nickname": nickname,
        "password": password,
        "password_check": passwordCheck,
        "gender": gender
    }
    // 백엔드 통신 함수 
    signUpAPI(data).then(({ response, responseJson }) => {
        if (response.status == 201) {
            alert(responseJson.message);
            window.location.replace(`${frontendBaseURL}/templates/signin.html`);
        } else {
            alert(responseJson.message);
            console.log(response.status);
        }
    });
}
// 회원가입 function 실행
document.getElementById("signUpButton").addEventListener("click", handleSignUp);

// 로그인 확인
function checkSignIn() {
    console.log('checkSignIn 연결 확인')
    if (payload) {
        window.location.replace(`${frontendBaseURL}/`)
    }
}
checkSignIn()