





document.addEventListener('DOMContentLoaded', () => {

    elementScout('#signUpButton', signUp);
    elementScout('#signInButton', signIn);
    elementScout('#createTaskButton', createTask);
    elementScout('#delete', deleteTask);
    elementScout('#update', updateTask);
    elementScout('#mark', toggleDone);
    elementScout('.greeting', setGreeting());
    elementScout('#table-body', fillTable(), changeStatusColor());
    elementScout('#logout', limparStorage);

    
    const openModal = document.querySelectorAll('.open-modal');

    if (openModal) {
        openModal.forEach(button => {
            button.addEventListener('click', (event) => {

                const clickedRowId = event.target.closest('tr').id;
                setCurrentTask(clickedRowId);
                fillModal()
            });
        });
    } 

    const buttonsUpdate = document.querySelectorAll('.btn-update');

    if (buttonsUpdate) {
        buttonsUpdate.forEach(button => {
            button.addEventListener('click', (event) => {

                const clickedRowId = event.target.closest('tr').id;
                setCurrentTask(clickedRowId);
                fillForm(clickedRowId);
                displayButtons();
            });
        });

        toggleDoneBtn();
    }
})






// #############################
//        USEFUL
// #############################
const elementScout = (elementId, ...eventHandlers) => {
    const element = document.querySelector(elementId);
    if (element) {

        const tagName = element.tagName.toLowerCase();
        if (tagName !== 'button' && tagName !== 'a') {
            eventHandlers.forEach(handler => {
                handler;
            });
        }

        eventHandlers.forEach(handler => {
            element.addEventListener('click', handler);
        });
    }
}

const getCurrentUser = () => {
    const emailSession = sessionStorage.getItem('emailSession');
    const userData = JSON.parse(localStorage.getItem(emailSession));
    return userData;
}

const limparLocalStorage = false;
const limparStorage = () => {

    if (limparLocalStorage) {

        const keys = Object.keys(localStorage);

        keys.forEach(key => {
            localStorage.removeItem(key);
        });

        if (Object.keys(localStorage).length === 0) {
            console.log('Todas as chaves do LocalStorage foram removidas.');
        } else {
            console.log('Não foi possível remover todas as chaves do LocalStorage.');
        }
    }

}






// #############################
//           LOGIN
// #############################

const signUp = () => {
    const name = document.querySelector('#signupName').value;
    const email = document.querySelector('#signupEmail').value;
    const password = document.querySelector('#signupPassword').value;

    if (localStorage.getItem(email)) {
        alert('Este e-mail já está sendo usado.');
        return;
    }

    const newUser = {
        name: name,
        email: email,
        password: password,
        tasks: []
    };

    localStorage.setItem(email, JSON.stringify(newUser));

    sessionStorage.setItem('emailSession', email);

    alert('Conta criada com sucesso!');
    window.location.href = 'task-manager.html';
}

const signIn = () => {
    const email = document.querySelector('#loginEmail').value;
    const password = document.querySelector('#loginPassword').value;

    if (!localStorage.getItem(email)) {
        alert('E-mail não cadastrado.');
        return;
    }

    const userData = JSON.parse(localStorage.getItem(email));
    if (userData.password !== password) {
        alert('Senha incorreta.');
        return;
    }

    sessionStorage.setItem('emailSession', email);

    window.location.href = 'task-manager.html';
}






// #############################
//             TASK
// #############################

const createTask = () => {
    
    const userData = getCurrentUser();

    const title = document.querySelector('#title-task').value.trim();
    const startDate = document.querySelector('#start-date').value || getCurrentDate();
    const startTime = document.querySelector('#start-time').value || getCurrentTime();
    const endDate = document.querySelector('#end-date').value || getCurrentDate();
    const endTime = document.querySelector('#end-time').value || '23:59';
    const description = document.querySelector('#description').value.trim();

    if (description === '') {
        alert('Os campo descrição é obrigatório.');
        return;
    }

    const newTask = {
        title,
        startDate,
        startTime,
        endDate,
        endTime,
        description,
        status: "Analisando",
        done: false,
    };
    userData.tasks.push(newTask);
    localStorage.setItem(emailSession, JSON.stringify(userData));

    location.reload();
}

const setCurrentTask = (id) => {
    sessionStorage.setItem('currentTask', id);    
}

const updateTask = () => {
    
    const userData =  getCurrentUser();
    const index = sessionStorage.getItem('currentTask');

    const title = document.querySelector('#title-task').value;
    const startDate = document.querySelector('#start-date').value;
    const startTime = document.querySelector('#start-time').value;
    const endDate = document.querySelector('#end-date').value;
    const endTime = document.querySelector('#end-time').value;
    const description = document.querySelector('#description').value;

    const newTask = {
        title: title,
        startDate,
        startTime,
        endDate,
        endTime,
        description,
        status: 'Analisando',
        done: false,
    };

    userData.tasks[index] = newTask

    localStorage.setItem(emailSession, JSON.stringify(userData));

    location.reload();
}

const deleteTask = () => {
    const userData =  getCurrentUser();
    const index = sessionStorage.getItem('currentTask');

    userData.tasks.splice(index, 1);

    localStorage.setItem(emailSession, JSON.stringify(userData));

    location.reload();
}

