console.log('api 연결')

export const frontendBaseURL = "http://127.0.0.1:5500";
const backendBaseURL = "http://127.0.0.1:8000/api";

export const payload = localStorage.getItem("payload")
const payloadParse = JSON.parse(payload);
const token = localStorage.getItem("access");

// 회원가입 API
export async function signUpAPI(data) {
    const response = await fetch(`${backendBaseURL}/users/signup/`, {
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(data)
    });
    console.log(response, 'signUpAPI');
    const responseJson = await response.json();
    return { response, responseJson };
}

// 로그인 API
export async function signInAPI(data) {
    const response = await fetch(`${backendBaseURL}/users/signin/`, {
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(data)
    });
    console.log(response, 'signInAPI');
    const responseJson = await response.json();
    return { response, responseJson };
}