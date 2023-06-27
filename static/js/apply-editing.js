import { putApplyAPI } from "./api.js";
import { deleteApply } from "./accompany.js";

// 수정 버튼 눌렀을 때 실행되는 함수
export function updateApply(applyBox, applyData) {
    // 저도 같이 갈래요!
    let applyTextElement = applyBox.querySelector(".applier-accompany-content")
    const applyText = applyData.content
    let textareaElement = applyBox.querySelector(".applier-accompany-content-textarea")

    if (!textareaElement) {
        textareaElement = document.createElement("textarea")
        textareaElement.setAttribute("class", "applier-accompany-content-textarea")
        applyTextElement.parentNode.appendChild(textareaElement)
    }
    textareaElement.innerText = applyText
    textareaElement.style.display = "block"
    applyTextElement.style.display = "none"

    // 수정 버튼을 저장 버튼으로 변경
    let saveBtn = applyBox.querySelector(".applier-acc-update-btn")
    saveBtn.innerText = "저장"
    saveBtn = removeExistingListeners(saveBtn, "click")

    // 삭제 버튼을 취소 버튼으로 변경
    let cancelBtn = applyBox.querySelector(".applier-acc-delete-btn")
    cancelBtn.innerText = "취소"
    cancelBtn = removeExistingListeners(cancelBtn, "click")

    saveBtn.onclick = (event) => {
        event.preventDefault()

        const newAppContent = textareaElement.value

        // API 전달용 data
        const data = new FormData()
        data.append("content", newAppContent)     

        putApplyAPI(applyData.id, data).then(({ response, responseJson }) => {
            if (response.status == 200) {
                alert(responseJson.message)
                // 수정된 리뷰 내용 보이게 하고 텍스트상자는 없애기
                applyTextElement.innerText = newAppContent
                applyTextElement.style.display = "block"
                textareaElement.style.display = "none"

                // 저장->수정, 취소->삭제
                saveBtn.innerText = "수정"
                saveBtn.onclick = function () {
                    updateApply(applyBox, responseJson.data)
                  
                }
                cancelBtn.innerText = "삭제"
                cancelBtn.onclick = function () {
                    deleteApply(applyBox, responseJson.data)
                }
            } else {
                alert(responseJson.content && "내용없이 글을 작성할 수 없습니다.")
                textareaElement.style.display = "block"
            }            
        })
    }

    cancelBtn.onclick = (event) => {
        event.preventDefault()
        // 내용 되돌리기
        applyTextElement.style.display = "block"
        textareaElement.style.display = "none"

        // 버튼 되돌리기
        saveBtn.innerText = "수정"
        saveBtn.onclick = function () {
            updateApply(applyBox, applyData)
        }
        cancelBtn.innerText = "삭제"
        cancelBtn.onclick = function () {
            deleteApply(applyBox, applyData)
        }
    }
}

// 수정<->저장, 삭제<->취소 버튼 변환 시 필요한 코드
function removeExistingListeners(element, eventName) {
  let newElement = element.cloneNode(true)
  element.replaceWith(newElement)
  return newElement
}