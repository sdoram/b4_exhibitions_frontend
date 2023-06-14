console.log('navbar 연결')

import { frontendBaseURL, payload } from "./api.js";

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
        myPage.setAttribute("class", "text-warning ms-5 me-5 btn btn-light shadow-warning material-symbols-outlined");
        myPage.innerText = "person 내 정보";
        myPage.setAttribute("href", `${frontendBaseURL}/templates/my-page.html`);

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

injectNavbar();