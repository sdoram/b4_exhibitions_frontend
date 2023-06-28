import { getExhibitionAPI, postExhibitionLikeAPI, payload, payloadParse, getUserInfoAPI, frontendBaseURL } from "./api.js";
import { getReview } from "./review.js";
import { getAccompany } from "./accompany.js";
import { isEditingReview } from "./review-editing.js";
import { isEditingAccompany } from "./accompany-editing.js";


window.onload = function loadExhibition() {
    // url 객체 생성 후 exhibition_id 값 추출 
    const exhibition_id = new URLSearchParams(window.location.search).get("exhibition_id")
    getExhibitionAPI(exhibition_id).then(({ response, responseJson }) => {
        if (response.status == 404) {
            window.location.replace("/templates/page_not_found.html")
        }
        const exhibitionDATA = responseJson

        // 전시회 이미지
        const exhibitionImg = document.getElementById("posterImg")
        exhibitionImg.setAttribute("onerror", "src='/static/img/default-img.jpg'")
        if (exhibitionDATA.image) {
            if (exhibitionDATA.image.includes('https%3A')) {
                // 대체 url 코드로 인코딩된 url 디코딩 하기    
                exhibitionImg.setAttribute("src", `https://${decodeURIComponent(exhibitionDATA.image.split("https%3A")[1])}`)
            }
            else {
                exhibitionImg.setAttribute("src", exhibitionDATA.image)
            }
        }

        // 전시회 좋아요 
        const exhibitionHeart = document.getElementById("heart")
        exhibitionHeart.addEventListener("click", function () {
            heart(exhibitionDATA.id)
        })

        // 전시회 좋아요 개수
        const exhibitionHeartNum = document.getElementById("heartNum")
        exhibitionHeartNum.innerText = exhibitionDATA.likes

        // 좋아요 하트색 세팅
        if (payload) {
            getUserInfoAPI(payloadParse.user_id).then(({ responseJson }) => {
                responseJson.exhibition_likes.forEach((obj) => {
                    if (exhibitionDATA.id == obj.id) {
                        const heartElement = document.getElementById("heart")
                        heartElement.style.backgroundImage = 'url("../static/img/filled-heart.png")'
                    }
                })
            })
        }

        // 전시회 제목
        const exhibitionTitle = document.getElementById("title")
        exhibitionTitle.innerHTML = exhibitionDATA.info_name

        // 전시회 장소
        const exhibitionLocation = document.getElementById("location")
        exhibitionLocation.innerHTML = exhibitionDATA.location

        // 전시회 시작일
        const exhibitionStartDate = document.getElementById("startDate")
        exhibitionStartDate.innerText = exhibitionDATA.start_date

        // 전시회 종료일
        const exhibitionEndDate = document.getElementById("endDate")
        exhibitionEndDate.innerText = exhibitionDATA.end_date

        // 전시회 설명
        const exhibitionContent = document.getElementById("content")
        exhibitionContent.innerHTML = exhibitionDATA.content

        // 전시 추천바
        for (let i = 1; i <= 5; i++) {
            let recommend = exhibitionDATA.recommend[i - 1]

            // 상세페이지 링크
            let linkedExhibition = document.getElementById(`${i}-rec-img-anchor`)
            linkedExhibition.setAttribute("href", `${frontendBaseURL}/templates/exhibition-detail.html?exhibition_id=${recommend.id}`)

            // 이미지
            let recommendImg = document.getElementById(`${i}-rec-img`)
            if (recommend.image) {
                console.log(recommend.image)
                if (recommend.image.includes('https%3A')) {
                    // 대체 url 코드로 인코딩된 url 디코딩 하기    
                    recommendImg.setAttribute("src", `https://${decodeURIComponent(recommend.image.split("https%3A")[1])}`)
                }
                else if (recommend.image.includes('https:')) {
                    recommendImg.setAttribute("src", recommend.image)

                } else {
                    recommendImg.setAttribute("src", `${backendBaseURL.split('/api')[0]}${recommend.image}`)
                }
            }


            // 제목
            let recommendTitle = document.getElementById(`${i}-rec-title`)
            recommendTitle.innerHTML = recommend.info_name
        }

        // 리뷰 버튼
        const reviewButton = document.getElementById("reviewBtn")
        reviewButton.addEventListener("click", function () {
            getReview(exhibition_id)
        })

        // 동행 버튼
        const accompanyButton = document.getElementById("accompanyBtn")
        accompanyButton.addEventListener("click", function () {
            getAccompany(exhibition_id)
        })

        // 예약하기 버튼
        const exhibitionReserveButton = document.getElementById("reserveBtn")
        exhibitionReserveButton.addEventListener("click", function () {
            if (isEditingAccompany || isEditingReview) {
                alert("수정하고 있는 글을 저장 또는 취소 후 클릭하십시오.")
            } else {
                exhibitionReserve(exhibitionDATA.direct_url)
            }

        })
    })

}

// 좋아요 하트 관련 코드
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

// 전시회 예약 페이지
function exhibitionReserve(link) {
    window.open(link)
}

// 스크롤 위치에 따른 추천바 숨기기
let recommendOrganizer = document.querySelector(".recommend-organizer")
let reserveBtn = document.querySelector("#reserveBtn")
let reserveBtnHeight = window.pageYOffset + reserveBtn.getBoundingClientRect().top

let header = document.querySelector("header")
let headerHeight = window.pageYOffset + header.getBoundingClientRect().top

window.onscroll = function () {
    let windowTop = window.scrollY
    if (windowTop >= reserveBtnHeight || windowTop <= headerHeight) {
        recommendOrganizer.style.display = "none"
    } else {
        recommendOrganizer.style.display = "flex"
    }
}