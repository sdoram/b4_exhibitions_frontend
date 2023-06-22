console.log('api 연결')

export const frontendBaseURL = "http://127.0.0.1:5500";
export const backendBaseURL = "http://127.0.0.1:8000/api";

export const payload = localStorage.getItem("payload")
export const payloadParse = JSON.parse(payload);
const token = localStorage.getItem("access");

// 회원가입 API
export async function signUpAPI(data) {
    const response = await fetch(`${backendBaseURL}/users/signup/`, {
        method: 'POST',
        body: data
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

    const URLParams = new URL(location.href).searchParams;
    const page = URLParams.get('page')
    const category = URLParams.get('category')
    if (page != null) {
        // 페이지 정보가 있는 경우
        if (category) {
            const response = await fetch(`${backendBaseURL}/exhibitions/?category=${category}&page=${page}`)
            const responseJson = await response.json();
            return { response, responseJson };
        } else {
            const response = await fetch(`${backendBaseURL}/exhibitions/?page=${page}`)
            const responseJson = await response.json();
            return { response, responseJson };
        }
    } else {
        // 페이지 정보가 없는 경우 
        if (category) {
            const response = await fetch(`${backendBaseURL}/exhibitions/?category=${category}`)
            const responseJson = await response.json();
            return { response, responseJson };
        }
        else {
            const response = await fetch(`${backendBaseURL}/exhibitions/`)
            const responseJson = await response.json();
            return { response, responseJson };
        }
    }
}
// 전시회 상세 페이지 API
export async function getExhibitionAPI(exhibition_id) {
    const response = await fetch(`${backendBaseURL}/exhibitions/${exhibition_id}`)
    const responseJson = await response.json();
    return { response, responseJson };
}

// 전시회 좋아요 API
export async function exhibitionLikeAPI(exhibition_id) {
    const response = await fetch(`${backendBaseURL}/exhibitions/${exhibition_id}/like/`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
    })
    const responseJson = await response.json();
    console.log(response, responseJson)

    return { response, responseJson };
}

// 마이 페이지 API
export async function myPageAPI(user_id) {
    const response = await fetch(`${backendBaseURL}/users/${user_id}`)
    const responseJson = await response.json();
    console.log(response, responseJson);
    return { response, responseJson };
}

// 회원 탈퇴 API
export async function withdrawalAPI(user_id) {
    if (user_id == payloadParse.user_id) {
        const response = await fetch(`${backendBaseURL}/users/`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        })
        const responseJson = await response.json();
        console.log(response, responseJson)
        return { response, responseJson }
    } else {
        return alert('본인이 아닙니다')
    }
}

export async function userInfoEditAPI(data) {
    const response = await fetch(`${backendBaseURL}/users/`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` },
        body: data
    })
    const responseJson = await response.json();
    console.log(response, responseJson)
    return { response, responseJson }
}

// 전시회 작성
export async function exhibitionPostingAPI(data) {
    const response = await fetch(`${backendBaseURL}/exhibitions/`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: data
    })
    const responseJson = await response.json();
    console.log(response, responseJson)
    return { response, responseJson }
}


// 리뷰 조회 API
export async function getReviewAPI(exhibition_id) {
    // const response = await fetch(`${backendBaseURL}/reviews/${exhibition_id}/`, { method: 'GET' })
    const response = await fetch(`${backendBaseURL}/exhibitions/${exhibition_id}?select=reviews`, { method: 'GET' })
    const responseJson = await response.json();
    return { response, responseJson }

// 전시회 수정
export async function exhibitionPutAPI(exhibition_id, data) {
    const response = await fetch(`${backendBaseURL}/exhibitions/${exhibition_id}/`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` },
        body: data
    })
    const responseJson = await response.json();
    console.log(response, responseJson)
    return { response, responseJson }
}

// 전시회 삭제 
export async function exhibitionDeleteAPI(exhibition_id) {
    const response = await fetch(`${backendBaseURL}/exhibitions/${exhibition_id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
    })
    console.log(response)
    return response
}