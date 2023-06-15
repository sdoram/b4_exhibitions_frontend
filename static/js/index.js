console.log('index 연결')

// 좋아요 하트 관련 코드
let full_heart = false;
function heart() {
    const heartElement = document.querySelector('#heart');
    if (!full_heart) {
    heartElement.style.backgroundImage = 'url("../static/img/filled-heart.png")';
    alert("좋아요!");
    } else {
    heartElement.style.backgroundImage = 'url("../static/img/empty-heart.png")';
    alert("좋아요 취소!");
    }
    full_heart = !full_heart;
}