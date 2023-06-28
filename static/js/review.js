import { frontendBaseURL, backendBaseURL, payload, payloadParse, getReviewAPI, deleteReviewAPI } from "./api.js";
import { postReview } from "./review-posting.js"
import { isEditingReview, updateReview } from "./review-editing.js"
import { isEditingAccompany } from "./accompany-editing.js";

let isReviewsRendered = false;
let isRpBtnRendered = false;

//----------------------------------------------------------------조회 및 삭제----------------------------------------------------------------
// 이용후기 버튼 눌렀을 때 실행되는 함수
export function getReview(exhibition_id) {
    if (isEditingReview || isEditingAccompany) {
        alert("수정하고 있는 글을 저장 또는 취소 후 클릭하십시오.")
    } else {
        // 동행글 안 보이게 하기
        const acAllItemsOrganizer = document.querySelector(".ac-all-items-organizer")
        acAllItemsOrganizer.style.display = "none"
        // 동행구하기 버튼 안 보이게 하기
        const showAcPosting = document.querySelector(".show-ac-posting")
        if (showAcPosting) {
            showAcPosting.style.display = "none"
        }
        
        const rvAllItemsOrganizer = document.querySelector(".rv-all-items-organizer")
        if (rvAllItemsOrganizer.style.display === "none") {
            rvAllItemsOrganizer.style.display = "flex"
            // 동행구하기 작성창 연 채로 리뷰 보기 눌렀을 때 작성창 닫아주는 코드
            const accompanyPostBox = document.getElementById("accompanyPostBox")
            if (accompanyPostBox) {
                accompanyPostBox.parentElement.removeChild(accompanyPostBox)
            }
            // 후기 작성하기 버튼 생성
            if (!isRpBtnRendered) {
                const reviewList = document.getElementById("reviewList")
                const reviewPostingBtn = document.createElement("button")
                reviewPostingBtn.setAttribute("class", "show-rv-posting")
                reviewPostingBtn.setAttribute("id", "reviewPostingBtn")
                reviewPostingBtn.innerText = "후기 작성하기"
                reviewList.before(reviewPostingBtn)
                reviewPostingBtn.addEventListener("click", function () {
                    postReview(exhibition_id)
                })
                isRpBtnRendered = true
            }
            // 사라졌던 후기 작성하기 버튼 다시 보이게 하기
            const showRvPosting = document.querySelector(".show-rv-posting")
            showRvPosting.style.display = "block"
            if (!isReviewsRendered) {
                getReviewAPI(exhibition_id).then(({ responseJson }) => {
                    const reviewsDATA = responseJson.reviews         

                    // 후기 목록
                    reviewsDATA.forEach(review => {      
                        const grayBox = document.createElement("div")
                        grayBox.setAttribute("class", "rv-gray-box")
                        grayBox.setAttribute("id", `rv${review.id}`)

                        // 이미지
                        const imgBox = document.createElement("div")
                        imgBox.setAttribute("class", "rv-img-box")
                        const reviewImg = document.createElement("img")
                        reviewImg.setAttribute("class", "rv-review-img")
                        reviewImg.setAttribute("id", "reviewImg")
                        reviewImg.setAttribute("onerror", "this.src='/static/img/default-img.jpg'")
                        if (review.image) {                
                            reviewImg.setAttribute("src", `${backendBaseURL.split('/api')[0]}${review.image}`)
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
                        nicknameBox.addEventListener("click", function() {
                            location.href = `${frontendBaseURL}/templates/my-page.html?user_id=${review.user}`;
                        });
                        nicknameBox.innerText = review.nickname
                        row1InPurple.appendChild(nicknameBox)

                        // 별점
                        const stars = document.createElement("div")
                        stars.setAttribute("class", "rv-stars")
                        stars.setAttribute("data-value", review.rating)
                        
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

                        // 후기 내용
                        const reviewContent = document.createElement("div")
                        reviewContent.setAttribute("class", "rv-review-content")
                        reviewContent.setAttribute("id", "reviewContent")
                        reviewContent.innerText = review.content
                        row2InPurple.appendChild(reviewContent)
                        purpleBox.appendChild(row2InPurple)

                        const row3InPurple = document.createElement("div")
                        row3InPurple.setAttribute("class", "rv-row3-in-purple")

                        // 후기 날짜
                        const dateInfo = document.createElement("div")
                        dateInfo.setAttribute("class", "rv-date-info")
                        const span1 = document.createElement("span")
                        span1.innerText = "최종 수정일"
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
                                reviewUpdateBtn.addEventListener("click", function () {
                                    if (isEditingReview) {
                                        alert("수정하고 있는 리뷰를 저장 또는 취소 후 클릭하십시오.")
                                    } else {
                                        updateReview(grayBox, review)
                                    }
                                })
                                row3InPurple.appendChild(reviewUpdateBtn)

                                // 삭제 버튼
                                const reviewDeleteBtn = document.createElement("button")
                                reviewDeleteBtn.setAttribute("type", "button")
                                reviewDeleteBtn.setAttribute("class", "rv-review-delete-btn")
                                reviewDeleteBtn.innerText = "삭제"
                                reviewDeleteBtn.addEventListener("click", function () {
                                    deleteReview(grayBox, review)
                                })
                                row3InPurple.appendChild(reviewDeleteBtn)
                            }
                        }
                        purpleBox.appendChild(row3InPurple)
                        grayBox.appendChild(purpleBox)
                        reviewList.appendChild(grayBox)
                    })
                })
                isReviewsRendered = true
            }
        } else {
            rvAllItemsOrganizer.style.display = "none"
            // 이용후기 버튼 다시 눌렀을 때 후기 작성하기 버튼 안 보이게 하기
            const showRvPosting = document.querySelector(".show-rv-posting")
            if (showRvPosting) {
                showRvPosting.style.display = "none"
            }
            // 후기 작성창 연 채로 이용후기 버튼 다시 눌렀을 때 작성창 닫아주는 코드
            const reviewPostBox = document.getElementById("reviewPostBox")
            if (reviewPostBox) {
                reviewPostBox.parentElement.removeChild(reviewPostBox)
            }
        } 
    }
       
}

// 삭제 버튼 눌렀을 때 실행되는 함수
export function deleteReview(reviewBox, review) {
    if (confirm("정말 삭제하시겠습니까?")) {
        deleteReviewAPI(review.id).then((response) => {
            if (response.status == 204) {
                alert("삭제되었습니다.")
                reviewBox.parentNode.removeChild(reviewBox)
            }            
        })
    }
}