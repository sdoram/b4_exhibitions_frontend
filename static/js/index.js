
import { frontendBaseURL, backendBaseURL, payload, payloadParse, getPopularAPI, getExhibitionsAPI, postExhibitionLikeAPI, getUserInfoAPI, getExhibitionAPI } from "./api.js";

window.onload = function loadExhibitions() {
    if (window.location.href == `${frontendBaseURL}/`) {
        popup()
    }
    getPopularAPI().then(({ response, responseJson }) => {
        // 전시 인기 랭킹 Top5
        for (let i = 1; i <= 5; i++) {
            let popular = responseJson[i - 1]

            // 상세페이지 링크
            let linkedPopular = document.getElementById(`rank${i}Link`)
            linkedPopular.setAttribute("href", `${frontendBaseURL}/templates/exhibition-detail.html?exhibition_id=${popular.id}`)

            // 이미지
            let popularImg = document.getElementById(`rank${i}Img`)
            // 이미지를 못찾을 경우 대체 이미지 
            popularImg.setAttribute("onerror", "this.src='/static/img/default-img.jpg'")
            if (popular.image) {
                if (popular.image.includes('https%3A')) {
                    // 대체 url 코드로 인코딩된 url 디코딩 하기    
                    popularImg.setAttribute("src", `https://${decodeURIComponent(popular.image.split("https%3A")[1])}`)
                }
                else if (popular.image.includes('https:')) {
                    popularImg.setAttribute("src", popular.image)
                } else {
                    popularImg.setAttribute("src", `${backendBaseURL.split('/api')[0]}${popular.image}`)
                }
            } else {
                popularImg.setAttribute("src", "/static/img/default-img.jpg")
            }

            // 하트 개수
            let heartNumber = document.getElementById(`${i}rankHeartNumber`)
            heartNumber.innerHTML = popular.likes
        }
    })
    getExhibitionsAPI().then(({ response, responseJson }) => {
        const exhibitionsDATA = responseJson.results
        const exhibitionList = document.getElementById("exhibitionList")

        // 이전 페이지 버튼 
        const previousPageButton = document.getElementById('previousPageButton')
        previousPageButton.addEventListener("click", function () {
            handlePreviousPage(responseJson.previous)
        })

        function handleNumberPagination() {
            let page
            let currentPage
            let searchInfo = new URL(location.href).searchParams.get('search')
            let categoryInfo = new URL(location.href).searchParams.get('category')
            if (location.href.includes('page')) {
                // 소숫점 올림으로 페이지 시작점 구하기 
                page = Math.floor(Number(new URL(location.href).searchParams.get('page')) / 10) + 1
                currentPage = Number(new URL(location.href).searchParams.get('page'))
            } else {
                page = 1
                currentPage = 1
            }
            const paginationButton = document.getElementById('paginationButton')
            for (let i = (page - 1) * 10; i < page * 10; i++) {
                if (Math.ceil(responseJson.count / 8) >= i && i != 0) {
                    let numberPageButton = document.createElement("li");
                    numberPageButton.setAttribute("class", "page-link")
                    if (i == currentPage) {
                        numberPageButton.setAttribute("class", "page-link page-select")
                    }
                    numberPageButton.setAttribute("id", `page=${i}`)
                    numberPageButton.innerText = i
                    paginationButton.appendChild(numberPageButton)

                    document.getElementById(`page=${i}`).addEventListener("click", function () {
                        if (searchInfo) {
                            handleNumberPage(`search=${searchInfo}&${this.id}`);
                        } else if (categoryInfo) {
                            handleNumberPage(`category=${categoryInfo}&${this.id}`);
                        } else {
                            handleNumberPage(`${this.id}`);
                        }
                    }
                    );
                }
            }
        }
        handleNumberPagination()


        // 다음 페이지 버튼
        const nextPageButtonLi = document.createElement('li');
        nextPageButtonLi.setAttribute('class', 'page-item');

        const nextPageButton = document.createElement("button");
        nextPageButton.setAttribute('id', 'nextPageButton')
        nextPageButton.setAttribute('class', 'page-link')
        nextPageButton.innerText = '다음 페이지'
        nextPageButtonLi.appendChild(nextPageButton)

        document.getElementById('paginationButton').appendChild(nextPageButtonLi)

        nextPageButton.addEventListener("click", function () {
            handleNextPage(responseJson.next)
        })

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
            exhibitionImg.setAttribute("onerror", "src='/static/img/default-img.jpg'")
            if (exhibition.image) {
                if (exhibition.image.includes('https%3A')) {
                    // 대체 url 코드로 인코딩된 url 디코딩 하기    
                    exhibitionImg.setAttribute("src", `https://${decodeURIComponent(exhibition.image.split("https%3A")[1])}`)
                }
                else if (exhibition.image.includes('https:')) {
                    exhibitionImg.setAttribute("src", exhibition.image)
                } else {
                    exhibitionImg.setAttribute("src", `${backendBaseURL.split('/api')[0]}${exhibition.image}`)
                }
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
            if (exhibition.start_date && exhibition.end_date) {
                exhibitionPeriod.innerText = `${exhibition.start_date} ~ ${exhibition.end_date}`
            } else {
                exhibitionPeriod.innerText = '상시'
            }
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

            // 좋아요 여부에 따른 하트색 세팅
            if (payload) {
                exhibitionHeart.setAttribute("style", "cursor: pointer;")
                getUserInfoAPI(payloadParse.user_id).then(({ responseJson }) => {
                    responseJson.exhibition_likes.forEach((obj) => {
                        if (exhibition.id == obj.id) {
                            const heartElement = document.getElementById(exhibition.id);
                            heartElement.style.backgroundImage = 'url("../static/img/filled-heart.png")';
                        }
                    })
                })
            }

            getExhibitionAPI(exhibition.id).then(({ responseJson }) => {
                // 리뷰 개수
                const reviewNum = document.createElement("span")
                reviewNum.setAttribute("class", "review-num")
                reviewNum.setAttribute("style", "margin-left: 5vmin;")
                reviewNum.innerText = `리뷰 ${responseJson.review_count}개`
                exhibitionHeartSet.appendChild(reviewNum)

                // 동행글 개수
                const accompanyNum = document.createElement("span")
                accompanyNum.setAttribute("class", "review-num")
                accompanyNum.setAttribute("style", "margin-left: 1vmin;")
                accompanyNum.innerText = `동행모집 ${responseJson.accompany_count}개`
                reviewNum.after(accompanyNum)
            })


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

        })
    })
}

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

