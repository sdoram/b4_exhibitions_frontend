console.log('api 연결')

export const frontendBaseURL = "http://127.0.0.1:5500";
export const backendBaseURL = "http://127.0.0.1:8000/api";

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

// 구글 로그인 API
export async function googleAPI(google_token) {
    if (google_token == undefined) {
        const response = await fetch(`${backendBaseURL}/users/google/`, { method: 'GET' })
        const responseJson = await response.json();
        return responseJson;
    } else {
        const response = await fetch(`${backendBaseURL}/users/google/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ access_token: google_token })
        });
        const responseJson = await response.json();
        return { response, responseJson };
    }
}

// 메인 페이지 전시회 전체 조회 API
export async function getExhibitionsAPI() {
    const response = await fetch(`${backendBaseURL}/exhibitions/`, {
    })
    const responseJson = await response.json();
    console.log(responseJson)
    return { response, responseJson };
}

// 전시회 상세 페이지 API
export async function getExhibitionAPI(exhibition_id) {
    const response = await fetch(`${backendBaseURL}/exhibitions/${exhibition_id}`)
    const responseJson = await response.json();
    return { response, responseJson };
}