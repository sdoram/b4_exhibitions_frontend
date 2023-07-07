import { frontendBaseURL, payloadParse, postExhibitionAPI, putExhibitionAPI, getExhibitionAPI } from "./api.js";

function checkAdminBackOfficePosting() {
    if (!payloadParse || !payloadParse.is_admin) {
        alert("관리자만 전시를 등록할 수 있습니다.")
        window.location.replace(`${frontendBaseURL}/`)
    }
}

checkAdminBackOfficePosting()

// 게시글 작성 정보 가져오기
function exhibitionInPutInfo() {
    const exhibitionCategory = document.getElementById("exhibitionCategory").value;
    const exhibitionTitle = document.getElementById('exhibitionTitle').value;
    const exhibitionLocation = document.getElementById('exhibitionLocation').value;
    const exhibitionStartDate = document.getElementById('exhibitionStartDate').value;
    const exhibitionEndDate = document.getElementById('exhibitionEndDate').value;
    const exhibitionImage = document.getElementById('exhibitionImage').files[0];
    const exhibitionContent = document.getElementById('exhibitionContent').value;
    const exhibitionService = document.getElementById('exhibitionService').value;
    const exhibitionURL = document.getElementById('exhibitionURL').value;

    // API 전달용 data
    const data = new FormData();
    data.append("category", exhibitionCategory)
    data.append("info_name", exhibitionTitle)
    data.append("location", exhibitionLocation)
    data.append("start_date", exhibitionStartDate)
    data.append("end_date", exhibitionEndDate)
    if (exhibitionImage) {
        data.append("image", exhibitionImage)
    }
    data.append("content", exhibitionContent)
    data.append("svstatus", exhibitionService)
    data.append("direct_url", exhibitionURL)

    return data
}

function handleExhibitionPosting() {
    postExhibitionAPI(exhibitionInPutInfo()).then(({ response, responseJson }) => {
        if (response.status == 201) {
            alert(responseJson.message);
            window.location.replace(`${frontendBaseURL}/templates/exhibition-detail.html?exhibition_id=${responseJson.data.id}`)
        } else {
            alert(responseJson.detail && "관리자만 전시를 등록할 수 있습니다."
                || responseJson.message);
        }
    });
}

function handleExhibitionPut(exhibition_id) {
    putExhibitionAPI(exhibition_id, exhibitionInPutInfo()).then(({ response, responseJson }) => {
        if (response.status == 200) {
            alert('수정했습니다');
            window.location.replace(`${frontendBaseURL}/templates/exhibition-detail.html?exhibition_id=${exhibition_id}`)
        } else {
            alert(responseJson.detail && "관리자만 전시를 수정할 수 있습니다."
                || responseJson.message);
        }
    });
}


// 수정하기인지 작성하기인지 판단하기
const URLParams = new URL(location.href).searchParams;
if (URLParams.get('exhibition_id')) {
    window.onload = function () {
        const exhibition_id = new URLSearchParams(window.location.search).get("exhibition_id")

        getExhibitionAPI(exhibition_id).then(({ response, responseJson }) => {
            const exhibitionInfo = responseJson
            document.getElementById("exhibitionCategory").value = exhibitionInfo.category
            document.getElementById('exhibitionTitle').value = exhibitionInfo.info_name
            document.getElementById('exhibitionLocation').value = exhibitionInfo.location
            document.getElementById('exhibitionStartDate').value = exhibitionInfo.start_date
            document.getElementById('exhibitionEndDate').value = exhibitionInfo.end_date
            document.getElementById('exhibitionService').value = exhibitionInfo.svstatus
            document.getElementById('exhibitionURL').value = exhibitionInfo.direct_url
            document.getElementById('exhibitionContent').value = exhibitionInfo.content
            // 이미지 문제 해결 필요 
            // document.getElementById('exhibitionImage').files[0] = exhibitionInfo.image
            // const exhibitionImage = document.getElementById('exhibitionImage')
        })
    }
    document.getElementById("exhibitionPutButton").addEventListener("click", function () {
        handleExhibitionPut(URLParams.get('exhibition_id'))
    }
    );
    // 전시회 수정, 등록 전환 
    document.getElementById("exhibitionPostingButton").style.display = "none";
    document.getElementById("welcomeTitle").innerText = '전시회 수정하기'
} else {
    document.getElementById("exhibitionPostingButton").addEventListener("click", handleExhibitionPosting);
    document.getElementById("exhibitionPutButton").style.display = "none";
}