const toggleDone = () => {
    const userData =  getCurrentUser();
    const index = sessionStorage.getItem('currentTask');

    userData.tasks[index].done = !userData.tasks[index].done;

    localStorage.setItem(emailSession, JSON.stringify(userData));

    location.reload();
}

const toggleDoneBtn = () => {
    const userData =  getCurrentUser();
    const index = sessionStorage.getItem('currentTask');

    const markButton = document.querySelector('#mark');

    if (userData.tasks[index].done) {
        markButton.textContent = 'Marcar não realizada';
    }

    if (!userData.tasks[index].done) {
        markButton.textContent = 'Marcar como realizada';
    }
}

const updateTaskStatus = (index) => {
    const userData =  getCurrentUser();

    const { startDate, startTime, endDate, endTime } = userData.tasks[index];

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);
    const currentDate = new Date(getCurrentDateTime());

    let status;

    if (currentDate < startDateTime) {
        status = "Pendente";
    } else if (currentDate >= startDateTime && currentDate <= endDateTime) {
        status = "Em andamento";
    } else if (currentDate > endDateTime) {
        status = "Em Atraso";
    }

    return status;
}






// #############################
//           DATE TIME
// #############################

const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

const formatarData = (data) => {
    if (data) {
        const partes = data.split('-');
        const dia = partes[2];
        const mes = partes[1];
        const ano = partes[0];
        return `${dia}/${mes}/${ano}`;
    }
    return '';
}

const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}






// #############################
//             RENDER
// #############################

const setGreeting = () => {

    const userData =  getCurrentUser();
    const elementoH2 = document.querySelector('.greeting');

    const now = new Date();

    const options = {
        timeZone: "America/Sao_Paulo",
        hour: "numeric",
        hour12: false,
    };

    const hourBrasilia = now.toLocaleString("en-US", options);

    const hour = parseInt(hourBrasilia);

    let salutation;

    if (hour >= 5 && hour < 12) {
        salutation = 'Bom dia';
    } else if (hour >= 12 && hour < 18) {
        salutation = 'Boa tarde';
    } else {
        salutation = 'Boa noite';
    }

    if (userData) {
        elementoH2.textContent = `${salutation}, ${userData.name}`;
    } else {
        elementoH2.textContent = `${salutation}`;
    }
}

const fillTable = () => {
    const tableBody = document.querySelector('#table-body');
    const userData =  getCurrentUser();

    if (userData && userData.tasks.length > 0) {

        userData.tasks.forEach((task, index) => {

            const newRow = document.createElement('tr');
            newRow.id = `${index}`;
            newRow.innerHTML = `
                <td class="open-modal cursor-pointer" data-bs-toggle="modal" data-bs-target="#modalWindow">${task.title}</td>                
                <td>${formatarData(task.startDate)} às ${task.startTime}</td>
                <td>${formatarData(task.endDate)} às ${task.endTime}</td>
                <td>${task.done ? 'Realizada' : updateTaskStatus(index)}</td>
                <td><a href="#" class="btn btn-primary btn-sm btn-custom btn-update">Alterar</a></td>
            `;
            tableBody.appendChild(newRow);

        });
    } else {

        const noTasksRow = document.createElement('tr');
        noTasksRow.innerHTML = `
        <td colspan="5" style="text-align: center;">Nenhuma tarefa cadastrada</td>

        `;
        tableBody.appendChild(noTasksRow);
    }
}

const fillModal = () => {
    const userData =  getCurrentUser();
    const index = sessionStorage.getItem('currentTask');

    const { title, description } = userData.tasks[index];

    const modalTitle = document.querySelector('.modal-title');
    const modalBody = document.querySelector('.modal-body-p');

    modalTitle.innerHTML = title;
    modalBody.textContent = description;

}

const fillForm = (id) => {    

    const userData =  getCurrentUser();

    const {
        title,
        startDate,
        startTime,
        endDate,
        endTime,
        description
    } = userData.tasks[id];

    document.querySelector('#title-task').value = title;
    document.querySelector('#start-date').value = startDate;
    document.querySelector('#start-time').value = startTime;
    document.querySelector('#end-date').value = endDate;
    document.querySelector('#end-time').value = endTime;
    document.querySelector('#description').value = description;
}

const displayButtons = () => {
    const btnCreate = document.querySelector('#btn-create');
    const btnsUpdate = document.querySelector('#btns');

    btnCreate.classList.add('d-none');
    btnsUpdate.classList.remove('d-none');
}

const changeStatusColor = () => {
    const statusCells = document.querySelectorAll('#table-body td:nth-child(4)');

    statusCells.forEach(cell => {
        const status = cell.textContent.trim();

        cell.classList.remove('text-success', 'text-warning', 'text-primary', 'text-danger');

        switch (status) {
            case 'Realizada':
                cell.classList.add('text-success');
                break;
            case 'Pendente':
                cell.classList.add('text-warning');
                break;
            case 'Em andamento':
                cell.classList.add('text-primary');
                break;
            case 'Em Atraso':
                cell.classList.add('text-danger');
                break;
            default:
                break;
        }
    });
}