// 전시회 예약 페이지
function exhibitionReserve(link) {
    window.open(link)
}


// 전시회 상세 페이지
function exhibitionDetail(exhibition_id) {
    window.location.href = `${frontendBaseURL}/templates/exhibition-detail.html?exhibition_id=${exhibition_id}`
}

function checkAdmin() {
    if (payloadParse && payloadParse.is_admin) {
        window.location.replace(`${frontendBaseURL}/templates/backoffice-main.html`)
    }
}
checkAdmin()


document.getElementById("previousPageButton").addEventListener("click", handlePreviousPage);

// enter입력시 함수 실행 
document.getElementById("search").addEventListener("keydown", function (e) {
    if (e.code === 'Enter') {
        exhibitionSearch(this)
    }
})
document.getElementById("searchButton").setAttribute("style", "cursor: pointer;")
document.getElementById("searchButton").addEventListener("click", function () {
    exhibitionSearch(document.getElementById("search"))
})

function exhibitionSearch(search) {
    window.location.href = `${frontendBaseURL}${window.location.pathname}?search=${search.value}`
}

// 팝업창 띄우기
function popup() {
    let url = "/templates/popup.html"
    let name = "공지사항"
    let option = "width = 600, height = 240, top = 200, left = 200, location = no"
    window.open(url, name, option)
}

// 이전 페이지
function handlePreviousPage(page) {
    window.location.href = `${frontendBaseURL}${window.location.pathname}?${page.split('?')[1]}`
}

// 다음 페이지 
function handleNextPage(page) {
    window.location.href = `${frontendBaseURL}${window.location.pathname}?${page.split('?')[1]}`
}

// 번호 클릭 이동 
function handleNumberPage(page) {
    window.location.href = `${frontendBaseURL}${window.location.pathname}?${page}`
}



