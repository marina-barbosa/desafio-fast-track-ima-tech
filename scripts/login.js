const inputName = document.querySelector('#signupName');
const inputEmail = document.querySelector('#signupEmail');
const inputPass = document.querySelector('#signupPassword');
const signUpButton = document.querySelector('#signUpButton');

let validName = false;
let validEmail = false;
let validPass = false;

const msgFeedback = document.querySelector('#msgFeedback');


const loginEmail = document.querySelector('#loginEmail');
const loginPass = document.querySelector('#loginPassword');
const signInButton = document.querySelector('#signInButton');

let validLoginEmail = false;
let validLoginPass = false;

const feedbackSignIn = document.querySelector('#feedbackSignIn');




// #############################
//      VALIDATION SIGN UP
// #############################

inputName.addEventListener('keyup', () => {
    if (inputName.value.trim().length < 3) {
        inputName.style.border = '1px solid red';
        inputName.style.boxShadow = '0 0 5px red';
        validName = false;
    } else {
        inputName.style.border = '1px solid var(--verde-l)';
        inputName.style.boxShadow = '0 0 10px var(--verde-l)';
        validName = true;
    }
})
inputEmail.addEventListener('keyup', () => {
    if (inputEmail.value.trim().length < 5) {
        inputEmail.style.border = '1px solid red';
        inputEmail.style.boxShadow = '0 0 5px red';
        validEmail = false;
    } else {
        inputEmail.style.border = '1px solid var(--verde-l)';
        inputEmail.style.boxShadow = '0 0 10px var(--verde-l)';
        validEmail = true;
    }
})
inputPass.addEventListener('keyup', () => {
    if (inputPass.value.trim().length < 4) {
        inputPass.style.border = '1px solid red';
        inputPass.style.boxShadow = '0 0 5px red';
        validPass = false;
    } else {
        inputPass.style.border = '1px solid var(--verde-l)';
        inputPass.style.boxShadow = '0 0 10px var(--verde-l)';
        validPass = true;
    }
})

function checkEmail(email) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    );
}




// #############################
//           SIGN UP
// #############################

const signUp = () => {
    if (!validName || !validEmail || !validPass) {
        msgFeedback.classList.remove('d-none');
        msgFeedback.classList.add('alert-danger');
        msgFeedback.innerHTML = 'Por favor, insira dados válidos.';
        return;
    } else if (localStorage.getItem(inputEmail.value)) {
        inputEmail.style.border = '1px solid red';
        inputEmail.style.boxShadow = '0 0 5px red';
        msgFeedback.classList.remove('d-none');
        msgFeedback.classList.add('alert-danger');
        msgFeedback.innerHTML = 'Este e-mail já está sendo usado.';
        return;
    } else {
        msgFeedback.classList.remove('alert-danger');
        msgFeedback.classList.remove('d-none');
        msgFeedback.classList.add('alert-success');
        msgFeedback.innerHTML = 'Conta criada com sucesso!';

        const newUser = {
            name: inputName.value,
            email: inputEmail.value,
            password: inputPass.value,
            tasks: []
        };

        localStorage.setItem(inputEmail.value, JSON.stringify(newUser));

        sessionStorage.setItem('emailSession', inputEmail.value);
    }

    setTimeout(() => {
        window.location.href = 'task-manager.html';
    }, 2000);

}


// #############################
//      VALIDATION LOGIN
// #############################

loginEmail.addEventListener('keyup', () => {
    if (loginEmail.value.trim().length < 5) {
        loginEmail.style.border = '1px solid red';
        loginEmail.style.boxShadow = '0 0 5px red';
        validLoginEmail = false;
    } else {
        loginEmail.style.border = '1px solid var(--verde-l)';
        loginEmail.style.boxShadow = '0 0 10px var(--verde-l)';
        validLoginEmail = true;
    }
})
loginPass.addEventListener('keyup', () => {
    if (loginPass.value.trim().length < 4) {
        loginPass.style.border = '1px solid red';
        loginPass.style.boxShadow = '0 0 5px red';
        validLoginPass = false;
    } else {
        loginPass.style.border = '1px solid var(--verde-l)';
        loginPass.style.boxShadow = '0 0 10px var(--verde-l)';
        validLoginPass = true;
    }
})


// #############################
//           SIGN IN
// #############################




const signIn = () => {    

    if (!validLoginEmail || !validLoginPass) {        
        feedbackSignIn.classList.remove('d-none');
        feedbackSignIn.classList.add('alert-danger');
        feedbackSignIn.innerHTML = 'Por favor, insira dados válidos.';        
        return;
    }

    if (!localStorage.getItem(loginEmail.value)) {
        loginEmail.style.border = '1px solid red';
        loginEmail.style.boxShadow = '0 0 5px red';
        feedbackSignIn.classList.remove('d-none');
        feedbackSignIn.classList.add('alert-danger');
        feedbackSignIn.innerHTML = 'E-mail não cadastrado.';        
        return;
    }

    const userData = JSON.parse(localStorage.getItem(loginEmail.value));
    if (userData.password !== loginPass.value) {
        loginPass.style.border = '1px solid red';
        loginPass.style.boxShadow = '0 0 5px red';
        feedbackSignIn.classList.remove('d-none');
        feedbackSignIn.classList.add('alert-danger');
        feedbackSignIn.innerHTML = 'Senha incorreta.';        
        return;
    }

    sessionStorage.setItem('emailSession', loginEmail.value);

    window.location.href = 'task-manager.html';
}


signUpButton.addEventListener('click', signUp);
signInButton.addEventListener('click', signIn);

inputPass.addEventListener('keyup', function (event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
        signUp();
    }
});

loginPass.addEventListener('keyup', function (event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
        signIn();
    }
});


