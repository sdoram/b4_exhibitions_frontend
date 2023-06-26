import { backendBaseURL, putReviewAPI } from "./api.js";
import { deleteReview } from "./review.js";

export let isEditingReview = false;
let starValue = 0;

//----------------------------------------------------------------수정----------------------------------------------------------------
// 수정 버튼 눌렀을 때 실행되는 함수
export function updateReview(reviewBox, reviewData) {
    isEditingReview = true
    // 후기 작성창 연 채로 수정 버튼 눌렀을 때 작성창 닫아주는 코드
    const reviewPostBox = document.getElementById("reviewPostBox")
    if (reviewPostBox) {
        reviewPostBox.parentElement.removeChild(reviewPostBox)
    }
    // 후기 작성하기 버튼 다시 생기게 하기
    const showRvPosting = document.querySelector(".show-rv-posting")
    showRvPosting.style.display = "block"
    
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
        const fileName = event.target.files[0].name
        uploadName.value = fileName
    })

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
            updateStar.setAttribute('src', '/static/img/filled-star.png')
        } else {
            updateStar.setAttribute('src', '/static/img/empty-star.png')
        }
        updateStar.setAttribute("id", `star${i}`)
        updateStar.setAttribute("value", `${i}`)
        updateStar.addEventListener("click", function () {
            fillStars(i)
        })
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
                    if (isEditingReview) {
                        alert("수정하고 있는 리뷰를 저장 또는 취소 후 클릭하십시오.")
                    } else {
                        isEditingReview = true
                        updateReview(reviewBox, responseJson.data)
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
        isEditingReview = false // 수정 중인 상태가 아닌 것으로 변경
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
            if (isEditingReview) {
                alert("수정하고 있는 리뷰를 저장 또는 취소 후 클릭하십시오.")
            } else {
                isEditingReview = true
                updateReview(reviewBox, reviewData)
            }
        }
        cancelBtn.innerText = "삭제"
        cancelBtn.onclick = function () {
            deleteReview(reviewBox, reviewData)
        }

        isEditingReview = false // 수정 중인 상태가 아닌 것으로 변경
    }
}

//----------------위에서 실행시킨 함수가 선언되는 부분----------------
// 별 채우기
function fillStars(n) {
    const starIds = ['star1', 'star2', 'star3', 'star4', 'star5']
    starValue = n
    for (let i = 0; i < starIds.length; i++) {
        const star = document.getElementById(starIds[i])
        if (i < n) {
        star.setAttribute('src', '/static/img/filled-star.png')
        } else {
        star.setAttribute('src', '/static/img/empty-star.png')
        }
    }
}

// 수정<->저장, 삭제<->취소 버튼 변환 시 필요한 코드
function removeExistingListeners(element, eventName) {
  let newElement = element.cloneNode(true)
  element.replaceWith(newElement)
  return newElement
}