import { getExhibitionAPI, postExhibitionLikeAPI, payload, payloadParse, getUserInfoAPI, frontendBaseURL, backendBaseURL } from "./api.js";
import { getReview } from "./review.js";
import { getAccompany } from "./accompany.js";
import { isEditingReview } from "./review-editing.js";
import { isEditingAccompany } from "./accompany-editing.js";


window.onload = function loadExhibition() {
    if (document.referrer.includes("signin")) {
        console.log("signin포함");
        console.log(document.referrer);
    } else {
        console.log("signin 미포함");
        console.log(document.referrer);
    }
    // url 객체 생성 후 exhibition_id 값 추출 
    const exhibition_id = new URLSearchParams(window.location.search).get("exhibition_id")
    getExhibitionAPI(exhibition_id).then(({ response, responseJson }) => {
        if (response.status == 404) {
            window.location.replace("/templates/page_not_found.html")
        }
        const exhibitionDATA = responseJson

        // 전시회 이미지
        const exhibitionImg = document.getElementById("posterImg")
        // 이미지를 못찾을 경우 대체 이미지 
        exhibitionImg.setAttribute("onerror", "src='/static/img/default-img.jpg'")
        if (exhibitionDATA.image) {
            if (exhibitionDATA.image.includes('https%3A')) {
                // 대체 url 코드로 인코딩된 url 디코딩 하기    
                exhibitionImg.setAttribute("src", `https://${decodeURIComponent(exhibitionDATA.image.split("https%3A")[1])}`)
            }
            else {
                exhibitionImg.setAttribute("src", exhibitionDATA.image)
            }
        } else {
            exhibitionImg.setAttribute("src", "/static/img/default-img.jpg")
        }

        // 전시회 좋아요 
        const exhibitionHeart = document.getElementById("heart")
        exhibitionHeart.addEventListener("click", function () {
            heart(exhibitionDATA.id)
        })

        // 전시회 좋아요 개수
        const exhibitionHeartNum = document.getElementById("heartNum")
        exhibitionHeartNum.innerText = exhibitionDATA.likes

        // 좋아요 하트색 세팅
        if (payload) {
            exhibitionHeart.setAttribute("style", "cursor: pointer;")
            getUserInfoAPI(payloadParse.user_id).then(({ responseJson }) => {
                responseJson.exhibition_likes.forEach((obj) => {
                    if (exhibitionDATA.id == obj.id) {
                        const heartElement = document.getElementById("heart")
                        heartElement.style.backgroundImage = 'url("../static/img/filled-heart.png")'
                    }
                })
            })
        }

        // 전시회 제목
        const exhibitionTitle = document.getElementById("title")
        exhibitionTitle.innerHTML = exhibitionDATA.info_name

        // 전시회 장소
        const exhibitionLocation = document.getElementById("location")
        exhibitionLocation.innerHTML = exhibitionDATA.location

        // 전시회 기간
        const exhibitionPeriod = document.getElementById("period")
        if (exhibitionDATA.start_date && exhibitionDATA.end_date) {
            exhibitionPeriod.innerText = `${exhibitionDATA.start_date} ~ ${exhibitionDATA.end_date}`
        } else {
            exhibitionPeriod.innerText = "상시"
        }

        // 전시회 설명
        const exhibitionContent = document.getElementById("content")
        exhibitionContent.innerHTML = exhibitionDATA.content

        // 전시 추천바
        for (let i = 1; i <= 5; i++) {
            let recommend = exhibitionDATA.recommend[i - 1]

            // 상세페이지 링크
            let linkedExhibition = document.getElementById(`${i}-rec-img-anchor`)
            linkedExhibition.setAttribute("href", `${frontendBaseURL}/templates/exhibition-detail.html?exhibition_id=${recommend.id}`)

            // 이미지
            let recommendImg = document.getElementById(`${i}-rec-img`)
            // 이미지를 못찾을 경우 대체 이미지 
            recommendImg.setAttribute("onerror", "this.src='/static/img/default-img.jpg'")
            if (recommend.image) {
                if (recommend.image.includes('https%3A')) {
                    // 대체 url 코드로 인코딩된 url 디코딩 하기    
                    recommendImg.setAttribute("src", `https://${decodeURIComponent(recommend.image.split("https%3A")[1])}`)
                }
                else if (recommend.image.includes('https:')) {
                    recommendImg.setAttribute("src", recommend.image)
                } else {
                    recommendImg.setAttribute("src", `${backendBaseURL.split('/api')[0]}${recommend.image}`)
                }
            } else {
                recommendImg.setAttribute("src", "/static/img/default-img.jpg")
            }


            // 제목
            let recommendTitle = document.getElementById(`${i}-rec-title`)
            recommendTitle.innerHTML = recommend.info_name
        }

        // 리뷰 버튼
        const reviewButton = document.getElementById("reviewBtn")
        reviewButton.addEventListener("click", function () {
            getReview(exhibition_id)
        })

        // 동행 버튼
        const accompanyButton = document.getElementById("accompanyBtn")
        accompanyButton.addEventListener("click", function () {
            getAccompany(exhibition_id)
        })

        // 예약하기 버튼
        const exhibitionReserveButton = document.getElementById("reserveBtn")
        if (exhibitionDATA.direct_url) {
            exhibitionReserveButton.addEventListener("click", function () {
                if (isEditingAccompany || isEditingReview) {
                    alert("수정하고 있는 글을 저장 또는 취소 후 클릭하십시오.")
                } else {
                    exhibitionReserve(exhibitionDATA.direct_url)
                }
            })
        } else {
            exhibitionReserveButton.addEventListener("click", function () {
                alert("이 전시는 예약이 필요하지 않거나 현장예매만 가능한 전시입니다.")
            })
        }
    })
}

