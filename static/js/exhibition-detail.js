console.log('exhibition-detail 연결')

import { getExhibitionAPI } from "./api.js";

window.onload = function loadExhibition() {
    // url 객체 생성 후 exhibition_id 값 추출 
    const exhibition_id = new URLSearchParams(window.location.search).get("exhibition_id")
    getExhibitionAPI(exhibition_id).then(({ response, responseJson }) => {
        const exhibitionDATA = responseJson
        console.log(exhibitionDATA)
    })
}