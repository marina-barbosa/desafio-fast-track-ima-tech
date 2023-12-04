





document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.toggle-password-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            let inputPassword = btn.previousElementSibling;

            if (inputPassword.getAttribute('type') === 'password') {
                inputPassword.setAttribute('type', 'text');
            } else {
                inputPassword.setAttribute('type', 'password');
            }
        });
    });


    elementScout('#createTaskButton', createTask);
    elementScout('#delete', deleteTask);
    elementScout('#update', updateTask);
    elementScout('#mark', toggleDone);
    elementScout('.greeting', setGreeting());
    elementScout('#logout', clearStorage);

    const tableBody = document.querySelectorAll('#table-body');

    if (tableBody) {
        fillTable();
        changeStatusColor();
    }


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
                toggleDoneBtn();
            });
        });

    }
})






// #############################
//        USEFUL
// #############################
const elementScout = (elementId, ...eventHandlers) => {
    const element = document.querySelector(elementId);
    if (element) {

        const tagName = element.tagName.toLowerCase();
        if (tagName !== 'button' || tagName !== 'a') {
            eventHandlers.forEach(handler => {
                handler;
            });
        }

        eventHandlers.forEach(handler => {
            element.addEventListener('click', handler);
        });
    }
}

const clearLocalStorage = false;
const clearStorage = () => {

    if (clearLocalStorage) {

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
//             TASK
// #############################

const inputTitle = document.querySelector('#title-task');

inputTitle.addEventListener('keyup', () => {
    if (inputTitle.value.trim().length < 1) {
        inputTitle.style.border = '1px solid red';
        inputTitle.style.boxShadow = '0 0 5px red';        
    } else {
        inputTitle.style.border = '1px solid var(--verde-l)';
        inputTitle.style.boxShadow = '0 0 10px var(--verde-l)';        
    }
})

const createTask = () => {

    const emailSession = sessionStorage.getItem('emailSession');
    const userData = JSON.parse(localStorage.getItem(emailSession));

    const title = document.querySelector('#title-task');
    const startDate = document.querySelector('#start-date').value || getCurrentDate();
    const startTime = document.querySelector('#start-time').value || getCurrentTime();
    const endDate = document.querySelector('#end-date').value || getCurrentDate();
    const endTime = document.querySelector('#end-time').value || '23:59';
    const description = document.querySelector('#description').value.trim();

    const feedback = document.querySelector('#feedback');

    if (title.value.trim() === '') {
        title.style.border = '1px solid red';
        title.style.boxShadow = '0 0 5px red';
        feedback.classList.remove('d-none');
        feedback.classList.add('alert-danger');
        feedback.innerHTML = 'O título é obrigatório.';
        return;
    }

    if (invalidDateTime(startDate, startTime, endDate, endTime)) {        
        feedback.classList.remove('d-none');
        feedback.classList.add('alert-danger');
        feedback.innerHTML = 'A data de início não pode ser posterior à data de término.';
        return;
    }

    const newTask = {
        title: title.value.trim(),
        startDate,
        startTime,
        endDate,
        endTime,
        description,
        status: 'Analisando',
        done: false,
    };


    userData.tasks.push(newTask);
    localStorage.setItem(emailSession, JSON.stringify(userData));

    feedback.classList.remove('d-none');
    feedback.classList.add('alert-success');
    feedback.innerHTML = 'Tarefa criada com sucesso.';

    setTimeout(() => {
        location.reload();
    }, 2000);
}

const setCurrentTask = (id) => {
    sessionStorage.setItem('currentTask', id);
}

const updateTask = () => {

    const emailSession = sessionStorage.getItem('emailSession');
    const userData = JSON.parse(localStorage.getItem(emailSession));
    const index = sessionStorage.getItem('currentTask');

    const title = document.querySelector('#title-task');
    const startDate = document.querySelector('#start-date');
    const startTime = document.querySelector('#start-time');
    const endDate = document.querySelector('#end-date');
    const endTime = document.querySelector('#end-time');
    const description = document.querySelector('#description').value;

    const feedback = document.querySelector('#feedback');

    if (title.value.trim() === '') {
        title.style.border = '1px solid red';
        title.style.boxShadow = '0 0 5px red';
        feedback.classList.remove('d-none');
        feedback.classList.add('alert-danger');
        feedback.innerHTML = 'O título é obrigatório.';
        return;
    }

    if (invalidDateTime(startDate.value, startTime.value, endDate.value, endTime.value)) {
        startDate.style.border = '1px solid red';
        startDate.style.boxShadow = '0 0 5px red';
        startTime.style.border = '1px solid red';
        startTime.style.boxShadow = '0 0 5px red';
        endDate.style.border = '1px solid red';
        endDate.style.boxShadow = '0 0 5px red';
        endTime.style.border = '1px solid red';
        endTime.style.boxShadow = '0 0 5px red';
        feedback.classList.remove('d-none');
        feedback.classList.add('alert-danger');
        feedback.innerHTML = 'A data de início não pode ser posterior à data de término.';
        return;
    }

    const newTask = {
        title: title.value.trim(),
        startDate: startDate.value,
        startTime: startTime.value,
        endDate: endDate.value,
        endTime: endTime.value,
        description,
        status: 'Analisando',
        done: false,
    };

    userData.tasks[index] = newTask

    localStorage.setItem(emailSession, JSON.stringify(userData));

    feedback.classList.remove('d-none');
    feedback.classList.add('alert-success');
    feedback.innerHTML = 'Tarefa atualizada com sucesso.';

    setTimeout(() => {
        location.reload();
    }, 2000);
}

const deleteTask = () => {
    const emailSession = sessionStorage.getItem('emailSession');
    const userData = JSON.parse(localStorage.getItem(emailSession));
    const index = sessionStorage.getItem('currentTask');    

    userData.tasks.splice(index, 1);

    localStorage.setItem(emailSession, JSON.stringify(userData));

    const feedback = document.querySelector('#feedback');

    feedback.classList.remove('d-none');
    feedback.classList.add('alert-danger');
    feedback.innerHTML = 'Tarefa excluída com sucesso.';

    setTimeout(() => {
        location.reload();
    }, 2000);
}

const toggleDone = () => {
    const emailSession = sessionStorage.getItem('emailSession');
    const userData = JSON.parse(localStorage.getItem(emailSession));
    const index = sessionStorage.getItem('currentTask');

    userData.tasks[index].done = !userData.tasks[index].done;

    localStorage.setItem(emailSession, JSON.stringify(userData));

    location.reload();
}

const toggleDoneBtn = () => {
    const emailSession = sessionStorage.getItem('emailSession');
    const userData = JSON.parse(localStorage.getItem(emailSession));

    const index = sessionStorage.getItem('currentTask');
    console.log(userData.tasks[index].done)

    const markButton = document.querySelector('#mark');
    console.log(markButton.textContent)

    if (userData.tasks[index].done) {
        markButton.textContent = 'Desmarcar';
        markButton.classList.add('btn-gray');
    }

    if (!userData.tasks[index].done) {
        markButton.textContent = 'Marcar realizada';
        markButton.classList.remove('btn-gray');
    }
}

const updateTaskStatus = (index) => {
    const emailSession = sessionStorage.getItem('emailSession');
    const userData = JSON.parse(localStorage.getItem(emailSession));

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
        status = "Em atraso";
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

const formatDate = (data) => {
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

function invalidDateTime(startDate, startTime, endDate, endTime) {
    const startDateTimeString = `${startDate}T${startTime}`;
    const endDateTimeString = `${endDate}T${endTime}`;

    const startDateObj = new Date(startDateTimeString);
    const endDateObj = new Date(endDateTimeString);

    if (startDateObj > endDateObj) {
        return true;
    }
    return false;
}






// #############################
//             RENDER
// #############################

const setGreeting = () => {

    const emailSession = sessionStorage.getItem('emailSession');
    const userData = JSON.parse(localStorage.getItem(emailSession));
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
    const emailSession = sessionStorage.getItem('emailSession');
    const userData = JSON.parse(localStorage.getItem(emailSession));

    if (userData && userData.tasks.length > 0) {

        userData.tasks.forEach((task, index) => {

            const newRow = document.createElement('tr');
            newRow.id = `${index}`;
            newRow.innerHTML = `
                <td class="open-modal cursor-pointer" data-bs-toggle="modal" data-bs-target="#modalWindow">
                    <div class="text-container">
                        <strong>${task.title}</strong>
                    </div></td>                
                <td>${formatDate(task.startDate)} às ${task.startTime}</td>
                <td>${formatDate(task.endDate)} às ${task.endTime}</td>
                <td><strong>${task.done ? 'Realizada' : updateTaskStatus(index)}</strong></td>
                <td><a href="#" class="btn btn-outline-light btn-sm btn-custom btn-update">Alterar</a></td>
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
    const emailSession = sessionStorage.getItem('emailSession');
    const userData = JSON.parse(localStorage.getItem(emailSession));
    const index = sessionStorage.getItem('currentTask');

    const { title, description } = userData.tasks[index];

    const modalTitle = document.querySelector('.modal-title');
    const modalBody = document.querySelector('.modal-body-p');

    modalTitle.innerHTML = title;
    modalBody.textContent = description;

}

const fillForm = (id) => {

    const emailSession = sessionStorage.getItem('emailSession');
    const userData = JSON.parse(localStorage.getItem(emailSession));

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
            case 'Em atraso':
                cell.classList.add('text-danger');
                break;
            default:
                break;
        }
    });
}

const alertDiv = (message, type) => {
    const alertPlaceholder = document.querySelector('#liveAlertPlaceholder');

    if (alertPlaceholder) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
    <div class="alert alert-${type} alert-dismissible" role="alert">
      ${message}
    </div> `;

        alertPlaceholder.appendChild(wrapper);

        setTimeout(() => {
            wrapper.remove();
        }, 5000);
    };
}





