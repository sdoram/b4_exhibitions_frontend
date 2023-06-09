console.log('api 연결')

const frontendBaseUrl = "http://127.0.0.1:5500"
const backendBaseUrl = "http://127.0.0.1:8000/api"

const payload = localStorage.getItem("payload");
const payloadParse = JSON.parse(payload);
const token = localStorage.getItem("access");

function checkSignIn() {
    console.log('checkSignIn 연결 확인')
    if (payload) {
        window.location.replace(`${frontendBaseUrl}/`)
    }
}