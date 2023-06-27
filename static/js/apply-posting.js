import { payload, payloadParse, postApplyAPI } from "./api.js";
import { deleteApply } from "./accompany.js";

//----------------------------------------------------------------작성----------------------------------------------------------------
// 동행 신청 버튼 눌렀을 때 실행되는 함수
export function postApply(accompany){
    // 동행 구하는 글 박스
    const accompanyBox = document.getElementById(`accompany${accompany.id}`)
    // 동행 신청 버튼
    const accApplyBtn = document.querySelector(".acc-apply-btn")
    // 동행 신청 작성창 있으면 삭제, 없으면 렌더하기
    const applyPostBox = document.getElementById("applyPostBox")
    if (applyPostBox) {
        accApplyBtn.innerText = "동행신청"
        accompanyBox.parentNode.removeChild(applyPostBox)
    } else {
        accApplyBtn.innerText = "닫기"

        const applierAll = document.createElement("div")
        applierAll.setAttribute("class", "app-applier-all")
        applierAll.setAttribute("id", "applyPostBox")
    
        const arrowMark = document.createElement("span")
        arrowMark.setAttribute("class", "app-arrow-mark")
        arrowMark.innerText = "↳"
        applierAll.appendChild(arrowMark)

        const applierPurpleBox = document.createElement("form")
        applierPurpleBox.setAttribute("class", "app-applier-purple-box")

        const applierRow1InPurple = document.createElement("div")
        applierRow1InPurple.setAttribute("class", "app-applier-row1-in-purple")

        // 동행 신청자 닉네임
        const applierNickname = document.createElement("div")
        applierNickname.setAttribute("class", "app-applier-nickname")
        applierNickname.innerText = payloadParse.nickname
        applierRow1InPurple.appendChild(applierNickname)
        applierPurpleBox.appendChild(applierRow1InPurple)

        const applierRow2InPurple = document.createElement("div")
        applierRow2InPurple.setAttribute("class", "app-applier-row2-in-purple")

        // 저도 같이 갈래요!
        const applierAccompanyContent = document.createElement("div")
        applierAccompanyContent.setAttribute("class", "app-applier-accompany-content")

        const applierContentHeader = document.createElement("p")
        applierContentHeader.setAttribute("class", "app-applier-content-header")
        applierContentHeader.innerText = "저도 같이 갈래요!"
        applierAccompanyContent.appendChild(applierContentHeader)

        const applierContent = document.createElement("textarea")
        applierContent.setAttribute("class", "app-applier-content")
        applierContent.setAttribute("id", "appContent")
        applierContent.setAttribute("placeholder", "내용을 입력하세요.")
        applierAccompanyContent.appendChild(applierContent)

        applierRow2InPurple.appendChild(applierAccompanyContent)
        applierPurpleBox.appendChild(applierRow2InPurple)

        const applierRow3InPurple = document.createElement("div")
        applierRow3InPurple.setAttribute("class", "app-applier-row3-in-purple")

        // 신청댓글 등록 버튼
        const applierAccPostingBtn = document.createElement("button")
        applierAccPostingBtn.setAttribute("type", "button")
        applierAccPostingBtn.setAttribute("class", "app-applier-acc-posing-btn")
        applierAccPostingBtn.addEventListener("click", function () {
            postApplyAPI(accompany.id, applyInputInfo()).then(({ response, responseJson }) => {
                if (response.status == 201) {
                    addNewApply(responseJson.data)
                    alert("글이 등록되었습니다.")
                } else {
                    alert(responseJson.content && "내용없이 글을 작성할 수 없습니다.")
                }
            })
        })
        applierAccPostingBtn.innerText = "등록"
        applierRow3InPurple.appendChild(applierAccPostingBtn)

        applierPurpleBox.appendChild(applierRow3InPurple)
        applierAll.appendChild(applierPurpleBox)
        accompanyBox.after(applierAll)
    }
}

//--------------------위에서 실행시킨 함수가 선언되는 부분--------------------
// 사용자가 입력한 데이터
function applyInputInfo() {
    // 데이터 가져오기
    const appContent = document.getElementById("appContent").value

    // API 전달용 data
    const data = new FormData()
    data.append("content", appContent)

    return data
}

