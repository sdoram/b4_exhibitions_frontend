import { getUserInfoAPI, payloadParse, payload, frontendBaseURL, deleteUserInfoAPI, postExhibitionLikeAPI, backendBaseURL, postSignInAPI } from "./api.js";


window.onload = function loadUserInfo() {
    // url 객체 생성 후 user_id 값 추출 
    const user_id = new URLSearchParams(window.location.search).get("user_id")
    getUserInfoAPI(user_id).then(({ response, responseJson }) => {
        if (response.status == 404) {
            window.location.replace("/templates/page_not_found.html")
        }
        const userInfo = responseJson

        // 프로필 이미지
        const profileImg = document.getElementById("profileImg");
        if (userInfo.profile_image) {
            if (userInfo.profile_image.includes('https%3A')) {
                // 대체 url 코드로 인코딩된 url 디코딩 하기    
                profileImg.setAttribute("src", `https://${decodeURIComponent(userInfo.profile_image.split("https%3A")[1])}`)
            }
            else if (userInfo.profile_image.includes('https:')) {
                profileImg.setAttribute("src", userInfo.profile_image)
            } else {
                profileImg.setAttribute("src", `${backendBaseURL.split('/api')[0]}${userInfo.profile_image}`)
            }
        }

        // 유저아이디
        const nickname = document.getElementById("nickname");
        nickname.innerText = userInfo.nickname

        // 함께한 시간
        const sinceTogether = document.getElementById("sinceTogether")
        sinceTogether.innerText = `${userInfo.since_together}일`

        // 자기소개
        const bio = document.getElementById("bio");
        bio.innerText = userInfo.bio

        if (payload) {
            if (user_id == payloadParse.user_id && payloadParse.is_admin == false) {
                const buttonPart = document.getElementById("buttonPart")

                const profileEditButton = document.createElement("button")
                profileEditButton.setAttribute("id", `profileEdit${payloadParse.user_id}`)
                profileEditButton.addEventListener("click", function () {
                    profileEdit(this.id.split('profileEdit')[1])
                })
                profileEditButton.innerText = "회원정보 수정하기"


                const withdrawalButton = document.createElement("button")
                withdrawalButton.setAttribute("id", `withdrawal${payloadParse.user_id}`)
                withdrawalButton.innerText = "회원 탈퇴하기"
                withdrawalButton.addEventListener("click", function () {
                    withdrawal(this.id.split('withdrawal')[1])
                })

                buttonPart.appendChild(profileEditButton)
                buttonPart.appendChild(withdrawalButton)
            }
        }
        const exhibitionsDATA = userInfo.exhibition_likes

        const exhibitionList = document.getElementById("exhibitionList")
        exhibitionsDATA.forEach(exhibition => {
            const exhibitionSet = document.createElement("div");
            exhibitionSet.setAttribute("class", "exhibition-set");

            const exhibitionImgBox = document.createElement("div");
            exhibitionImgBox.setAttribute("class", "exhibition-img-box")
            exhibitionSet.appendChild(exhibitionImgBox)

            // 전시회 이미지
            const exhibitionImg = document.createElement("img");
            exhibitionImg.setAttribute("class", "card-img-top");
            // 이미지를 못찾을 경우 대체 이미지 
            exhibitionImg.setAttribute("onerror", "src='/static/img/default-img.jpg'")
            if (exhibition.image) {
                if (exhibition.image.includes('https%3A')) {
                    // 대체 url 코드로 인코딩된 url 디코딩 하기    
                    exhibitionImg.setAttribute("src", `https://${decodeURIComponent(exhibition.image.split("https%3A")[1])}`)
                }
                else if (exhibition.image.includes('https:')) {
                    exhibitionImg.setAttribute("src", exhibition.image)
                } else {
                    exhibitionImg.setAttribute("src", `${backendBaseURL.split('/api')[0]}${exhibition.image}`)
                    console.log(`${backendBaseURL.split('/api')[0]}${exhibition.image}`)
                }
            }

            exhibitionImgBox.appendChild(exhibitionImg)

            // 전시회 정보 박스 
            const exhibitionInfoBox = document.createElement("div");
            exhibitionInfoBox.setAttribute("class", "exhibition-info-box");
            exhibitionSet.appendChild(exhibitionInfoBox)

            // 전시회 제목
            const exhibitionTitle = document.createElement("span");
            exhibitionTitle.setAttribute("class", "exhibition-title");
            exhibitionTitle.innerHTML = exhibition.info_name
            exhibitionInfoBox.appendChild(exhibitionTitle);

            // 전시회 기간
            const exhibitionPeriod = document.createElement("span");
            exhibitionPeriod.setAttribute("class", "exhibition-period")
            exhibitionPeriod.innerText = `${exhibition.start_date} ~ ${exhibition.end_date}`
            exhibitionInfoBox.appendChild(exhibitionPeriod)

            // 전시회 좋아요 
            const exhibitionHeartSet = document.createElement("div")
            exhibitionHeartSet.setAttribute("class", "heart-set")
            exhibitionInfoBox.appendChild(exhibitionHeartSet)

            const exhibitionHeart = document.createElement("div")
            exhibitionHeart.setAttribute("class", "heart")
            exhibitionHeart.setAttribute("id", exhibition.id)
            exhibitionHeart.addEventListener("click", function () {
                heart(exhibition.id)
            })
            exhibitionHeartSet.appendChild(exhibitionHeart)

            // 전시회 좋아요 개수
            const exhibitionHeartNum = document.createElement("span")
            exhibitionHeartNum.setAttribute("class", "heart-num")
            exhibitionHeartNum.setAttribute("id", `heartNum${exhibition.id}`)
            exhibitionHeartNum.innerText = exhibition.likes
            exhibitionHeartSet.appendChild(exhibitionHeartNum)

            // 좋아요 여부에 따른 하트색 세팅
            if (payload) {
                exhibitionHeart.setAttribute("style", "cursor: pointer;")
                getUserInfoAPI(payloadParse.user_id).then(({ responseJson }) => {
                    responseJson.exhibition_likes.forEach((obj) => {
                        if (exhibition.id == obj.id) {
                            const heartElement = document.getElementById(exhibition.id);
                            heartElement.style.backgroundImage = 'url("../static/img/filled-heart.png")';
                        }
                    })
                })
            }

            // 상세 & 예약 박스
            const exhibitionSignSet = document.createElement('div')
            exhibitionSignSet.setAttribute("class", "sign-set")
            exhibitionInfoBox.appendChild(exhibitionSignSet)

            const exhibitionDetailButton = document.createElement("button")
            exhibitionDetailButton.setAttribute("class", "detail-button")
            exhibitionDetailButton.addEventListener("click", function () {
                exhibitionDetail(exhibition.id)
            })
            exhibitionDetailButton.innerText = '전시상세'
            exhibitionSignSet.appendChild(exhibitionDetailButton)

            const exhibitionReserveButton = document.createElement("button")
            exhibitionReserveButton.setAttribute("class", "reserve-button")
            exhibitionReserveButton.addEventListener("click", function () {
                exhibitionReserve(exhibition.direct_url)
            })
            exhibitionReserveButton.innerText = '예약하기'
            exhibitionSignSet.appendChild(exhibitionReserveButton)

            exhibitionList.appendChild(exhibitionSet)
        })
    })
}

