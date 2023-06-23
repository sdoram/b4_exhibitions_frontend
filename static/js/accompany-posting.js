import { postAccompanyAPI, payload, payloadParse } from "./api.js";

export function accompanyPosting(exhibition_id){
    // 동행구하기 버튼 안 보이게 하기
    var showAcPosting = document.querySelector(".show-ac-posting");
    showAcPosting.style.display = "none";

    // 동행구하기 작성창이 없을 때 렌더하기
    let accompanyPostBox = document.getElementById("accompanyPostBox")
    if (!accompanyPostBox) {
        const accompanyList = document.getElementById("accompanyList")

        const grayBox = document.createElement("form")
        grayBox.setAttribute("class", "ap-gray-box")
        grayBox.setAttribute("id", "accompanyPostBox")
        
        const purpleBox = document.createElement("div")
        purpleBox.setAttribute("class", "ap-purple-box")

        const row1InPurple = document.createElement("div")
        row1InPurple.setAttribute("class", "ap-row1-in-purple")

        // 닉네임
        const nicknameBox = document.createElement("div")
        nicknameBox.setAttribute("class", "ap-nickname")
        nicknameBox.innerText = payloadParse.nickname
        row1InPurple.appendChild(nicknameBox)

        // 목표 인원
        const goalNumber = document.createElement("div")
        goalNumber.setAttribute("class", "ap-goal-number")
        goalNumber.innerText = "목표인원"
        const personnel = document.createElement("input")
        personnel.setAttribute("type", "number")
        personnel.setAttribute("class", "ap-goal-num")
        personnel.setAttribute("id", "apPersonnel")
        goalNumber.appendChild(personnel)
        const myeong = document.createElement("span")
        myeong.innerText = "명"
        goalNumber.appendChild(myeong)
        row1InPurple.appendChild(goalNumber)
        
        // 동행시간
        const setDate = document.createElement("div")
        setDate.setAttribute("class", "ap-set-date")
        setDate.innerText = "동행시간 "
        const startTime = document.createElement("input")
        startTime.setAttribute("type", "datetime-local")
        startTime.setAttribute("id", "apStartTime")
        setDate.appendChild(startTime)
        const wave = document.createElement("span")
        wave.innerText = " ~ "
        setDate.appendChild(wave)
        const endTime = document.createElement("input")
        endTime.setAttribute("type", "datetime-local")
        endTime.setAttribute("id", "apEndTime")
        setDate.appendChild(endTime)
        row1InPurple.appendChild(setDate)
        purpleBox.appendChild(row1InPurple)

        const row2InPurple = document.createElement("div")
        row2InPurple.setAttribute("class", "ap-row2-in-purple")

        // 이런 분을 구합니다!
        const accompanyContent = document.createElement("div")
        accompanyContent.setAttribute("class", "ap-accompany-content")
        const contentHeader = document.createElement("p")
        contentHeader.setAttribute("class", "ap-content-header")
        contentHeader.innerText = "이런 분을 구합니다!"
        accompanyContent.appendChild(contentHeader)
        const accContent = document.createElement("textarea")
        accContent.setAttribute("class", "ap-acc-content")
        accContent.setAttribute("placeholder", "내용을 입력하세요")
        accompanyContent.appendChild(accContent)
        row2InPurple.appendChild(accompanyContent)
        purpleBox.appendChild(row2InPurple)

        const row3InPurple = document.createElement("div")
        row3InPurple.setAttribute("class", "ap-row3-in-purple")

        // 입력완료 버튼
        const accPostingBtn = document.createElement("button")
        accPostingBtn.setAttribute("type", "button")
        accPostingBtn.setAttribute("class", "ap-acc-posting-btn")
        accPostingBtn.innerText = "입력완료"
        row3InPurple.appendChild(accPostingBtn)
        purpleBox.appendChild(row3InPurple)
        grayBox.appendChild(purpleBox)
        accompanyList.prepend(grayBox)
    }
}