// 방금 작성한 동행구하기 글 목록에 추가하기
function addNewApply(applyData) {
    // 동행 구하는 글 박스
    const accompanyBox = document.getElementById(`accompany${applyData.accompany}`)
    // 동행신청 작성창 삭제
    const applyPostBox = document.getElementById("applyPostBox")
    accompanyBox.parentNode.removeChild(applyPostBox)
    // 동행신청 버튼 닫기->동행신청
    const accApplyBtn = document.querySelector(".acc-apply-btn")
    accApplyBtn.innerText = "동행신청"

    const applierAll = document.createElement("div")
    applierAll.setAttribute("class", "applier-all")

    const arrowMark = document.createElement("span")
    arrowMark.setAttribute("class", "arrow-mark")
    arrowMark.innerText = "↳"
    applierAll.appendChild(arrowMark)

    const applierPurpleBox = document.createElement("div")
    applierPurpleBox.setAttribute("class", "applier-purple-box")

    const applierRow1InPurple = document.createElement("div")
    applierRow1InPurple.setAttribute("class", "applier-row1-in-purple")

    // 동행 신청자 닉네임
    const applierNickname = document.createElement("div")
    applierNickname.setAttribute("class", "applier-nickname")
    applierNickname.innerText = applyData.nickname
    applierRow1InPurple.appendChild(applierNickname)
    applierPurpleBox.appendChild(applierRow1InPurple)

    const applierRow2InPurple = document.createElement("div")
    applierRow2InPurple.setAttribute("class", "applier-row2-in-purple")

    // 저도 같이 갈래요!
    const applierAccompanyContent = document.createElement("div")
    applierAccompanyContent.setAttribute("class", "applier-accompany-content")

    const applierContentHeader = document.createElement("p")
    applierContentHeader.setAttribute("class", "applier-content-header")
    applierContentHeader.innerText = "저도 같이 갈래요!"
    applierAccompanyContent.appendChild(applierContentHeader)

    const applierContent = document.createElement("p")
    applierContent.innerText = applyData.content
    applierAccompanyContent.appendChild(applierContent)

    applierRow2InPurple.appendChild(applierAccompanyContent)
    applierPurpleBox.appendChild(applierRow2InPurple)

    const applierRow3InPurple = document.createElement("div")
    applierRow3InPurple.setAttribute("class", "applier-row3-in-purple")

    // 신청댓글 최종 수정일
    const applierDateInfo = document.createElement("div")
    applierDateInfo.setAttribute("class", "applier-date-info")
    const applierSpan1 = document.createElement("span")
    applierSpan1.innerText = "최종 수정일"
    applierDateInfo.appendChild(applierSpan1)
    const applierSpan2 = document.createElement("span")
    applierSpan2.innerText = applyData.updated_at.split("T")[0]
    applierDateInfo.appendChild(applierSpan2)
    applierRow3InPurple.appendChild(applierDateInfo)

    // 수정, 삭제 버튼
    if (payload) {
        if (payloadParse.user_id == applyData.user){
            // 수정 버튼
            const applierAccUpdateBtn = document.createElement("button")
            applierAccUpdateBtn.setAttribute("type", "button")
            applierAccUpdateBtn.setAttribute("class", "applier-acc-update-btn")
            applierAccUpdateBtn.innerText = "수정"
            applierRow3InPurple.appendChild(applierAccUpdateBtn)

            // 삭제 버튼
            const applierAccDeleteBtn = document.createElement("button")
            applierAccDeleteBtn.setAttribute("type", "button")
            applierAccDeleteBtn.setAttribute("class", "applier-acc-delete-btn")
            applierAccDeleteBtn.addEventListener("click", function () {
                deleteApply(applierAll, applyData)
            })
            applierAccDeleteBtn.innerText = "삭제"
            applierRow3InPurple.appendChild(applierAccDeleteBtn)
        }
    }
    applierPurpleBox.appendChild(applierRow3InPurple)
    applierAll.appendChild(applierPurpleBox)
    accompanyBox.after(applierAll)
}