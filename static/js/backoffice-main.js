import { frontendBaseURL, getExhibitionsAPI, postExhibitionLikeAPI, getUserInfoAPI, payload, payloadParse, deleteExhibitionAPI, backendBaseURL } from "./api.js";

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


window.onload = function loadExhibitions() {
    const adminNickname = document.getElementById("adminNickname")
    adminNickname.innerText = payloadParse.nickname
    getExhibitionsAPI().then(({ response, responseJson }) => {
        const exhibitionsDATA = responseJson.results
        const exhibitionList = document.getElementById("exhibitionList")
        exhibitionsDATA.forEach(exhibition => {
            const exhibitionSet = document.createElement("div");
            exhibitionSet.setAttribute("class", "exhibition-set");

            const exhibitionImgBox = document.createElement("div");
            exhibitionImgBox.setAttribute("class", "exhibition-img-box")
            exhibitionSet.appendChild(exhibitionImgBox)

            // 전시회 이미지
            const exhibitionImg = document.createElement("img");
            // 이미지 사이즈가 클 경우 화면에 맞게 줄여주는 css 수정 필요
            exhibitionImg.setAttribute("class", "card-img-top");
            // 이미지를 못찾을 경우 대체 이미지 
            exhibitionImg.setAttribute("onerror", "this.src='/static/img/default-img.jpg'")
            if (exhibition.image) {
                if (exhibition.image.includes('https:')) {
                    exhibitionImg.setAttribute("src", exhibition.image);
                } else if (exhibition.image.includes('https%3A')) {
                    // 대체 url 코드로 인코딩된 url 디코딩 하기    
                    exhibitionImg.setAttribute("src", decodeURIComponent(exhibition.image.split("media/")[1]));
                } else if (exhibition.image.includes('media')) {
                    exhibitionImg.setAttribute("src", `${backendBaseURL.split('/api')[0]}${exhibition.image}`)
                }
            } else {
                exhibitionImg.setAttribute("src", "/static/img/default-img.jpg")
            }
            exhibitionImg.addEventListener("click", function () {
                exhibitionDetail(exhibition.id)
            })
            exhibitionImgBox.appendChild(exhibitionImg)

            // 전시회 정보 박스 
            const exhibitionInfoBox = document.createElement("div");
            exhibitionInfoBox.setAttribute("class", "exhibition-info-box");
            exhibitionSet.appendChild(exhibitionInfoBox)

            // 전시회 제목
            const exhibitionTitle = document.createElement("span");
            exhibitionTitle.setAttribute("class", "exhibition-title");
            exhibitionTitle.innerHTML = exhibition.info_name
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

            if (payload) {
                getUserInfoAPI(payloadParse.user_id).then(({ response, responseJson }) => {
                    responseJson.exhibition_likes.forEach((obj) => {
                        if (exhibition.id == obj.id) {
                            const heartElement = document.getElementById(exhibition.id);
                            heartElement.style.backgroundImage = 'url("../static/img/filled-heart.png")';
                        }
                    })
                })
            }

            // 상세 & 예약 박스
            const exhibitionSignSet = document.createElement('div')
            exhibitionSignSet.setAttribute("class", "sign-set")
            exhibitionInfoBox.appendChild(exhibitionSignSet)

            // 수정하기
            const exhibitionPutButton = document.createElement("button")
            exhibitionPutButton.setAttribute("class", "detail-button")
            exhibitionPutButton.addEventListener("click", function () {
                exhibitionPut(exhibition.id)
            })

            exhibitionPutButton.innerText = '수정하기'
            exhibitionSignSet.appendChild(exhibitionPutButton)

            // 삭제하기
            const exhibitionDeleteButton = document.createElement("button")
            exhibitionDeleteButton.setAttribute("class", "reserve-button")
            exhibitionDeleteButton.addEventListener("click", function () {
                exhibitionDelete(exhibition.id)
            })
            exhibitionDeleteButton.innerText = '삭제하기'
            exhibitionSignSet.appendChild(exhibitionDeleteButton)

            exhibitionList.appendChild(exhibitionSet)

            // 다음 페이지 버튼
            const nextPageButton = document.getElementById('nextPageButton')
            nextPageButton.addEventListener("click", function () {
                handleNextPage(responseJson.next)
            })

            // 이전 페이지 버튼 
            const previousPageButton = document.getElementById('previousPageButton')
            previousPageButton.addEventListener("click", function () {
                handlePreviousPage(responseJson.previous)
            })
        })
    })
}

// 전시회 삭제 
function exhibitionDelete(exhibition_id) {
    // 전시회 삭제시 확인하기
    if (confirm("정말 삭제하시겠습니까?")) {
        deleteExhibitionAPI(exhibition_id).then((response) => {
            alert('삭제완료')
            window.location.reload()
        })
    }
}

// 전시회 수정
function exhibitionPut(exhibition_id) {
    window.location.href = `${frontendBaseURL}/templates/exhibition-posting.html?exhibition_id=${exhibition_id}`
}

// 전시회 상세 페이지
function exhibitionDetail(exhibition_id) {
    window.location.href = `${frontendBaseURL}/templates/exhibition-detail.html?exhibition_id=${exhibition_id}`
}

// 이전 페이지
function handlePreviousPage(page) {
    window.location.href = `${frontendBaseURL}${window.location.pathname}?${page.split('?')[1]}`
}

// 다음 페이지 
function handleNextPage(page) {
    window.location.href = `${frontendBaseURL}${window.location.pathname}?${page.split('?')[1]}`
}


document.getElementById("nextPageButton").addEventListener("click", handleNextPage);
document.getElementById("previousPageButton").addEventListener("click", handlePreviousPage);

function checkAdminBackOffice() {
    if (!payloadParse || !payloadParse.is_admin) {
        window.location.replace(`${frontendBaseURL}/`)
    }
}
checkAdminBackOffice()

document.getElementById("exhibitionPosting").addEventListener("click", handleExhibitionPosting);

function handleExhibitionPosting() {
    window.location.href = `${frontendBaseURL}/templates/exhibition-posting.html`
}

// enter입력시 함수 실행 
document.getElementById("search").addEventListener("keydown", function (e) {
    if (e.code === 'Enter') {
        exhibitionSearch(this)
    }
})
document.getElementById("searchButton").addEventListener("click", function () {
    exhibitionSearch(document.getElementById("search"))
})

function exhibitionSearch(search) {
    window.location.href = `${frontendBaseURL}${window.location.pathname}?search=${search.value}`
}