function profileEdit(user_id) {
    // 일반 로그인만 비밀번호 확인하기 
    if (payloadParse.signin_type == 'normal') {
        let data = {
            "email": payloadParse.email,
            "password": prompt('비밀번호를 입력해주세요')
        }
        postSignInAPI(data).then(({ response, responseJson }) => {
            console.log(response.status)
            if (response.status == 200) {
                window.location.href = `${frontendBaseURL}/templates/updated-user.html?user_id=${user_id}`
            } else {
                alert('비밀번호가 일치하지 않습니다')
            }
        })
    } else {
        window.location.href = `${frontendBaseURL}/templates/updated-user.html?user_id=${user_id}`
    }
}

function withdrawal(user_id) {
    if (confirm("정말 탈퇴하시겠습니까?")) {
        deleteUserInfoAPI(user_id).then(({ response, responseJson }) => {
            if (response.status == 200) {
                alert("탈퇴가 완료됐습니다.")
                localStorage.removeItem("access")
                localStorage.removeItem("refresh")
                localStorage.removeItem("payload")
                location.reload();
            }
        })
    }
}


function heart(exhibition_id) {
    let fullHeart = false;
    if (payload) {
        postExhibitionLikeAPI(exhibition_id).then(({ response, responseJson }) => {
            const heartElement = document.getElementById(exhibition_id);
            const heartNum = document.getElementById(`heartNum${exhibition_id}`)
            if (response.status == 201) {
                heartElement.style.backgroundImage = 'url("../static/img/filled-heart.png")';
                heartNum.innerText = responseJson.likes
            } else {
                heartElement.style.backgroundImage = 'url("../static/img/empty-heart.png")';
                heartNum.innerText = responseJson.likes
            }
            fullHeart = !fullHeart;
        })
    }
}


function exhibitionDetail(exhibition_id) {
    window.location.href = `${frontendBaseURL}/templates/exhibition-detail.html?exhibition_id=${exhibition_id}`
}

function exhibitionReserve(link) {
    window.open(link)
}
