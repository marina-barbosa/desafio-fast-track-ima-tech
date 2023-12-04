const selectFilter = document.querySelector('#select-filter');

selectFilter.addEventListener('change', () => {

    let selectedOption = selectFilter.value;

    let cells = taskTable.querySelectorAll('tr');

    for (let index in cells) {
        if (true === isNaN(index)) {
            continue;
        }

        let cellContent = cells[index].innerHTML;

        if(selectedOption === 'Filtro' || selectedOption === 'Todas'){
            cells[index].style.display = '';
        } else if (true == cellContent.includes(selectedOption)) {
            cells[index].style.display = '';
        } else {
            cells[index].style.display = 'none';
            console.log(cells[index])
        }
    }
})
