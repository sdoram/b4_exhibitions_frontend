console.log('exhibition-posting 연결')

import { exhibitionPostingAPI, frontendBaseURL } from "./api.js";

function handleExhibitionPosting() {
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
    data.append("image", exhibitionImage || '')
    data.append("content", exhibitionContent)
    data.append("svstatus", exhibitionService)
    data.append("direct_url", exhibitionURL)


    exhibitionPostingAPI(data).then(({ response, responseJson }) => {
        if (response.status == 201) {
            console.log(responseJson.data)
            alert(responseJson.message);
            window.location.replace(`${frontendBaseURL}/templates/exhibition-detail.html?exhibition_id=${responseJson.data.id}`)
        } else {
            alert(responseJson.message);
            console.log(response.status);
        }
    });

}

document.getElementById("exhibitionPostingButton").addEventListener("click", handleExhibitionPosting);
