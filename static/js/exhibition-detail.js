console.log('exhibition-detail 연결')


import { getExhibitionAPI, exhibitionLikeAPI, payload, payloadParse, myPageAPI } from "./api.js";
import { review } from "./review.js";


window.onload = function loadExhibition() {
    // url 객체 생성 후 exhibition_id 값 추출 
    const exhibition_id = new URLSearchParams(window.location.search).get("exhibition_id")
    getExhibitionAPI(exhibition_id).then(({ response, responseJson }) => {
        const exhibitionDATA = responseJson
        console.log(exhibitionDATA)

        // 전시회 이미지
        const exhibitionImg = document.getElementById("posterImg");
        if (exhibitionDATA.image) {
            if (exhibitionDATA.image.includes('https:')) {
                exhibitionImg.setAttribute("src", exhibitionDATA.image);
            } else {
                // 대체 url 코드로 인코딩된 url 디코딩 하기    
                exhibitionImg.setAttribute("src", decodeURIComponent(exhibitionDATA.image.split("media/")[1]));
            }
        }

        // // 전시회 좋아요 
        const exhibitionHeart = document.getElementById("heart");
        exhibitionHeart.addEventListener("click", function () {
            heart(exhibitionDATA.id)
        })

        // 전시회 좋아요 개수
        const exhibitionHeartNum = document.getElementById("heartNum")
        exhibitionHeartNum.innerText = exhibitionDATA.likes

        // 좋아요 하트색 세팅
        if (payload) {
            myPageAPI(payloadParse.user_id).then(({ responseJson }) => {
                responseJson.exhibition_likes.forEach((obj) => {
                    if (exhibitionDATA.id == obj.id) {
                        const heartElement = document.getElementById("heart");
                        heartElement.style.backgroundImage = 'url("../static/img/filled-heart.png")';
                    }
                })
            })
        }

        // 전시회 제목
        const exhibitionTitle = document.getElementById("title");
        exhibitionTitle.innerHTML = exhibitionDATA.info_name

        // 전시회 장소
        const exhibitionLocation = document.getElementById("location");
        exhibitionLocation.innerHTML = exhibitionDATA.location

        // 전시회 시작일
        const exhibitionStartDate = document.getElementById("startDate");
        exhibitionStartDate.innerText = exhibitionDATA.start_date

        // 전시회 종료일
        const exhibitionEndDate = document.getElementById("endDate");
        exhibitionEndDate.innerText = exhibitionDATA.end_date

        // 전시회 설명
        const exhibitionContent = document.getElementById("content");
        exhibitionContent.innerHTML = exhibitionDATA.content

        
        // 리뷰 버튼
        const reviewButton = document.getElementById("reviewBtn");
        reviewButton.addEventListener("click", function () {
            review(exhibition_id);  
        });


        // 예약하기 버튼
        const exhibitionReserveButton = document.getElementById("reserveBtn");
        exhibitionReserveButton.addEventListener("click", function () {
            exhibitionReserve(exhibitionDATA.direct_url);
        });
    })
    
}

// 좋아요 하트 관련 코드
function heart(exhibition_id) {
    let fullHeart = false;
    exhibitionLikeAPI(exhibition_id).then(({ response, responseJson }) => {
        const heartElement = document.getElementById("heart");
        const heartNum = document.getElementById("heartNum")
        if (response.status == 201) {
            heartElement.style.backgroundImage = 'url("/static/img/filled-heart.png")';
            heartNum.innerText = responseJson.likes
        } else {
            heartElement.style.backgroundImage = 'url("/static/img/empty-heart.png")';
            heartNum.innerText = responseJson.likes
        }
        fullHeart = !fullHeart;
    })
}

// 전시회 예약 페이지
function exhibitionReserve(link) {
    window.open(link)
}

// 추천바 숨기기
function hideRecommendOrganizer() {
    var recommendOrganizer = document.querySelector(".recommend-organizer");
    if (recommendOrganizer.style.display === "flex") {
        recommendOrganizer.style.display = "none";
    } else {
        recommendOrganizer.style.display = "flex";
    } 
}