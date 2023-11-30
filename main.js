


// VARIABLES GLOBALES
    let cardList = document.querySelector('.card__list');
    let itemIdCounter = 1;

// AÑADIR TAREA AL LISTADO INFERIOR
    function addTaskList() {
        const inputElement = document.querySelector('.card__input');
        const inputValue = inputElement.value.trim();

        if (inputValue === '') {
            return;
        } else {
            // Si no existe card__list lo crea
            if (!cardList) {
                cardList = document.createElement('div');
                cardList.classList.add('card__list');

                // Inserta el nuevo card__list después del formulario
                const cardListContainer = document.querySelector('.card__form');
                cardListContainer.insertAdjacentElement('afterend', cardList);
            }

            // card__item
            const newCard = document.createElement('div');
            newCard.classList.add('card__item');

            // Asigna un identificador único al Task
            const itemId = itemIdCounter++;
            newCard.setAttribute('data-item-id', itemId);

            // card__text + inputValue
            const newCardText = document.createElement('div');
            newCardText.classList.add('card__text');
            newCardText.textContent = inputValue;

            // card__features
            const cardFeatures = document.createElement('div');
            cardFeatures.classList.add('card__features');

            const editButton = document.createElement('button');
            editButton.classList.add('card__edit');
            editButton.innerHTML = '<span class="icon-pencil-solid"></span>';
            editButton.setAttribute('data-item-id', itemId);

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('card__delete');
            deleteButton.innerHTML = '<span class="icon-trash-solid"></span>';
            deleteButton.setAttribute('data-item-id', itemId);

            // Añade elementos al card__item
            cardFeatures.appendChild(editButton);
            cardFeatures.appendChild(deleteButton);
            newCard.appendChild(newCardText);
            newCard.appendChild(cardFeatures);

            // Añade el nuevo card__item a la lista
            cardList.appendChild(newCard);

            // Limpia valor input
            inputElement.value = '';

            // Actualiza la selección de los botones de eliminación
            updateDeleteButtons();

            // Aplica tachado al task
            newCardText.addEventListener('click', function () {
                newCardText.classList.toggle('card__text--strikethrough');

                // Toggle condición ternario para mostrar/ocultar el botón de edición
                editButton.style.display = (newCardText.classList.contains('card__text--strikethrough')) ? 'none' : 'block';
            });

            // Evento para la edición del Task
            editButton.addEventListener('click', function () {
                
                // Cuando se hace click en editar, copia el texto al input
                inputElement.value = newCardText.textContent;

                // Elimina el card__item actual del listado
                newCard.remove();

                // Actualiza cardList si está vacía
                if (cardList && cardList.children.length === 0) {
                    cardList.remove();
                    cardList = null;
                }
            });

            // Guarda en localStorage la Task
            saveLocalStorage();
        }
    }

// FUNCIÓN PARA ACTUALIZAR LOS BOTONES DELETE
    function updateDeleteButtons() {
        const deleteInfoButtons = document.querySelectorAll('.card__delete');
        deleteInfoButtons.forEach(function (deleteInfoButton) {
            deleteInfoButton.addEventListener('click', deleteTaskList);
        });
    }

// ELIMINAR TAREA DEL LISTADO INFERIOR
function deleteTaskList(event) {
    // Obtiene el botón clicado
    const deleteButton = event.target;

    // Obtiene el data-item-id del botón clicado
    const itemIdToDelete = deleteButton.closest('.card__item').getAttribute('data-item-id');

    // Busca el elemento con el mismo data-item-id y lo elimina
    const itemToDelete = document.querySelector(`.card__item[data-item-id="${itemIdToDelete}"]`);

    if (itemToDelete) {

        // Elimina el elemento encontrado
        itemToDelete.remove();

        // Verifica si la cardList no tiene hijos y la elimina
        if (cardList && cardList.children.length === 0) {
            cardList.remove();
            cardList = null; // Actualizar la referencia global a cardList
        }

        // Guarda en localStorage después de la eliminación
        saveLocalStorage();
    }
}

