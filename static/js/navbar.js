console.log('navbar 연결')

import { frontendBaseURL, payload, payloadParse } from "./api.js";

async function injectNavbar() {
    fetch("../templates/navbar.html").then(response => {
        return response.text()
    })
        .then(data => {
            document.querySelector("header").innerHTML = data;
        });
    const NavbarHTML = await fetch("../templates/navbar.html");
    const data = await NavbarHTML.text();
    document.querySelector("header").innerHTML = data;

    // 카테고리 id 기준으로 addEventListener 부여 
    for (var i = 1; i < 9; i++)
        document.getElementById(i).addEventListener("click", function () {
            selectCategory(this.value)
        })

    if (payload) {
        // 내비바 왼쪽 항목
        const navbarLeft = document.getElementById("navbarLeft");

        // 내비바 오른쪽 항목
        const navbarRight = document.getElementById("navbarRight");
        const logOutButton = document.createElement("button");
        logOutButton.setAttribute("class", "text-warning ms-5 me-5 btn btn-light shadow-warning material-symbols-outlined");
        logOutButton.innerText = "person 로그아웃";
        logOutButton.addEventListener("click", handleLogOut);

        const myPage = document.createElement("a");
        myPage.setAttribute("class", "text-warning ms-5 btn btn-light shadow-warning material-symbols-outlined");
        myPage.innerText = "person 내 정보";
        myPage.setAttribute("href", `${frontendBaseURL}/templates/my-page.html?user_id=${payloadParse.user_id}`);
        navbarRight.appendChild(myPage);
        navbarRight.appendChild(logOutButton);

        // payload 존재시 숨길 항목
        const signInButton = document.getElementById("signInButton");
        const signUpButton = document.getElementById("signUpButton");
        signInButton.style.display = "none";
        signUpButton.style.display = "none";
    }

}

// 로그아웃 함수 
function handleLogOut() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("payload");
    location.reload();
}

function selectCategory(category) {
    const URLParams = new URL(location.href).searchParams;
    const page = URLParams.get('page')
    // 페이지가 없거나 값이 null인 경우 
    if (!page || page == null) {
        console.log(`${frontendBaseURL}${window.location.pathname}?category=${category}`)
        window.location.href = `${frontendBaseURL}${window.location.pathname}?category=${category}`
    } else {
        console.log(`${frontendBaseURL}${window.location.pathname}?category=${category}&page=${page}`)
        window.location.href = `${frontendBaseURL}${window.location.pathname}?category=${category}&page=${page}`
    }
}

injectNavbar();
