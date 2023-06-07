console.log('navbar 연결')

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
}

injectNavbar();