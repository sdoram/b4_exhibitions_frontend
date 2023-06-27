import { putAccompanyAPI } from "./api.js";
import { deleteAccompany } from "./accompany.js";

export let isEditingAccompany = false;

//----------------------------------------------------------------수정----------------------------------------------------------------
// 수정<->저장, 삭제<->취소 버튼 변환 시 필요한 코드
function removeExistingListeners(element, eventName) {
  let newElement = element.cloneNode(true)
  element.replaceWith(newElement)
  return newElement
}

// 수정 버튼 눌렀을 때 실행되는 함수
export function updateAccompany(accompanyBox, accompanyData) {
    isEditingAccompany = true
    // 동행구하기 작성창 연 채로 수정 버튼 눌렀을 때 작성창 닫아주는 코드
    const accompanyPostBox = document.getElementById("accompanyPostBox")
    if (accompanyPostBox) {
        accompanyPostBox.parentElement.removeChild(accompanyPostBox)
    }
    // 동행구하기 버튼 다시 생기게 하기
    const showAcPosting = document.querySelector(".show-ac-posting")
    showAcPosting.style.display = "block"
    
    // 목표 인원
    let goalNumberElement = accompanyBox.querySelector(".ac-goal-number")
    const originPersonnel = accompanyData.personnel
    let personnel = accompanyBox.querySelector("#personnel")
    let personnelInputBox = accompanyBox.querySelector(".ap-goal-num")

    if (!personnelInputBox) {
        personnelInputBox = document.createElement("input")
        personnelInputBox.setAttribute("type", "number")
        personnelInputBox.setAttribute("class", "ap-goal-num")
        goalNumberElement.appendChild(personnelInputBox)

    }
    personnelInputBox.value = originPersonnel
    personnelInputBox.style.display = ""
    personnel.style.display = "none"

    // 인풋박스 옆에 '명' 글자 추가
    let nameElement = document.createElement("span")
    nameElement.textContent = "명"
    goalNumberElement.appendChild(nameElement)

    // 동행시간
    let setDateElement = accompanyBox.querySelector(".ac-set-date")
    setDateElement.setAttribute("style", "font-size:1.5vmin;")

    let startBox = accompanyBox.querySelector("#apStartTime") || false
    let endBox = accompanyBox.querySelector("#apEndTime") || false
    let originTime = accompanyBox.querySelector("#timeView")

    if (!startBox && !endBox) {
        startBox = document.createElement("input")
        startBox.setAttribute("type", "datetime-local")
        startBox.setAttribute("id", "apStartTime")
        startBox.setAttribute("style", "font-size:1.5vmin;")
        startBox.value = accompanyData.start_time
        setDateElement.appendChild(startBox)
        let wave = document.createElement("span")
        wave.innerText = " ~ "
        setDateElement.appendChild(wave)
        endBox = document.createElement("input")
        endBox.setAttribute("type", "datetime-local")
        endBox.setAttribute("id", "apEndTime")
        endBox.setAttribute("style", "font-size:1.5vmin;")
        endBox.value = accompanyData.end_time
        setDateElement.appendChild(endBox)
    }
    originTime.style.display = "none"

    // 이런 분을 구합니다!
    let accompanyTextElement = accompanyBox.querySelector(".ac-accompany-content")
    const accompanyText = accompanyData.content
    let textareaElement = accompanyBox.querySelector(".ac-accompany-content-textarea")

    if (!textareaElement) {
        textareaElement = document.createElement("textarea")
        textareaElement.setAttribute("class", "ac-accompany-content-textarea")
        accompanyTextElement.parentNode.appendChild(textareaElement)
    }

    textareaElement.innerText = accompanyText
    textareaElement.style.display = "block"
    accompanyTextElement.style.display = "none"
   
    // 수정 버튼을 저장 버튼으로 변경
    let saveBtn = accompanyBox.querySelector(".acc-update-btn")
    saveBtn.innerText = "저장"
    saveBtn = removeExistingListeners(saveBtn, "click")

    // 삭제 버튼을 취소 버튼으로 변경
    let cancelBtn = accompanyBox.querySelector(".acc-delete-btn")
    cancelBtn.innerText = "취소"
    cancelBtn = removeExistingListeners(cancelBtn, "click")

    saveBtn.onclick = (event) => {
        event.preventDefault()

        const newPersonnel = personnelInputBox.value
        const newAcContent = textareaElement.value
        const newStartTime = startBox.value
        const newEndTime = endBox.value

        // API 전달용 data
        const data = new FormData()
        data.append("personnel", newPersonnel)
        data.append("content", newAcContent)
        data.append("start_time", newStartTime)
        data.append("end_time", newEndTime)        

        putAccompanyAPI(accompanyData.id, data).then(({ response, responseJson }) => {
            if (response.status == 200) {
                alert(responseJson.message)
                // 수정된 목표인원 보이게 하고 인풋박스는 없애기
                personnel.innerText = `${responseJson.data.personnel}명`
                personnel.style.display = ""
                goalNumberElement.removeChild(personnelInputBox)
                goalNumberElement.removeChild(nameElement)

                // 수정된 동행시간 보이게 하고 원래 요소는 없애기
                originTime.style.display = ""
                originTime.innerText = `${responseJson.data.start_time.split("T")[0]} ${responseJson.data.start_time.split("T")[1].slice(0,5)} ~ ${responseJson.data.end_time.split("T")[0]} ${responseJson.data.end_time.split("T")[1].slice(0,5)}`
                setDateElement.removeChild(startBox)
                setDateElement.removeChild(endBox)
                setDateElement.removeChild(setDateElement.lastChild)       
                setDateElement.setAttribute("style", "font-size:2vmin;")

                // 수정된 리뷰 내용 보이게 하고 텍스트상자는 없애기
                accompanyTextElement.innerText = newAcContent
                accompanyTextElement.style.display = "block"
                textareaElement.style.display = "none"

                // 저장->수정, 취소->삭제
                saveBtn.innerText = "수정"
                saveBtn.onclick = function () {
                    if (isEditingAccompany) {
                        alert("수정하고 있는 글을 저장 또는 취소 후 클릭하십시오.")
                    } else {
                        isEditingAccompany = true
                        updateAccompany(accompanyBox, responseJson.data)
                    }                    
                }
                cancelBtn.innerText = "삭제"
                cancelBtn.onclick = function () {
                    deleteAccompany(accompanyBox, responseJson.data)
                }
            } else {
                alert(responseJson.content && "내용없이 글을 작성할 수 없습니다."
                    || responseJson.personnel && "목표인원을 1명 이상 선택하십시오."
                    || responseJson.start_time && "시작 시간을 설정하십시오."
                    || responseJson.end_time && "종료 시간을 설정하십시오."
                    || responseJson.non_field_errors)
                textareaElement.style.display = "block"
            }            
        })
        isEditingAccompany = false // 수정 중인 상태가 아닌 것으로 변경
    }

    cancelBtn.onclick = (event) => {
        event.preventDefault()
        // 목표인원 되돌리기
        personnel.style.display = ""
        goalNumberElement.removeChild(personnelInputBox)
        goalNumberElement.removeChild(nameElement)

        // 동행시간 되돌리기
        originTime.style.display = ""
        setDateElement.removeChild(startBox)
        setDateElement.removeChild(endBox)
        setDateElement.removeChild(setDateElement.lastChild)    
        setDateElement.setAttribute("style", "font-size:2vmin;")

        // 내용 되돌리기
        accompanyTextElement.style.display = "block"
        textareaElement.style.display = "none"

        // 버튼 되돌리기
        saveBtn.innerText = "수정"
        saveBtn.onclick = function () {
            if (isEditingAccompany) {
                alert("수정하고 있는 글을 저장 또는 취소 후 클릭하십시오.")
            } else {
                isEditingAccompany = true
                updateAccompany(accompanyBox, accompanyData)
            }
        }
        cancelBtn.innerText = "삭제"
        cancelBtn.onclick = function () {
            deleteAccompany(accompanyBox, accompanyData)
        }

        isEditingAccompany = false // 수정 중인 상태가 아닌 것으로 변경
    }
}