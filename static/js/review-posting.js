import { postReviewAPI, payload, payloadParse, backendBaseURL } from "./api.js";
import { review } from "./review.js";

let starValue = 0;

export function reviewPosting(exhibition_id) {
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
        row2InPurple.setAttribute("class", "row2-in-purple")

        // 후기 내용
        const reviewContent = document.createElement("textarea")
        reviewContent.setAttribute("class", "rp-review-content")
        reviewContent.setAttribute("id", "rvContent")
        reviewContent.setAttribute("placeholder", "후기 내용을 입력해주세요.")
        row2InPurple.appendChild(reviewContent)
        purpleBox.appendChild(row2InPurple)

        const row3InPurple = document.createElement("div")
        row3InPurple.setAttribute("class", "rp-row3-in-purple")

        // 후기작성 버튼
        const rvPostingBtn = document.createElement("button")
        rvPostingBtn.setAttribute("type", "button")
        rvPostingBtn.setAttribute("class", "rp-review-posting-btn")
        rvPostingBtn.setAttribute("id", "rvPostingBtn")
        rvPostingBtn.addEventListener("click", function () {
            handleReviewPosting(exhibition_id);
            review(exhibition_id);
        });
        rvPostingBtn.innerText = "입력완료"
        row3InPurple.appendChild(rvPostingBtn)
        purpleBox.appendChild(row3InPurple)
        grayBox.appendChild(purpleBox)
        reviewList.prepend(grayBox)
    }
}

//-----------위에서 실행시킨 함수가 선언되는 부분--------------
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
            console.log(response.status);
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
    reviewList.prepend(grayBox)
}