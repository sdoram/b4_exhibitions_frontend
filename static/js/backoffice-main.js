import { frontendBaseURL, backendBaseURL, payload, payloadParse, getExhibitionsAPI, getExhibitionAPI, postExhibitionLikeAPI, getUserInfoAPI, deleteExhibitionAPI } from "./api.js";

window.onload = function loadExhibitions() {
    const adminNickname = document.getElementById("adminNickname")
    adminNickname.innerText = payloadParse.nickname
    getExhibitionsAPI().then(({ response, responseJson }) => {
        const exhibitionsDATA = responseJson.results


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
                // 소숫점 내림으로 페이지 시작점 구하기 
                page = Math.floor(Number(new URL(location.href).searchParams.get('page')) / 10) + 1
                currentPage = Number(new URL(location.href).searchParams.get('page'))
            } else {
                page = 1
                currentPage = 1
            }
            const paginationButton = document.getElementById('paginationButton')
            for (let i = (page - 1) * 10; i < page * 10; i++) {
                // 올림을 통해서 8로 나눠떨어지지 않는 끝부분 포함시키기
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
document.getElementById("previousPageButton").addEventListener("click", handlePreviousPage);

// 다음 페이지 
function handleNextPage(page) {
    window.location.href = `${frontendBaseURL}${window.location.pathname}?${page.split('?')[1]}`
}

// 번호 클릭 이동 
function handleNumberPage(page) {
    window.location.href = `${frontendBaseURL}${window.location.pathname}?${page}`
}




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
document.getElementById("searchButton").setAttribute("style", "cursor: pointer;")
document.getElementById("searchButton").addEventListener("click", function () {
    exhibitionSearch(document.getElementById("search"))
})

function exhibitionSearch(search) {
    window.location.href = `${frontendBaseURL}${window.location.pathname}?search=${search.value}`
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