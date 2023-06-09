console.log('signup 연결')

async function handleSignUp() {
    console.log('회원가입 버튼')
    const email = document.getElementById("email").value;
    const nickname = document.getElementById("nickname").value;
    const password = document.getElementById("password").value;
    const gender = document.getElementById("gender").value;
    console.log(email, nickname, gender, password)

    const response = await fetch(`${backendBaseUrl}/users/signup/`, {
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            "email": email,
            "nickname": nickname,
            "password": password,
            "gender": gender
        })
    });
    console.log(response)
    if (response.status == 201) {
        alert("회원가입 성공")
        window.location.replace(`${frontendBaseUrl}/templates/signin.html`)
    } else {
        alert(response.status)
    }
}