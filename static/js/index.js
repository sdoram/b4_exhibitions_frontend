console.log('index 연결')
import { googleAPI, frontendBaseURL, payload } from "./api.js";

// 로컬 스토리지에 jwt 토큰 저장하기
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

// url에서 access_token 얻기
if (payload) {
} else if (window.location.hash) {
    let hashParams = new URLSearchParams(window.location.hash.substr(1));
    let google_token = hashParams.get("access_token");
    // 백엔드 통신 함수 
    googleAPI(google_token).then(({ response, responseJson }) => {
        if (response.status == 200) {
            setLocalStorage(responseJson)
            alert('로그인 성공');
            window.location.replace(`${frontendBaseURL}/`);
        } else {
            alert(responseJson.error);
            window.location.replace(`${frontendBaseURL}/templates/signin.html`);
        }
    })
}    