// 좋아요 하트 관련 코드
function heart(exhibition_id) {
    let fullHeart = false;
    if (payload) {
        postExhibitionLikeAPI(exhibition_id).then(({ response, responseJson }) => {
            const heartElement = document.getElementById("heart")
            const heartNum = document.getElementById("heartNum")
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

// 전시회 예약 페이지
function exhibitionReserve(link) {
    window.open(link)
}

// 스크롤 위치에 따른 추천바 숨기기
document.addEventListener("DOMContentLoaded", function () {
    const recommendOrganizer = document.querySelector(".recommend-organizer")

    function showHideRecommendOrganizer() {
        const reviewBtn = document.getElementById("reviewBtn")
        const reviewBtnTop = reviewBtn.getBoundingClientRect().top
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop

        if (reviewBtnTop >= window.innerHeight || scrollTop === 0) {
            recommendOrganizer.style.display = "block"
        } else {
            recommendOrganizer.style.display = "none"
        }
    }

    // 스크롤 이벤트에서 실행
    window.addEventListener("scroll", showHideRecommendOrganizer)
});

function readMoreBtn() {
    const readMoreBtn = document.getElementById('readMoreBtn');
    let isShowingMore = false; // 더 보기 상태 플래그

    // 초기 상태 설정
    document.getElementById('content').classList.add('show-less');

    readMoreBtn.addEventListener('click', function () {
        const contentElement = document.getElementById('content');

        if (!isShowingMore) {
            contentElement.classList.remove('show-less');
            readMoreBtn.textContent = '접기';
        } else {
            contentElement.classList.add('show-less');
            readMoreBtn.textContent = '더 보기';
        }

        isShowingMore = !isShowingMore;
    });
}


function loadMap() {
    const exhibitionId = new URLSearchParams(window.location.search).get("exhibition_id");

    fetch(`${backendBaseURL}/exhibitions/${exhibitionId}/`)
        .then((response) => response.json())
        .then((item) => {
            // 만든 후 여기서 `map` 객체를 직접 만들기
            var mapContainer = document.getElementById('map'); // 지도를 표시할 div
            var mapOption = {
                center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
                level: 3 // 지도의 확대 레벨
            };

            var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

            // 지도에 마커를 표시하는 함수 호출
            displaySingleMarker(map, item);
        });
}

// 지도에 마커를 표시하는 함수
function displaySingleMarker(map, item) {
    if (item.latitude !== undefined && item.longitude !== undefined) { // 위도, 경도 값이 없을때는 지도에 표시하지 않음
        var markerPosition = new kakao.maps.LatLng(item.latitude, item.longitude);

        var marker = new kakao.maps.Marker({
            position: markerPosition,
        });

        marker.setMap(map);

        // 지도의 중심 좌표를 마커의 위치로 업데이트
        map.setCenter(markerPosition);
    }
}
// function checkLogin() {
//     if (document.referrer && document.referrer.includes("signin")) {
//         console.log(document.referrer)
//         // window.location.reload();
//     }
// }
// checkLogin();
readMoreBtn();
loadMap(); 