console.log('api 연결')

export const frontendBaseURL = "http://127.0.0.1:5500";
export const backendBaseURL = "http://127.0.0.1:8000/api";

export const payload = localStorage.getItem("payload")
export const payloadParse = JSON.parse(payload);
const token = localStorage.getItem("access");

// 회원가입 API
export async function postSignUpAPI(data) {
    const response = await fetch(`${backendBaseURL}/users/signup/`, {
        method: 'POST',
        body: data
    });
    console.log(response, 'signUpAPI');
    const responseJson = await response.json();
    return { response, responseJson };
}

// 로그인 API
export async function postSignInAPI(data) {
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

// 회원 정보 불러오기 API
export async function getUserInfoAPI(user_id) {
    const response = await fetch(`${backendBaseURL}/users/${user_id}`)
    const responseJson = await response.json();
    console.log(response, responseJson);
    return { response, responseJson };
}

// 회원 정보 수정 API
export async function patchUserInfoAPI(data) {
    const response = await fetch(`${backendBaseURL}/users/`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` },
        body: data
    })
    const responseJson = await response.json();
    console.log(response, responseJson)
    return { response, responseJson }
}

// 회원 탈퇴 API
export async function deleteUserInfoAPI(user_id) {
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

// 메인 페이지 전시회 전체 조회 API
export async function getExhibitionsAPI() {
    let response
    const URLParams = new URL(location.href).searchParams;
    const page = URLParams.get('page')
    const category = URLParams.get('category')
    const search = URLParams.get('search')
    if (page != null) {
        // 페이지 정보가 있는 경우
        if (category) {
            response = await fetch(`${backendBaseURL}/exhibitions/?category=${category}&page=${page}`)
        } else if (search) {
            response = await fetch(`${backendBaseURL}/exhibitions/search/?search=${search}&page=${page}`)
        } else {
            response = await fetch(`${backendBaseURL}/exhibitions/?page=${page}`)
        }
    } else {
        // 페이지 정보가 없는 경우 
        if (category) {
            response = await fetch(`${backendBaseURL}/exhibitions/?category=${category}`)
        } else if (search) {
            response = await fetch(`${backendBaseURL}/exhibitions/search/?search=${search}`)
        } else {
            response = await fetch(`${backendBaseURL}/exhibitions/`)
        }
    }
    const responseJson = await response.json();
    return { response, responseJson };
}

// 전시회 상세 페이지 API
export async function getExhibitionAPI(exhibition_id) {
    const response = await fetch(`${backendBaseURL}/exhibitions/${exhibition_id}`)
    const responseJson = await response.json();
    return { response, responseJson };
}

// 전시회 좋아요 API
export async function postExhibitionLikeAPI(exhibition_id) {
    const response = await fetch(`${backendBaseURL}/exhibitions/${exhibition_id}/like/`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
    })
    const responseJson = await response.json();
    console.log(response, responseJson)

    return { response, responseJson };
}

// 전시회 작성
export async function postExhibitionAPI(data) {
    const response = await fetch(`${backendBaseURL}/exhibitions/`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: data
    })
    const responseJson = await response.json();
    console.log(response, responseJson)
    return { response, responseJson }
}

// 전시회 수정
export async function putExhibitionAPI(exhibition_id, data) {
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
export async function deleteExhibitionAPI(exhibition_id) {
    const response = await fetch(`${backendBaseURL}/exhibitions/${exhibition_id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
    })
    console.log(response)
    return response
}

// 리뷰 조회 API
export async function getReviewAPI(exhibition_id) {
    // const response = await fetch(`${backendBaseURL}/reviews/${exhibition_id}/`, { method: 'GET' })
    const response = await fetch(`${backendBaseURL}/exhibitions/${exhibition_id}?select=reviews`, { method: 'GET' })
    const responseJson = await response.json();
    return { response, responseJson }
}

// 리뷰 작성 API
export async function postReviewAPI(exhibition_id, data) {
    const response = await fetch(`${backendBaseURL}/reviews/${exhibition_id}/`, {
        method: 'POST',
        headers: { "Authorization": `Bearer ${token}` },
        body: data
    })
    const responseJson = await response.json();
    return { response, responseJson }
}

// 리뷰 수정 API
export async function putReviewAPI(review_id, data) {
    const response = await fetch(`${backendBaseURL}/reviews/detail/${review_id}/`, {
        method: 'PUT',
        headers: { "Authorization": `Bearer ${token}` },
        body: data
    })
    const responseJson = await response.json();
    return { response, responseJson }
}

// 리뷰 삭제 API
export async function deleteReviewAPI(review_id) {
    const response = await fetch(`${backendBaseURL}/reviews/detail/${review_id}/`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${token}` },
    })
    return response
}

// 동행 조회 API
export async function getAccompanyAPI(exhibition_id) {
    // const response = await fetch(`${backendBaseURL}/accompanies/${exhibition_id}/`, { method: 'GET' })
    const response = await fetch(`${backendBaseURL}/exhibitions/${exhibition_id}?select=accompanies`, { method: 'GET' })
    const responseJson = await response.json();
    return { response, responseJson }
}

// 동행 작성 API
export async function postAccompanyAPI(exhibition_id, data) {
    const response = await fetch(`${backendBaseURL}/accompanies/${exhibition_id}/`, {
        method: 'POST',
        headers: { "Authorization": `Bearer ${token}` },
        body: data
    })
    const responseJson = await response.json();
    return { response, responseJson }
}