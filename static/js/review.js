console.log('review 연결')

import { backendBaseURL, payload, payloadParse, getReviewAPI, postReviewAPI, putReviewAPI, deleteReviewAPI } from "./api.js";

let isReviewsRendered = false;
let isRpBtnRendered = false;
let starValue = 0;
let isEditingReview = false;

//------------------------------------------------------------------------------------------조회----------------------------------------------------------------
// 이용후기 버튼 눌렀을 때 실행되는 함수
export function review(exhibition_id) {
    // 동행글 안 보이게 하기
    var acAllItemsOrganizer = document.querySelector(".ac-all-items-organizer");
    acAllItemsOrganizer.style.display = "none";
    // 동행구하기 버튼 안 보이게 하기
    var showAcPosting = document.querySelector(".show-ac-posting");
    if (showAcPosting) {
        showAcPosting.style.display = "none";
    }
    
    var rvAllItemsOrganizer = document.querySelector(".rv-all-items-organizer");
    if (rvAllItemsOrganizer.style.display === "none") {
        rvAllItemsOrganizer.style.display = "flex";
        // 동행구하기 작성창 연 채로 리뷰 보기 눌렀을 때 작성창 닫아주는 코드
        const accompanyPostBox = document.getElementById("accompanyPostBox")
        if (accompanyPostBox) {
            accompanyPostBox.parentElement.removeChild(accompanyPostBox)
        }
        // 후기 작성하기 버튼 생성
        if (payload) {
            if (!isRpBtnRendered) {
                const reviewList = document.getElementById("reviewList")
                var reviewPostingBtn = document.createElement("button")
                reviewPostingBtn.setAttribute("class", "show-rv-posting")
                reviewPostingBtn.setAttribute("id", "reviewPostingBtn")
                reviewPostingBtn.innerText = "후기 작성하기"
                reviewList.before(reviewPostingBtn)
                reviewPostingBtn.addEventListener("click", function () {
                    reviewPosting(exhibition_id);
                });
                isRpBtnRendered = true;
            }
            // 사라졌던 후기 작성하기 버튼 다시 보이게 하기
            var showRvPosting = document.querySelector(".show-rv-posting");
            showRvPosting.style.display = "block";
        }
        if (!isReviewsRendered) {
            getReviewAPI(exhibition_id).then(({ responseJson }) => {
                const reviewsDATA = responseJson.reviews.results            

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
                                if (!isEditingReview) {
                                    isEditingReview = true;
                                    updateReview(grayBox, review)
                                } else {
                                    alert("수정하고 있는 리뷰를 저장 또는 취소 후 클릭하십시오.")
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
            isReviewsRendered = true;
        }
    } else {
        rvAllItemsOrganizer.style.display = "none";
        // 이용후기 버튼 다시 눌렀을 때 후기 작성하기 버튼 안 보이게 하기
        var showRvPosting = document.querySelector(".show-rv-posting");
        showRvPosting.style.display = "none";
        // 후기 작성창 연 채로 이용후기 버튼 다시 눌렀을 때 작성창 닫아주는 코드
        const reviewPostBox = document.getElementById("reviewPostBox")
        if (reviewPostBox) {
            reviewPostBox.parentElement.removeChild(reviewPostBox)
        }
    }    
}

//------------------------------------------------------------------------------------------작성----------------------------------------------------------------
// 후기 작성하기 버튼 눌렀을 때 실행되는 함수
function reviewPosting(exhibition_id) {
    if (isEditingReview) {
        alert("수정하고 있는 리뷰를 저장 또는 취소 후 클릭하십시오.")
    } else {
        // 후기 작성하기 버튼 안 보이게 하기
        var showRvPosting = document.querySelector(".show-rv-posting");
        showRvPosting.style.display = "none";

        // 후기 작성창이 없을 때 렌더하기
        let reviewPostBox = document.getElementById("reviewPostBox")
        if (!reviewPostBox) {
            const reviewList = document.getElementById("reviewList")

            const grayBox = document.createElement("form")
            grayBox.setAttribute("class", "rp-gray-box")
            grayBox.setAttribute("id", "reviewPostBox")

            // 이미지 업로드
            const imgBox = document.createElement("div")
            imgBox.setAttribute("class", "rp-img-box")

            const fileBox = document.createElement("div")
            fileBox.setAttribute("class", "rp-filebox")

            const uploadName = document.createElement("input")
            uploadName.setAttribute("class", "rp-upload-name")
            uploadName.setAttribute("value", "후기 이미지 업로드")
            uploadName.setAttribute("placeholder", "후기 이미지 업로드")
            uploadName.setAttribute("disabled", "disabled")
            fileBox.appendChild(uploadName)

            const file = document.createElement("label")
            file.setAttribute("for", "rvImage")
            file.innerText = "파일찾기"
            fileBox.appendChild(file)
            
            const inputFile = document.createElement("input")
            inputFile.setAttribute("type", "file")
            inputFile.setAttribute("id", "rvImage")
            inputFile.setAttribute("accept", ".jpg,.jpeg,.png,.gif,.bmp")
            inputFile.setAttribute("capture", "camera")
            inputFile.setAttribute("class", "rp-upload-hidden")
            fileBox.appendChild(inputFile)
            imgBox.appendChild(fileBox)
            grayBox.appendChild(imgBox)

            // 이미지 업로드 시 후기 이미지 업로드 글자를 이미지 이름으로 바꾸는 코드
            inputFile.addEventListener('input', function (event) {
                const fileName = event.target.files[0].name;
                uploadName.value = fileName;
            });

            const purpleBox = document.createElement("div")
            purpleBox.setAttribute("class", "rp-purple-box")

            const row1InPurple = document.createElement("div")
            row1InPurple.setAttribute("class", "rp-row1-in-purple")

            // 닉네임
            const nicknameBox = document.createElement("div")
            nicknameBox.setAttribute("class", "rp-nickname-box")
            nicknameBox.innerText = payloadParse.nickname
            row1InPurple.appendChild(nicknameBox)

            // 별점
            const stars = document.createElement("div")
            stars.setAttribute("class", "rp-stars")
            stars.setAttribute("id", "rvStar")
            
            for (let i = 1; i <= 5; i++) { 
                let star = document.createElement("img")
                star.setAttribute("class", "rp-star")              
                star.setAttribute("src", "/static/img/empty-star.png")
                star.setAttribute("id", `star${i}`)
                star.setAttribute("value", `${i}`)
                star.addEventListener("click", function () {
                    fillStars(i);
                });
                stars.appendChild(star)
            }
            row1InPurple.appendChild(stars)
            purpleBox.appendChild(row1InPurple)

            const row2InPurple = document.createElement("div")
            row2InPurple.setAttribute("class", "rv-row2-in-purple")

            // 후기 내용
            const reviewContent = document.createElement("textarea")
            reviewContent.setAttribute("class", "rp-review-content")
            reviewContent.setAttribute("id", "rvContent")
            reviewContent.setAttribute("placeholder", "후기 내용을 입력해주세요.")
            row2InPurple.appendChild(reviewContent)
            purpleBox.appendChild(row2InPurple)

            const row3InPurple = document.createElement("div")
            row3InPurple.setAttribute("class", "rp-row3-in-purple")

            // 후기 입력완료 버튼
            const rvPostingBtn = document.createElement("button")
            rvPostingBtn.setAttribute("type", "button")
            rvPostingBtn.setAttribute("class", "rp-review-posting-btn")
            rvPostingBtn.setAttribute("id", "rvPostingBtn")
            rvPostingBtn.addEventListener("click", function () {
                handleReviewPosting(exhibition_id)
                review(exhibition_id)
            })
            rvPostingBtn.innerText = "입력완료"
            row3InPurple.appendChild(rvPostingBtn)
            purpleBox.appendChild(row3InPurple)
            grayBox.appendChild(purpleBox)
            reviewList.prepend(grayBox)
        }
    }
    
}

//--------------위에서 실행시킨 함수가 선언되는 부분--------------
// 별 채우기
function fillStars(n) {
    const starIds = ['star1', 'star2', 'star3', 'star4', 'star5'];
    starValue = n;
    for (let i = 0; i < starIds.length; i++) {
        const star = document.getElementById(starIds[i]);
        if (i < n) {
        star.setAttribute('src', '/static/img/filled-star.png');
        } else {
        star.setAttribute('src', '/static/img/empty-star.png');
        }
    }
}

// 사용자가 입력한 데이터
function reviewInputInfo() {
    // 데이터 가져오기
    const rvContent = document.getElementById("rvContent").value;
    const rvImage = document.getElementById("rvImage").files[0];

    // API 전달용 data
    const data = new FormData();
    data.append("content", rvContent)
    data.append("rating", starValue)
    if (rvImage) {
        data.append("image", rvImage)
    }
    return data
}

// 입력완료 버튼 시 실행되는 함수
function handleReviewPosting(exhibition_id) {
    postReviewAPI(exhibition_id, reviewInputInfo()).then(({ response, responseJson }) => {
        if (response.status == 201) {
            addNewReview(responseJson.data);
            review(exhibition_id);
        } else {
            alert(responseJson.message);
        }
    })
}

// 방금 작성한 리뷰 목록에 추가하기
function addNewReview(reviewData) {
    const reviewList = document.getElementById("reviewList");

    const grayBox = document.createElement("div")
    grayBox.setAttribute("class", "rv-gray-box")

    // 이미지
    const imgBox = document.createElement("div")
    imgBox.setAttribute("class", "rv-img-box")
    const reviewImg = document.createElement("img")
    reviewImg.setAttribute("class", "rv-review-img")
    reviewImg.setAttribute("id", "reviewImg")
    reviewImg.setAttribute("onerror", "this.src='/static/img/default-img.jpg'")
    if (reviewData.image) {                
        reviewImg.setAttribute("src", `${backendBaseURL.split('/api')[0]}${reviewData.image}`);             
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
    nicknameBox.innerText = reviewData.nickname
    row1InPurple.appendChild(nicknameBox)

    // 별점
    const stars = document.createElement("div")
    stars.setAttribute("class", "rv-stars")
    
    for (let i = 1; i <= 5; i++) {
        if (i <= reviewData.rating) {  
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
    reviewContent.innerText = reviewData.content
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
    span2.innerText = reviewData.updated_at.split("T")[0]
    dateInfo.appendChild(span2)
    row3InPurple.appendChild(dateInfo)

    // 수정, 삭제 버튼
    if (payload) {
        if (payloadParse.user_id == reviewData.user){
            // 수정 버튼
            const reviewUpdateBtn = document.createElement("button")
            reviewUpdateBtn.setAttribute("type", "button")
            reviewUpdateBtn.setAttribute("class", "rv-review-update-btn")
            reviewUpdateBtn.innerText = "수정"
            reviewUpdateBtn.addEventListener("click", function () {
                if (!isEditingReview) {
                    updateReview(grayBox, reviewData);
                } else {
                    alert("수정하고 있는 리뷰를 저장 또는 취소 후 클릭하십시오.")
                }
            });
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
    reviewList.prepend(grayBox)
}

//------------------------------------------------------------------------------------------수정----------------------------------------------------------------
// 수정<->저장, 삭제<->취소 버튼 변환 시 필요한 코드
function removeExistingListeners(element, eventName) {
  let newElement = element.cloneNode(true);
  element.replaceWith(newElement);
  return newElement;
}

// 수정 버튼 눌렀을 때 실행되는 함수
function updateReview(reviewBox, reviewData) {
    // 후기 작성창 연 채로 수정 버튼 눌렀을 때 작성창 닫아주는 코드
    const reviewPostBox = document.getElementById("reviewPostBox")
    if (reviewPostBox) {
        reviewPostBox.parentElement.removeChild(reviewPostBox)
    }
    
    // 이미지
    let originImageBox = reviewBox.querySelector(".rv-img-box")
    originImageBox.firstChild.style.display = "none"

    const fileBox = document.createElement("div")
    fileBox.setAttribute("class", "rv-filebox")

    const uploadName = document.createElement("input")
    uploadName.setAttribute("class", "rv-upload-name")
    uploadName.setAttribute("value", "수정할 이미지 업로드")
    uploadName.setAttribute("placeholder", "수정할 이미지 업로드")
    uploadName.setAttribute("disabled", "disabled")
    fileBox.appendChild(uploadName)

    const file = document.createElement("label")
    file.setAttribute("for", "rvImage")
    file.innerText = "파일찾기"
    fileBox.appendChild(file)
    
    const inputFile = document.createElement("input")
    inputFile.setAttribute("type", "file")
    inputFile.setAttribute("id", "rvImage")
    inputFile.setAttribute("accept", ".jpg,.jpeg,.png,.gif,.bmp")
    inputFile.setAttribute("capture", "camera")
    inputFile.setAttribute("class", "rv-upload-hidden")
    fileBox.appendChild(inputFile)
    originImageBox.appendChild(fileBox)

    // 이미지 업로드 시 후기 이미지 업로드 글자를 이미지 이름으로 바꾸는 코드
    inputFile.addEventListener('input', function (event) {
        const fileName = event.target.files[0].name;
        uploadName.value = fileName;
    });

    // 별점
    starValue = reviewData.rating
    let starElement = reviewBox.querySelector(".rv-stars")
    const starVal = starElement.getAttribute("data-value")

    let starClickElement = document.createElement("div")
    starClickElement.setAttribute("class", "rv-stars-click")

    for (let i = 1; i <= 5; i++) { 
        let updateStar = document.createElement("img")
        updateStar.setAttribute("class", "rp-star")              
        if (i <= starVal) {
            updateStar.setAttribute('src', '/static/img/filled-star.png');
        } else {
            updateStar.setAttribute('src', '/static/img/empty-star.png');
        }
        updateStar.setAttribute("id", `star${i}`)
        updateStar.setAttribute("value", `${i}`)
        updateStar.addEventListener("click", function () {
            fillStars(i);
        });
        starClickElement.appendChild(updateStar)
    }
    starElement.parentNode.appendChild(starClickElement)

    starClickElement.style.display = "flex"
    starElement.style.display = "none"
    starElement.setAttribute("data-value", starValue)


    // 리뷰 내용
    let reviewTextElement = reviewBox.querySelector(".rv-review-content")
    const reviewText = reviewTextElement.innerText
    let textareaElement = reviewBox.querySelector(".rv-review-content-textarea")

    if (!textareaElement) {
        textareaElement = document.createElement("textarea")
        textareaElement.setAttribute("class", "rv-review-content-textarea")
        reviewTextElement.parentNode.appendChild(textareaElement)
    }

    textareaElement.innerText = reviewText
    textareaElement.style.display = "block"
    reviewTextElement.style.display = "none"
   
    // 수정 버튼을 저장 버튼으로 변경
    let saveBtn = reviewBox.querySelector(".rv-review-update-btn")
    saveBtn.innerText = "저장"
    saveBtn = removeExistingListeners(saveBtn, "click")

    // 삭제 버튼을 취소 버튼으로 변경
    let cancelBtn = reviewBox.querySelector(".rv-review-delete-btn")
    cancelBtn.innerText = "취소"
    cancelBtn = removeExistingListeners(cancelBtn, "click")

    saveBtn.onclick = (event) => {
        event.preventDefault()

        const newRvContent = textareaElement.value
        const rvImage = document.getElementById("rvImage").files[0]

        // API 전달용 data
        const data = new FormData()
        data.append("content", newRvContent)
        data.append("rating", starValue)
        if (rvImage) {
            data.append("image", rvImage)
        }

        putReviewAPI(reviewData.id, data).then(({ response, responseJson }) => {
            if (response.status == 200) {
                alert(responseJson.message)
                // 수정된 이미지 보이게 하고 파일박스는 없애기
                while (originImageBox.hasChildNodes()) {
                    originImageBox.removeChild(originImageBox.firstChild)
                }
                const reviewImg = document.createElement("img")
                reviewImg.setAttribute("class", "rv-review-img")
                reviewImg.setAttribute("id", "reviewImg")
                reviewImg.setAttribute("onerror", "this.src='/static/img/default-img.jpg'")
                if (responseJson.data.image) {                
                    reviewImg.setAttribute("src", `${backendBaseURL.split('/api')[0]}${responseJson.data.image}`);             
                } else {
                    reviewImg.setAttribute("src", "/static/img/default-img.jpg")
                }
                originImageBox.appendChild(reviewImg)

                // 수정된 별점 보이게 하고 원래 요소는 없애기
                while (starElement.hasChildNodes()) {
                    starElement.removeChild(starElement.firstChild)
                }
                for (let i = 1; i <= 5; i++) {
                    if (i <= responseJson.data.rating) {  
                        let star = document.createElement("img")
                        star.setAttribute("class", "rv-star")              
                        star.setAttribute("src", "/static/img/filled-star.png")
                        starElement.appendChild(star)
                    } else {
                        let star = document.createElement("img")
                        star.setAttribute("class", "rv-star") 
                        star.setAttribute("src", "/static/img/empty-star.png")
                        starElement.appendChild(star)
                    }
                }
                starElement.style.display = "flex"
                starElement.setAttribute("data-value", responseJson.data.rating)
                starClickElement.parentNode.removeChild(starClickElement)
                
                // 수정된 리뷰 내용 보이게 하고 텍스트상자는 없애기
                reviewTextElement.innerText = newRvContent
                reviewTextElement.style.display = "block"
                textareaElement.style.display = "none"

                // 저장->수정, 취소->삭제
                saveBtn.innerText = "수정"
                saveBtn.onclick = function () {
                    if (!isEditingReview) {
                        isEditingReview = true;
                        updateReview(reviewBox, responseJson.data)
                    } else {
                        alert("수정하고 있는 리뷰를 저장 또는 취소 후 클릭하십시오.")
                    }                    
                }
                cancelBtn.innerText = "삭제"
                cancelBtn.onclick = function () {
                    deleteReview(reviewBox, responseJson.data)
                }
            } else {
                alert(responseJson.message)
                textareaElement.style.display = "block"
            }            
        })
        isEditingReview = false
    }

    cancelBtn.onclick = (event) => {
        event.preventDefault()
        // 이미지 되돌리기
        originImageBox.firstChild.style.display = "flex"
        originImageBox.removeChild(fileBox)

        // 별점 되돌리기
        starElement.style.display = "flex"
        starClickElement.parentNode.removeChild(starClickElement)

        // 내용 되돌리기
        reviewTextElement.style.display = "block"
        textareaElement.style.display = "none"

        // 버튼 되돌리기
        saveBtn.innerText = "수정"
        saveBtn.onclick = function () {
            if (!isEditingReview) {
                isEditingReview = true
                updateReview(reviewBox, reviewData)
            } else {
                alert("수정하고 있는 리뷰를 저장 또는 취소 후 클릭하십시오.")
            }
        };
        cancelBtn.innerText = "삭제"
        cancelBtn.onclick = function () {
            deleteReview(reviewBox, reviewData)
        }

        isEditingReview = false
    };
}

//------------------------------------------------------------------------------------------삭제----------------------------------------------------------------
// 삭제 버튼 눌렀을 때 실행되는 함수
function deleteReview(reviewBox, review) {
    if (confirm("정말 삭제하시겠습니까?")) {
        deleteReviewAPI(review.id).then((response) => {
            if (response.status == 204) {
                alert("삭제되었습니다.")
                reviewBox.parentNode.removeChild(reviewBox)
            }            
        })
    }
}