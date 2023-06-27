import { payload, payloadParse, postAccompanyAPI } from "./api.js";
import { accompany, deleteAccompany } from "./accompany.js";
import { isEditingAccompany, updateAccompany } from "./accompany-editing.js";

//----------------------------------------------------------------작성----------------------------------------------------------------
// 동행 구하기 버튼 눌렀을 때 실행되는 함수
export function accompanyPosting(exhibition_id){
    if (isEditingAccompany) {
        alert("수정하고 있는 글을 저장 또는 취소 후 클릭하십시오.")
    } else {
        // 동행구하기 버튼 안 보이게 하기
        const showAcPosting = document.querySelector(".show-ac-posting")
        showAcPosting.style.display = "none"

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
            accContent.setAttribute("id", "apContent")
            accContent.setAttribute("placeholder", "내용을 입력하세요")
            accompanyContent.appendChild(accContent)
            row2InPurple.appendChild(accompanyContent)
            purpleBox.appendChild(row2InPurple)

            const row3InPurple = document.createElement("div")
            row3InPurple.setAttribute("class", "ap-row3-in-purple")

            // 동행구하기 입력완료 버튼
            const accPostingBtn = document.createElement("button")
            accPostingBtn.setAttribute("type", "button")
            accPostingBtn.setAttribute("class", "ap-acc-posting-btn")
            accPostingBtn.addEventListener("click", function () {
                postAccompanyAPI(exhibition_id, accompanyInputInfo()).then(({ response, responseJson }) => {
                    if (response.status == 201) {
                        addNewAccompany(responseJson.data)
                        accompany(exhibition_id)
                        accompany(exhibition_id)   // 두 번 실행해야 새로고침 없이 조회 가능
                        alert("글이 등록되었습니다.")
                    } else {
                        alert(responseJson.content && "내용없이 글을 작성할 수 없습니다."
                            || responseJson.personnel && "목표인원을 1명 이상 선택하십시오."
                            || responseJson.start_time && "시작 시간을 설정하십시오."
                            || responseJson.end_time && "종료 시간을 설정하십시오."
                            || responseJson.non_field_errors)
                    }
                })
            })
            accPostingBtn.innerText = "입력완료"
            row3InPurple.appendChild(accPostingBtn)
            purpleBox.appendChild(row3InPurple)
            grayBox.appendChild(purpleBox)
            accompanyList.prepend(grayBox)
        }
    }    
}

//--------------------위에서 실행시킨 함수가 선언되는 부분--------------------
// 사용자가 입력한 데이터
function accompanyInputInfo() {
    // 데이터 가져오기
    const accPersonnel = document.getElementById("apPersonnel").value
    const accStartTime = document.getElementById("apStartTime").value
    const accEndTime = document.getElementById("apEndTime").value
    const accContent = document.getElementById("apContent").value

    // API 전달용 data
    const data = new FormData()
    data.append("personnel", accPersonnel)
    data.append("start_time", accStartTime)
    data.append("end_time", accEndTime)
    data.append("content", accContent)

    return data
}

