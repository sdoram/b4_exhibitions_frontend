console.log('review 연결')

import { payload, payloadParse, reviewGetAPI, backendBaseURL } from "./api.js";

let isReviewsRendered = false;

// 리뷰 버튼 눌렀을 때 실행되는 함수
export function review(exhibition_id) {
    var rvAllItemsOrganizer = document.querySelector(".rv-all-items-organizer");
    if (rvAllItemsOrganizer.style.display === "none") {
        rvAllItemsOrganizer.style.display = "flex";
        if (!isReviewsRendered) {
            reviewGetAPI(exhibition_id).then(({ responseJson }) => {
                const reviewsDATA = responseJson.reviews.results
                console.log(reviewsDATA)

                const reviewList = document.getElementById("reviewList")
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
                        if (payloadParse.user_id == review.user){
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
                })
            })
        isReviewsRendered = true;
        }
    } else {
        rvAllItemsOrganizer.style.display = "none";
    }    
}