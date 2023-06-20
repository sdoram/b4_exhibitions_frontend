console.log('my-page 연결')

import { myPageAPI, payloadParse, payload, frontendBaseURL, withdrawalAPI, exhibitionLikeAPI } from "./api.js";


window.onload = function loadUserInfo() {
    // url 객체 생성 후 user_id 값 추출 
    const user_id = new URLSearchParams(window.location.search).get("user_id")
    myPageAPI(user_id).then(({ response, responseJson }) => {
        console.log(response, responseJson)
        const userInfo = responseJson

        // 프로필 이미지
        const profileImg = document.getElementById("profileImg");
        if (userInfo.profile_image) {
            profileImg.setAttribute("src", decodeURIComponent(userInfo.profile_image.split("media/")[1]));
        }

        // 유저아이디
        const nickname = document.getElementById("nickname");
        nickname.innerText = userInfo.nickname

        // 함께한 시간
        const sinceToGether = document.getElementById("sinceToGether")
        sinceToGether.innerText = `${userInfo.since_together}일`

        // 자기소개
        const bio = document.getElementById("bio");
        bio.innerText = userInfo.bio

        if (payload) {
            if (user_id == payloadParse.user_id) {
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
                    console.log(exhibition.image)
                    // 이미지 사이즈가 클 경우 화면에 맞게 줄여주는 css 수정 필요
                    exhibitionImg.setAttribute("class", "card-img-top");
                    // 이미지를 못찾을 경우 대체 이미지 
                    exhibitionImg.setAttribute("onerror", "this.src='../static/img/default-img.jpg'")
                    if (exhibition.image) {
                        if (exhibition.image.includes('https:')) {
                            exhibitionImg.setAttribute("src", exhibition.image);
                        } else {
                            // 대체 url 코드로 인코딩된 url 디코딩 하기    
                            exhibitionImg.setAttribute("src", decodeURIComponent(exhibition.image.split("media/")[1]));
                        }
                    } else {
                        exhibitionImg.setAttribute("src", "static/img/default-img.jpg")
                    }
                    exhibitionImgBox.appendChild(exhibitionImg)

                    // 전시회 정보 박스 
                    const exhibitionInfoBox = document.createElement("div");
                    exhibitionInfoBox.setAttribute("class", "exhibition-info-box");
                    exhibitionSet.appendChild(exhibitionInfoBox)

                    // 전시회 제목
                    const exhibitionTitle = document.createElement("span");
                    exhibitionTitle.setAttribute("class", "exhibition-title");
                    exhibitionTitle.innerText = exhibition.info_name
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

            }
        }
    })
}

function profileEdit(user_id) {
    console.log('프로필 수정', user_id)
    window.location.href = `${frontendBaseURL}/templates/updated-user.html?user_id=${user_id}`
}

function withdrawal(user_id) {
    console.log('회원 탈퇴', user_id)
    withdrawalAPI(user_id).then(({ response, responseJson }) => {
        if (response.status == 200) {
            localStorage.removeItem("access")
            localStorage.removeItem("refresh")
            localStorage.removeItem("payload")
            location.reload();
        }
    })
}


function heart(exhibition_id) {
    let fullHeart = false;
    exhibitionLikeAPI(exhibition_id).then(({ response, responseJson }) => {
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


function exhibitionDetail(exhibition_id) {
    window.location.href = `${frontendBaseURL}/templates/exhibition-detail.html?exhibition_id=${exhibition_id}`
}

function exhibitionReserve(link) {
    window.open(link)
}