// 방금 작성한 동행구하기 글 목록에 추가하기
function addNewAccompany(accompanyData) {
    const accompanyList = document.getElementById("accompanyList")

    const grayBox = document.createElement("div")
    grayBox.setAttribute("class", "ac-gray-box")
    
    const purpleBox = document.createElement("div")
    purpleBox.setAttribute("class", "ac-purple-box")

    const row1InPurple = document.createElement("div")
    row1InPurple.setAttribute("class", "ac-row1-in-purple")

    // 닉네임
    const nicknameBox = document.createElement("div")
    nicknameBox.setAttribute("class", "ac-nickname-box")
    nicknameBox.innerText = accompanyData.nickname
    row1InPurple.appendChild(nicknameBox)

    // 목표 인원
    const goalNumber = document.createElement("div")
    goalNumber.setAttribute("class", "ac-goal-number")
    goalNumber.innerText = "목표인원 "
    const personnel = document.createElement("span")
    personnel.setAttribute("id", "personnel")
    personnel.innerText = `${accompanyData.personnel}명`
    goalNumber.appendChild(personnel)
    row1InPurple.appendChild(goalNumber)

    // 동행시간
    const setDate = document.createElement("div")
    setDate.setAttribute("class", "ac-set-date")
    setDate.innerText = "동행시간 "
    const time = document.createElement("span")
    time.setAttribute("id", "timeView")
    time.innerText = `${accompanyData.start_time.split("T")[0]} ${accompanyData.start_time.split("T")[1].slice(0,5)} ~ ${accompanyData.end_time.split("T")[0]} ${accompanyData.end_time.split("T")[1].slice(0,5)}`
    setDate.appendChild(time)
    row1InPurple.appendChild(setDate)
    purpleBox.appendChild(row1InPurple)

    const row2InPurple = document.createElement("div")
    row2InPurple.setAttribute("class", "ac-row2-in-purple")

    // 이런 분을 구합니다!
    const accompanyContent = document.createElement("div")
    accompanyContent.setAttribute("class", "ac-accompany-content")
    const contentHeader = document.createElement("p")
    contentHeader.setAttribute("class", "ac-content-header")
    contentHeader.innerText = "이런 분을 구합니다!"
    accompanyContent.appendChild(contentHeader)

    const contentBody = document.createElement("p")
    contentBody.innerText = accompanyData.content
    accompanyContent.appendChild(contentBody)

    row2InPurple.appendChild(accompanyContent)
    purpleBox.appendChild(row2InPurple)

    const row3InPurple = document.createElement("div")
    row3InPurple.setAttribute("class", "ac-row3-in-purple")

    // 동행글 최종 수정일
    const dateInfo = document.createElement("div")
    dateInfo.setAttribute("class", "ac-date-info")
    const span1 = document.createElement("span")
    span1.innerText = "최종 수정일"
    dateInfo.appendChild(span1)
    const span2 = document.createElement("span")
    span2.innerText = accompanyData.updated_at.split("T")[0]
    dateInfo.appendChild(span2)
    row3InPurple.appendChild(dateInfo)

    // 동행신청, 수정, 삭제 버튼
    const btngroup = document.createElement("div")
    btngroup.setAttribute("class", "ac-btn-group")
    // 동행신청 버튼
    const accApplyBtn = document.createElement("button")
    accApplyBtn.setAttribute("type", "button")
    accApplyBtn.setAttribute("class", "acc-apply-btn")
    accApplyBtn.innerText = "동행신청"
    btngroup.appendChild(accApplyBtn)
    if (payload) {
        if (payloadParse.user_id == accompanyData.user){
            // 수정 버튼
            const accUpdateBtn = document.createElement("button")
            accUpdateBtn.setAttribute("type", "button")
            accUpdateBtn.setAttribute("class", "acc-update-btn")
            accUpdateBtn.innerText = "수정"
            accUpdateBtn.addEventListener("click", function () {
                if (isEditingAccompany) {
                    alert("수정하고 있는 글을 저장 또는 취소 후 클릭하십시오.")
                } else {
                    updateAccompany(grayBox, accompanyData)
                }
            })
            btngroup.appendChild(accUpdateBtn)

            // 삭제 버튼
            const accDeleteBtn = document.createElement("button")
            accDeleteBtn.setAttribute("type", "button")
            accDeleteBtn.setAttribute("class", "acc-delete-btn")
            accDeleteBtn.innerText = "삭제"
            accDeleteBtn.addEventListener("click", function () {
                deleteAccompany(grayBox, accompanyData)
            })
            btngroup.appendChild(accDeleteBtn)
        }
    }
    row3InPurple.appendChild(btngroup)
    purpleBox.appendChild(row3InPurple)     
    grayBox.appendChild(purpleBox)
    accompanyList.prepend(grayBox)
}