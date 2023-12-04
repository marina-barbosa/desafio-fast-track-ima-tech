
const inputSearch = document.querySelector('#input-search');
const taskTable = document.querySelector('#table-body');

inputSearch.addEventListener('keyup', () => {
    let expression = inputSearch.value.toLowerCase();

    let cells = taskTable.querySelectorAll('tr');
    

    for (let index in cells) {
        if(true === isNaN(index)){
            continue;
        }

        let cellContent = cells[index].innerHTML.toLowerCase();
        
        if(true == cellContent.includes(expression)){
            cells[index].style.display = '';
        } else {
            cells[index].style.display = 'none';
            console.log(cells[index])
        }
    }
})