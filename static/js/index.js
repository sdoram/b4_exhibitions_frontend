console.log('index 연결')
import { googleAPI, frontendBaseURL, payload, getExhibitionsAPI, backendBaseURL } from "./api.js";

// 로컬 스토리지에 jwt 토큰 저장하기
function setLocalStorage(responseJson) {
    localStorage.setItem("access", responseJson.access);
    localStorage.setItem("refresh", responseJson.refresh);
    const base64Url = responseJson.access.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    // payload로 저장하기 
    localStorage.setItem("payload", jsonPayload);
}

// url에서 access_token 얻기
if (payload) {
} else if (window.location.hash) {
    let hashParams = new URLSearchParams(window.location.hash.substr(1));
    let google_token = hashParams.get("access_token");
    // 백엔드 통신 함수 
    googleAPI(google_token).then(({ response, responseJson }) => {
        if (response.status == 200) {
            setLocalStorage(responseJson)
            alert('로그인 성공');
            window.location.replace(`${frontendBaseURL}/`);
        } else {
            alert(responseJson.error);
            window.location.replace(`${frontendBaseURL}/templates/signin.html`);
        }
    })
}

// 좋아요 하트 관련 코드
let fullHeart = false;
function heart() {
    const heartElement = document.querySelector('#heart');
    if (!fullHeart) {
        heartElement.style.backgroundImage = 'url("../static/img/filled-heart.png")';
        alert("좋아요!");
    } else {
        heartElement.style.backgroundImage = 'url("../static/img/empty-heart.png")';
        alert("좋아요 취소!");
    }
    fullHeart = !fullHeart;
}


function exhibitionDetail(exhibition_id) {
    console.log('전시회 디테일', exhibition_id)
}

window.onload = function loadExhibitions() {
    getExhibitionsAPI().then(({ response, responseJson }) => {
        const exhibitionsDATA = responseJson.results
        console.log(exhibitionsDATA)
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
            exhibitionImg.setAttribute("onerror", "this.src='static/img/default-img.jpg'")
            if (exhibition.image) {
                // 대체 url 코드로 인코딩된 url 디코딩 하기
                exhibitionImg.setAttribute("src", decodeURIComponent(exhibition.image.split("media/")[1]));
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
            exhibitionTitle.innerText = exhibition.info_name
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
            exhibitionHeart.setAttribute("id", `like${exhibition.id}`)
            exhibitionHeart.addEventListener("click", function () {
                heart(this.id)
            })
            exhibitionHeartSet.appendChild(exhibitionHeart)

            const exhibitionHeartNum = document.createElement("span")
            exhibitionHeartNum.setAttribute("class", "heart-num")
            // 백엔드 정보로 수정 필요 
            exhibitionHeartNum.innerText = '1'
            exhibitionHeartSet.appendChild(exhibitionHeartNum)

            // 상세 & 예약 박스
            const exhibitionSignSet = document.createElement('div')
            exhibitionSignSet.setAttribute("class", "sign-set")
            exhibitionInfoBox.appendChild(exhibitionSignSet)

            const exhibitionDetailButton = document.createElement("button")
            exhibitionDetailButton.setAttribute("class", "detail-button")
            exhibitionDetailButton.setAttribute("exhibition-id", exhibition.id)
            exhibitionDetailButton.setAttribute("id", exhibition.id)
            exhibitionDetailButton.addEventListener("click", function () {
                exhibitionDetail(this.id)
            })
            exhibitionDetailButton.innerText = '전시상세'
            exhibitionSignSet.appendChild(exhibitionDetailButton)

            const exhibitionReserveButton = document.createElement("button")
            exhibitionReserveButton.setAttribute("class", "reserve-button")
            exhibitionReserveButton.innerText = '예약하기'
            exhibitionSignSet.appendChild(exhibitionReserveButton)

            exhibitionList.appendChild(exhibitionSet)
        })
    })
}

