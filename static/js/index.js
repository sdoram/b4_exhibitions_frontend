console.log('index 연결')
import { frontendBaseURL, getExhibitionsAPI, exhibitionLikeAPI, myPageAPI, payload, payloadParse } from "./api.js";

window.onload = function loadExhibitions() {
    getExhibitionsAPI().then(({ response, responseJson }) => {
        const exhibitionsDATA = responseJson.results
        console.log(responseJson)
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
            exhibitionImg.setAttribute("onerror", "this.src='./static/img/default-img.jpg'")
            if (exhibition.image) {
                if (exhibition.image.includes('https:')) {
                    exhibitionImg.setAttribute("src", exhibition.image);
                } else {
                    // 대체 url 코드로 인코딩된 url 디코딩 하기    
                    exhibitionImg.setAttribute("src", decodeURIComponent(exhibition.image.split("media/")[1]));
                }
            } else {
                exhibitionImg.setAttribute("src", "static/img/default-img.jpg")
            }
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
                myPageAPI(payloadParse.user_id).then(({ responseJson }) => {
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

            const exhibitionDetailButton = document.createElement("button")
            exhibitionDetailButton.setAttribute("class", "detail-button")
            exhibitionDetailButton.addEventListener("click", function () {
                exhibitionDetail(exhibition.id)
            })
            exhibitionDetailButton.innerText = '전시상세'
            exhibitionSignSet.appendChild(exhibitionDetailButton)

            const exhibitionReserveButton = document.createElement("button")
            exhibitionReserveButton.setAttribute("class", "reserve-button")
            exhibitionReserveButton.addEventListener("click", function () {
                exhibitionReserve(exhibition.direct_url)
            })
            exhibitionReserveButton.innerText = '예약하기'
            exhibitionSignSet.appendChild(exhibitionReserveButton)

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

// 좋아요 하트 관련 코드
function heart(exhibition_id) {
    let fullHeart = false;
    exhibitionLikeAPI(exhibition_id).then(({ response, responseJson }) => {
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

// 전시회 예약 페이지
function exhibitionReserve(link) {
    window.open(link)
}

// 이전 페이지
function handlePreviousPage(page) {
    // page 변수명 변경하기 
    window.location.href = `${frontendBaseURL}${window.location.pathname}?${page.split('?')[1]}`
}

// 다음 페이지 
function handleNextPage(page) {
    window.location.href = `${frontendBaseURL}${window.location.pathname}?${page.split('?')[1]}`
}

// 전시회 상세 페이지
function exhibitionDetail(exhibition_id) {
    console.log('전시회 디테일', exhibition_id)
    window.location.href = `${frontendBaseURL}/templates/exhibition-detail.html?exhibition_id=${exhibition_id}`
}

function checkAdmin() {
    console.log('checkAdmin 연결 확인')
    if (payloadParse && payloadParse.is_admin) {
        window.location.replace(`${frontendBaseURL}/templates/backoffice-main.html`)
    }
}
checkAdmin()

document.getElementById("nextPageButton").addEventListener("click", handleNextPage);
document.getElementById("previousPageButton").addEventListener("click", handlePreviousPage);

// enter입력시 함수 실행 
document.getElementById("search").addEventListener("keydown", function (e) {
    if (e.code === 'Enter') {
        exhibitionSearch(this)
    }
})
document.getElementById("searchButton").addEventListener("click", function () {
    exhibitionSearch(this)
})

function exhibitionSearch(search) {
    window.location.href = `${frontendBaseURL}${window.location.pathname}?search=${search.value}`
}