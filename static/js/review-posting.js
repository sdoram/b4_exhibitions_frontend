import { postReviewAPI, payload, payloadParse } from "./api.js";

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
        fileBox.appendChild(uploadName)

        const file = document.createElement("label")
        file.setAttribute("for", "file")
        file.innerText = "파일찾기"
        fileBox.appendChild(file)
        
        const inputFile = document.createElement("input")
        inputFile.setAttribute("type", "file")
        inputFile.setAttribute("accept", ".jpg,.jpeg,.png,.gif,.bmp")
        inputFile.setAttribute("capture", "camera")
        fileBox.appendChild(inputFile)
        imgBox.appendChild(fileBox)
        grayBox.appendChild(imgBox)

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
        rvPostingBtn.innerText = "입력완료"
        row3InPurple.appendChild(rvPostingBtn)
        purpleBox.appendChild(row3InPurple)
        grayBox.appendChild(purpleBox)
        reviewList.prepend(grayBox)
    }
}

// 별 채우기
const starIds = ['star1', 'star2', 'star3', 'star4', 'star5'];
function fillStars(n) {
    for (let i = 0; i < starIds.length; i++) {
        const star = document.getElementById(starIds[i]);
        if (i < n) {
        star.setAttribute('src', '/static/img/filled-star.png');
        } else {
        star.setAttribute('src', '/static/img/empty-star.png');
        }
    }
}