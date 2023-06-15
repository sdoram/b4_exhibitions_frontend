console.log('index 연결')

// 좋아요 하트 관련 코드
let fullHeart = false;
function heart() {
    const heartElement = document.querySelector('#heart');
    if (!fullHeart) {
    heartElement.style.backgroundImage = 'url("../static/img/filled-heart.png")';
    } else {
    heartElement.style.backgroundImage = 'url("../static/img/empty-heart.png")';
    }
    fullHeart = !fullHeart;
}