// FUNCIÓN PARA EDITAR TAREA
function editTask(event) {
    // Obtiene el botón de edición clicado
    const editButton = event.target;

    // Obtiene el data-item-id del botón clicado
    const itemIdToEdit = editButton.getAttribute('data-item-id');

    // Busca el elemento con el mismo data-item-id
    const itemToEdit = document.querySelector(`.card__item[data-item-id="${itemIdToEdit}"]`);

    if (itemToEdit) {

        // Elimina la clase 'card__item' de la Task para editarla
        itemToEdit.classList.remove('card__item');

        // Deshabilita el botón de edición para evitar ediciones múltiples
        editButton.disabled = true;

        // Cambia el texto del botón del form inicial a 'GUARDAR'
        editButton.textContent = 'Guardar';

        // Agrega un evento de clic al botón de edición para guardar la tarea editada
        editButton.addEventListener('click', function () {

            // Al hacer clic en guardar, actualizamos el texto de la tarea
            itemToEdit.querySelector('.card__text').textContent = inputElement.value;

            // Agrega la clase 'card__item' de nuevo
            itemToEdit.classList.add('card__item');

            // Habilita el botón de edición
            editButton.disabled = false;

            // Cambia el texto del botón de edición a 'Editar'
            editButton.textContent = 'Editar';

            // EliminA el evento de clic que guarda la tarea editada
            editButton.removeEventListener('click', this);

            // Guardr en localStorage después de la edición
            saveLocalStorage();
        });
    }
}

// FUNCIÓN PARA GUARDAR TAREA EDITADA
function saveEditedTask(event) {

    // Obteneiene el botón de edición
    const editButton = event.target;

    // Obtiene el data-item-id del botón clicado
    const itemIdToSave = editButton.getAttribute('data-item-id');

    // Busca el elemento con el mismo data-item-id
    const itemToSave = document.querySelector(`.card__item[data-item-id="${itemIdToSave}"]`);

    if (itemToSave) {
        // Agrega la clase 'card__item' de nuevo
        itemToSave.classList.add('card__item');

        // Habilita el botón de edición
        editButton.disabled = false;

        // Cambia el texto del botón de edición a 'Editar'
        editButton.textContent = 'Editar';

        // Elimina el evento de clic que guarda la tarea editada
        editButton.removeEventListener('click', saveEditedTask);
    }
}

// FUNCIÓN APRA GUARDAR EN EL LOCAL STORAGE
function saveLocalStorage() {
    const tasks = [];
    const cardItems = document.querySelectorAll('.card__item');

    cardItems.forEach(function (cardItem) {
        const taskId = cardItem.getAttribute('data-item-id');
        const taskText = cardItem.querySelector('.card__text').textContent;

        tasks.push({
            id: taskId,
            text: taskText
        });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// FUNCIÓN PARA REVISAR EL LOCALSTORAGE
document.addEventListener('DOMContentLoaded', function () {
    const savedTasks = localStorage.getItem('tasks');

    if (savedTasks) {
        const tasks = JSON.parse(savedTasks);

        tasks.forEach(function (task) {
            const newCard = document.createElement('div');
            newCard.classList.add('card__item');
            newCard.setAttribute('data-item-id', task.id);

            const newCardText = document.createElement('div');
            newCardText.classList.add('card__text');
            newCardText.textContent = task.text;

            const cardFeatures = document.createElement('div');
            cardFeatures.classList.add('card__features');

            const editButton = document.createElement('button');
            editButton.classList.add('card__edit');
            editButton.innerHTML = '<span class="icon-pencil-solid"></span>';
            editButton.setAttribute('data-item-id', task.id);

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('card__delete');
            deleteButton.innerHTML = '<span class="icon-trash-solid"></span>';
            deleteButton.setAttribute('data-item-id', task.id);

            cardFeatures.appendChild(editButton);
            cardFeatures.appendChild(deleteButton);
            newCard.appendChild(newCardText);
            newCard.appendChild(cardFeatures);

            if (!cardList) {
                cardList = document.createElement('div');
                cardList.classList.add('card__list');
                const cardListContainer = document.querySelector('.card__form');
                cardListContainer.insertAdjacentElement('afterend', cardList);
            }

            cardList.appendChild(newCard);

            updateDeleteButtons();

            newCardText.addEventListener('click', function () {
                newCardText.classList.toggle('card__text--strikethrough');
                editButton.style.display = (newCardText.classList.contains('card__text--strikethrough')) ? 'none' : 'block';
            });

            editButton.addEventListener('click', function () {
                inputElement.value = newCardText.textContent;
                newCard.remove();
                if (cardList && cardList.children.length === 0) {
                    cardList.remove();
                    cardList = null;
                }
            });
        });
    }
});

// EVENTLISTENERS
document.addEventListener('DOMContentLoaded', function () {
    const getInfoButton = document.querySelector('.card__button');
    getInfoButton.addEventListener('click', addTaskList);
});
