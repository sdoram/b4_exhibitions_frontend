import { frontendBaseURL, payload, postSignUpAPI, googleAPI } from "./api.js";

// 로그인 확인
function checkSignIn() {
    if (payload) {
        window.location.replace(`${frontendBaseURL}/`)
    }
}

checkSignIn()

// 일반 회원가입
function handleSignUp() {
    const email = document.getElementById("email").value;
    const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
    const nickname = document.getElementById('nickname').value;
    const password = document.getElementById('password').value;
    const passwordCheck = document.getElementById('passwordCheck').value;
    const gender = document.getElementById('gender').value;
    const profileImage = document.getElementById('profileImage').files[0];
    const bio = document.getElementById('bio').value;
    // API 전달용 data
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
            alert(!email && '이메일을 입력해주세요' ||
                !emailRegex.test(email) && '이메일 형식을 지켜주세요' ||
                !password && '비밀번호를 입력해주세요' ||
                !passwordCheck && '비밀번호 재확인을 입력해주세요' ||
                !nickname && '닉네임을 입력해주세요' ||
                password != passwordCheck && '비밀번호가 일치하지 않습니다' ||
                responseJson.email && "이미 가입된 이메일 입니다" ||
                responseJson.nickname && "이미 존재하는 닉네임 입니다")
        }
    });
}

// 회원가입 function 실행
document.getElementById("signUpButton").addEventListener("click", handleSignUp);

// 구글로그인 시 url에서 access_token 얻기
if (payload) {
} else if (window.location.hash) {
    let hashParams = new URLSearchParams(window.location.hash.substr(1));
    let google_token = hashParams.get("access_token");
    // 백엔드 통신 함수 
    googleAPI(google_token).then(({ response, responseJson }) => {
        if (response.status == 200) {
            setLocalStorage(responseJson)
            alert('구글 계정으로 로그인 되었습니다.');
            window.history.go(-3)
        } else {
            alert(responseJson.message);
            window.location.replace(`${frontendBaseURL}/templates/signin.html`);
        }
    })
}

// 구글 로그인
async function googleSignin() {
    googleAPI().then((responseJson) => {
        const google_id = responseJson
        const scope = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
        const param = `scope=${scope}&include_granted_scopes=true&response_type=token&state=pass-through value&prompt=consent&client_id=${google_id}&redirect_uri=${frontendBaseURL}/templates/signin.html`
        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${param}`
    })
}

// 구글 로그인 function 실행
document.getElementById("googleSignupBtn").addEventListener("click", googleSignin);