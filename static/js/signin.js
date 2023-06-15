console.log('signin 연결')
import { signInAPI, googleAPI, frontendBaseURL, payload } from "./api.js";

// 로그인 확인
function checkSignIn() {
    console.log('checkSignIn 연결 확인')
    if (payload) {
        window.location.replace(`${frontendBaseURL}/`)
    }
}
checkSignIn()

// 일반 로그인
function handleSignIn() {
    console.log('로그인 버튼')
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // API 전달용 data
    const data = {
        "email": email,
        "password": password
    }
    // 백엔드 통신 함수 
    signInAPI(data).then(({ response, responseJson }) => {
        console.log(responseJson);
        // 로컬 스토리지에 jwt 토큰 저장하기
        localStorage.setItem("access", responseJson.access);
        localStorage.setItem("refresh", responseJson.refresh);
        const base64Url = responseJson.access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        // payload로 저장하기 
        localStorage.setItem("payload", jsonPayload);
        if (response.status == 200) {
            alert('로그인 성공');
            window.location.replace(`${frontendBaseURL}/`);
        } else {
            alert(response.status);
        }
    })
}
// 로그인 function 실행
document.getElementById("signInButton").addEventListener("click", handleSignIn);

// 구글 로그인
async function googleSignin() {
    googleAPI().then((responseJson) => {
        const google_id = responseJson
        const scope = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
        const param = `scope=${scope}&include_granted_scopes=true&response_type=token&state=pass-through value&prompt=consent&client_id=${google_id}&redirect_uri=${frontendBaseURL}`
        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${param}`
    })    
}
// 구글 로그인 function 실행
document.getElementById("googleSigninBtn").addEventListener("click", googleSignin);