console.log('accompany 연결')

import { getAccompanyAPI, payload, payloadParse } from "./api.js";
import { accompanyPosting } from "./accompany-posting.js";

var isAccompaniesRendered = false;

// 동행구하기 버튼 눌렀을 때 실행되는 함수
export function accompany(exhibition_id){
    // 후기 안 보이게 하기
    var rvAllItemsOrganizer = document.querySelector(".rv-all-items-organizer");
    rvAllItemsOrganizer.style.display = "none";    
        
    var acAllItemsOrganizer = document.querySelector(".ac-all-items-organizer");
    if (acAllItemsOrganizer.style.display === "none") {
        acAllItemsOrganizer.style.display = "flex";
        // 후기 작성창 연 채로 동행글 보기 눌렀을 때 작성창 닫아주는 코드
        const reviewPostBox = document.getElementById("reviewPostBox")
        if (reviewPostBox) {
            reviewPostBox.parentElement.removeChild(reviewPostBox)
        }
        // 동행구하기 버튼 생성
        if (payload) {
            const accompanyList = document.getElementById("accompanyList")
            const accompanyPostingBtn = document.createElement("button")
            accompanyPostingBtn.setAttribute("class", "show-ac-posting")
            accompanyPostingBtn.setAttribute("id", "accompanyPostingBtn")
            accompanyPostingBtn.innerText = "동행 구하기"
            accompanyPostingBtn.addEventListener("click", function () {
                accompanyPosting(exhibition_id);  
            });
            accompanyList.appendChild(accompanyPostingBtn)
            // 사라졌던 후기 작성하기 버튼 다시 보이게 하기
            var showAcPosting = document.querySelector(".show-ac-posting");
            showAcPosting.style.display = "block";
        }
        if (!isAccompaniesRendered) {
            getAccompanyAPI(exhibition_id).then(({ responseJson }) => {
                const accompaniesDATA = responseJson.accompanies.results
                console.log(accompaniesDATA)

                const accompanyList = document.getElementById("accompanyList")

                // 동행 구하기 목록
                accompaniesDATA.forEach(accompany => {          
                    const grayBox = document.createElement("div")
                    grayBox.setAttribute("class", "gray-box")
                    
                    const purpleBox = document.createElement("div")
                    purpleBox.setAttribute("class", "purple-box")

                    const row1InPurple = document.createElement("div")
                    row1InPurple.setAttribute("class", "row1-in-purple")

                    // 닉네임
                    const nicknameBox = document.createElement("div")
                    nicknameBox.setAttribute("class", "nickname")
                    nicknameBox.innerText = accompany.nickname
                    row1InPurple.appendChild(nicknameBox)

                    // 목표 인원
                    const goalNumber = document.createElement("div")
                    goalNumber.setAttribute("class", "goal-number")
                    goalNumber.innerText = "목표인원 "
                    const personnel = document.createElement("span")
                    personnel.innerText = `${accompany.personnel}명`
                    goalNumber.appendChild(personnel)
                    row1InPurple.appendChild(goalNumber)
                    
                    // 동행시간
                    const setDate = document.createElement("div")
                    setDate.setAttribute("class", "set-date")
                    setDate.innerText = "동행시간 "
                    const time = document.createElement("span")
                    time.innerText = `${accompany.start_time.split("T")[0]} ${accompany.start_time.split("T")[1].slice(0,5)} ~ ${accompany.end_time.split("T")[0]} ${accompany.end_time.split("T")[1].slice(0,5)}`
                    setDate.appendChild(time)
                    row1InPurple.appendChild(setDate)
                    purpleBox.appendChild(row1InPurple)

                    const row2InPurple = document.createElement("div")
                    row2InPurple.setAttribute("class", "row2-in-purple")

                    // 이런 분을 구합니다!
                    const accompanyContent = document.createElement("div")
                    accompanyContent.setAttribute("class", "accompany-content")
                    const contentHeader = document.createElement("p")
                    contentHeader.setAttribute("class", "content-header")
                    contentHeader.innerText = "이런 분을 구합니다!"
                    accompanyContent.appendChild(contentHeader)

                    const contentBody = document.createElement("p"); // 새로운 p 태그 추가
                    contentBody.innerText = accompany.content; // 이 부분 변경
                    accompanyContent.appendChild(contentBody); // 새로운 p 태그 추가

                    row2InPurple.appendChild(accompanyContent)
                    purpleBox.appendChild(row2InPurple)

                    const row3InPurple = document.createElement("div")
                    row3InPurple.setAttribute("class", "row3-in-purple")

                    // 동행글 최종 수정일
                    const dateInfo = document.createElement("div")
                    dateInfo.setAttribute("class", "date-info")
                    const span1 = document.createElement("span")
                    span1.innerText = "최종 수정일"
                    dateInfo.appendChild(span1)
                    const span2 = document.createElement("span")
                    span2.innerText = accompany.updated_at.split("T")[0]
                    dateInfo.appendChild(span2)
                    row3InPurple.appendChild(dateInfo)

                    // 동행신청, 수정, 삭제 버튼
                    const btngroup = document.createElement("div")
                    btngroup.setAttribute("class", "btn-group")
                    // 동행신청 버튼
                    const accApplyBtn = document.createElement("button")
                    accApplyBtn.setAttribute("type", "button")
                    accApplyBtn.setAttribute("class", "acc-apply-btn")
                    accApplyBtn.innerText = "동행신청"
                    btngroup.appendChild(accApplyBtn)
                    if (payload) {
                        if (payloadParse.user_id == accompany.user){
                            // 수정 버튼
                            const accUpdateBtn = document.createElement("button")
                            accUpdateBtn.setAttribute("type", "button")
                            accUpdateBtn.setAttribute("class", "acc-update-btn")
                            accUpdateBtn.innerText = "수정"
                            btngroup.appendChild(accUpdateBtn)

                            // 삭제 버튼
                            const accDeleteBtn = document.createElement("button")
                            accDeleteBtn.setAttribute("type", "button")
                            accDeleteBtn.setAttribute("class", "acc-delete-btn")
                            accDeleteBtn.innerText = "삭제"
                            btngroup.appendChild(accDeleteBtn)
                        }
                    }
                    row3InPurple.appendChild(btngroup)
                    purpleBox.appendChild(row3InPurple)     
                    grayBox.appendChild(purpleBox)       

                    // 동행 신청하기 댓글
                    console.log(accompany.applies)
                    if (accompany.applies) {
                        accompany.applies.forEach(apply => {
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
                            applierNickname.innerText = apply.nickname
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

                            const applierContent = document.createElement("p"); // 새로운 p 태그 추가
                            applierContent.innerText = apply.content; // 이 부분 변경
                            applierAccompanyContent.appendChild(applierContent); // 새로운 p 태그 추가

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
                            applierSpan2.innerText = apply.updated_at.split("T")[0]
                            applierDateInfo.appendChild(applierSpan2)
                            applierRow3InPurple.appendChild(applierDateInfo)

                            // 수정, 삭제 버튼
                            if (payload) {
                                if (payloadParse.user_id == apply.user){
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
                                    applierAccDeleteBtn.innerText = "삭제"
                                    applierRow3InPurple.appendChild(applierAccDeleteBtn)
                                }
                            }
                            applierPurpleBox.appendChild(applierRow3InPurple)
                            applierAll.appendChild(applierPurpleBox)
                            grayBox.appendChild(applierAll)
                        })                
                    }            
                    accompanyList.appendChild(grayBox)
                })
            })
        isAccompaniesRendered = true;
        }
    } else {
        acAllItemsOrganizer.style.display = "none";
        // 동행구하기 작성창 연 채로 동행글 보기 눌렀을 때 작성창 닫아주는 코드
        const accompanyPostBox = document.getElementById("accompanyPostBox")
        if (accompanyPostBox) {
            accompanyPostBox.parentElement.removeChild(accompanyPostBox)
        }      
    } 
}