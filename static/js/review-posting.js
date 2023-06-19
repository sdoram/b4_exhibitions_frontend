
// 웹페이지의 DOM이 모두 로드 되기까지 기다리는 코드
document.addEventListener('DOMContentLoaded', function () {
// 각 별의 id를 가진 배열 생성
const starIds = ['star1', 'star2', 'star3', 'star4', 'star5'];

// 공통 함수: 별 채우기
function fillStars(n) {
    for (let i = 0; i < starIds.length; i++) {
        const star = document.getElementById(starIds[i]);
        if (i < n) {
        star.setAttribute('src', '../static/img/filled-star.png');
        } else {
        star.setAttribute('src', '../static/img/empty-star.png');
        }
    }
}

// 각각의 onclick 함수 정의
function fill_star1() {
    fillStars(1);
}

function fill_star2() {
    fillStars(2);
}

function fill_star3() {
    fillStars(3);
}

function fill_star4() {
    fillStars(4);
}

function fill_star5() {
    fillStars(5);
}

// onclick 이벤트 리스너를 이미지에 연결
document.getElementById('star1').onclick = fill_star1;
document.getElementById('star2').onclick = fill_star2;
document.getElementById('star3').onclick = fill_star3;
document.getElementById('star4').onclick = fill_star4;
document.getElementById('star5').onclick = fill_star5;
});