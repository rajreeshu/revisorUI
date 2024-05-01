var TOKEN_DATA = 'Bearer '+getCookie("auth");

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = name+'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


function checkCookieAndRedirect(cookieName, redirectTo="") {
    const cookieValue = getCookie(cookieName);
    let isExpired = false;
    console.log(cookieValue);
    // return;
    //check if cookie is a valid cookie using backend
    fetch(`${BASE_URL_SERVER}/auth/validateToken`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': TOKEN_DATA
        }
    })
        .then(response => {
            if (!response.ok) {
                console.error('Error status:', response.status);
                return response.text().then(text => { throw new Error(text) });
            }
            // if(response="") return {};
            console.log(response);
            return response.json();
        })
        .then(data => {
            console.log(data);
            isExpired = true;
        }).catch(err => {
            console.error('Error:', err);
            window.location.href = redirectTo;
        });

    
    if (!isExpired) {
        console.log('Expired Token Redirecting',isExpired);
        // window.location.href = redirectTo;
    }
}