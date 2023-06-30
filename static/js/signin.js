import { postSignInAPI, googleAPI, frontendBaseURL, payload } from "./api.js";

// 로그인 확인
function checkSignIn() {
    if (payload) {
        window.location.replace(`${frontendBaseURL}/`)
    }
}
checkSignIn()

// 로컬 스토리지에 jwt 토큰 저장하는 함수
function setLocalStorage(responseJson) {
    localStorage.setItem("access", responseJson.access);
    localStorage.setItem("refresh", responseJson.refresh);
    const base64Url = responseJson.access.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    // payload로 저장하기 
    localStorage.setItem("payload", jsonPayload);
}

// 일반 로그인
function handleSignIn() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // API 전달용 data
    const data = {
        "email": email,
        "password": password
    }
    // 백엔드 통신 함수 
    postSignInAPI(data).then(({ response, responseJson }) => {
        if (response.status == 200) {
            setLocalStorage(responseJson);
            alert('로그인 성공');
            window.history.go(-1)
        } else {
            alert(responseJson.email && "이메일을 입력해주세요"
                || responseJson.password && "비밀번호를 입력해주세요" ||
                responseJson.detail && "회원 정보를 찾을 수 없습니다", window.location.reload())
        }
    })
}

// 소셜로그인 시 url에서 access_token 얻기
if (payload) {
} else if (window.location.hash) {
    let hashParams = new URLSearchParams(window.location.hash.substr(1));
    let google_token = hashParams.get("access_token");
    // 백엔드 통신 함수 
    googleAPI(google_token).then(({ response, responseJson }) => {
        if (response.status == 200) {
            setLocalStorage(responseJson)
            alert('로그인 성공');
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

document.getElementById("email").addEventListener("keydown", function (e) {
    if (e.code === 'Enter') {
        document.getElementById("password").focus()
    }
})

// 일반 로그인 function 실행
document.getElementById("signInButton").addEventListener("click", handleSignIn);
document.getElementById("password").addEventListener("keydown", function (e) {
    if (e.code === 'Enter') {
        handleSignIn()
    }
})
// 구글 로그인 function 실행
document.getElementById("googleSigninBtn").addEventListener("click", googleSignin);