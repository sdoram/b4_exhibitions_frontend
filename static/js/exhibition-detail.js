console.log('exhibition-detail 연결')


import { getExhibitionAPI, exhibitionLikeAPI, payload, payloadParse, myPageAPI, reviewGetAPI, backendBaseURL } from "./api.js";


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
        let count = 0
        reviewButton.addEventListener("click", function () {
            if (count == 0) {
                review(exhibition_id);
                count += 1
            }            
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

// 리뷰 버튼이나 동행글 버튼을 누르면 우측 전시추천 항목이 사라진다.
document.getElementById("reviewBtn").addEventListener("click", function() {
    hideRecommendOrganizer(); // 클릭 이벤트 발생시 숨기기 처리
});
document.getElementById("accompanyBtn").addEventListener("click", function() {
    hideRecommendOrganizer(); // 동행글 보기 버튼 클릭 이벤트 처리
});
function hideRecommendOrganizer() {
    var recommendOrganizer = document.querySelector(".recommend-organizer");
    recommendOrganizer.style.display = "none";
}

// 리뷰 버튼 눌렀을 때 실행되는 함수
function review(exhibition_id) {
    reviewGetAPI(exhibition_id).then(({ responseJson }) => {
        const reviewsDATA = responseJson.reviews.results
        console.log(reviewsDATA)

        const exhibitionDetail = document.getElementById("exhibitionDetail")
        const reviewList = document.createElement("div")
        reviewList.setAttribute("class", "rv-all-items-organizer")

        // 리뷰 목록
        reviewsDATA.forEach(review => {          
            const grayBox = document.createElement("div")
            grayBox.setAttribute("class", "rv-gray-box")

            // 이미지
            const imgBox = document.createElement("div")
            imgBox.setAttribute("class", "rv-img-box")
            const reviewImg = document.createElement("img")
            reviewImg.setAttribute("class", "rv-review-img")
            reviewImg.setAttribute("onerror", "this.src='/static/img/default-img.jpg'")
            if (review.image) {                
                reviewImg.setAttribute("src", `${backendBaseURL.split('/api')[0]}${review.image}`);             
            } else {
                reviewImg.setAttribute("src", "/static/img/default-img.jpg")
            }
            imgBox.appendChild(reviewImg)
            grayBox.appendChild(imgBox)

            
            const purpleBox = document.createElement("div")
            purpleBox.setAttribute("class", "rv-purple-box")

            const row1InPurple = document.createElement("div")
            row1InPurple.setAttribute("class", "rv-row1-in-purple")

            // 닉네임
            const nicknameBox = document.createElement("div")
            nicknameBox.setAttribute("class", "rv-nickname-box")
            nicknameBox.innerText = review.nickname
            row1InPurple.appendChild(nicknameBox)

            // 별점
            const stars = document.createElement("div")
            stars.setAttribute("class", "rv-stars")
            
            for (let i = 1; i <= 5; i++) {
                if (i <= review.rating) {  
                    let star = document.createElement("img")
                    star.setAttribute("class", "rv-star")              
                    star.setAttribute("src", "/static/img/filled-star.png")
                    stars.appendChild(star)
                } else {
                    let star = document.createElement("img")
                    star.setAttribute("class", "rv-star") 
                    star.setAttribute("src", "/static/img/empty-star.png")
                    stars.appendChild(star)
                }
            }
            row1InPurple.appendChild(stars)
            purpleBox.appendChild(row1InPurple)

            const row2InPurple = document.createElement("div")
            row2InPurple.setAttribute("class", "rv-row2-in-purple")

            // 리뷰 내용
            const reviewContent = document.createElement("div")
            reviewContent.setAttribute("class", "rv-review-content")
            reviewContent.innerText = review.content
            row2InPurple.appendChild(reviewContent)
            purpleBox.appendChild(row2InPurple)

            const row3InPurple = document.createElement("div")
            row3InPurple.setAttribute("class", "rv-row3-in-purple")

            // 리뷰 날짜
            const dateInfo = document.createElement("div")
            dateInfo.setAttribute("class", "rv-date-info")
            const span1 = document.createElement("span")
            span1.innerText = "리뷰 최종 수정일"
            dateInfo.appendChild(span1)
            const span2 = document.createElement("span")
            span2.innerText = review.updated_at.split("T")[0]
            dateInfo.appendChild(span2)
            row3InPurple.appendChild(dateInfo)

            // 수정, 삭제 버튼
            if (payload) {
                if (payloadParse.user_id == review.user_id){
                    // 수정 버튼
                    const reviewUpdateBtn = document.createElement("button")
                    reviewUpdateBtn.setAttribute("type", "button")
                    reviewUpdateBtn.setAttribute("class", "rv-review-update-btn")
                    reviewUpdateBtn.innerText = "수정"
                    row3InPurple.appendChild(reviewUpdateBtn)

                    // 삭제 버튼
                    const reviewDeleteBtn = document.createElement("button")
                    reviewDeleteBtn.setAttribute("type", "button")
                    reviewDeleteBtn.setAttribute("class", "rv-review-delete-btn")
                    reviewDeleteBtn.innerText = "삭제"
                    row3InPurple.appendChild(reviewDeleteBtn)
                }
            }
            purpleBox.appendChild(row3InPurple)
            grayBox.appendChild(purpleBox)
            reviewList.appendChild(grayBox)
            exhibitionDetail.appendChild(reviewList)
        })
    })
}