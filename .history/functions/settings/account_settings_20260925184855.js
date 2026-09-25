const settingsPanel = document.querySelector('.settings-panel');
const editButton = document.getElementById('edit-button');
const cancelButton = document.getElementById('cancel-button');
const saveButton = document.getElementById('save-button');
const deleteButton = document.getElementById('delete-account-button');
const deleteModal = document.getElementById('delete-modal');
const deleteCancelButton = document.getElementById('delete-cancel');
const deleteConfirmButton = document.getElementById('delete-confirm');
const fieldInputs = Array.from(document.querySelectorAll('.field-input'));
const fieldDisplayValues = Array.from(document.querySelectorAll('[data-display]'));

const initialValues = {};

fieldInputs.forEach((input) => {
    const key = input.id;
    initialValues[key] = input.value;
});

function toggleEditMode(isEditing) {
    settingsPanel.classList.toggle('editing', isEditing);
    editButton.classList.toggle('hidden', isEditing);
    cancelButton.classList.toggle('hidden', !isEditing);
    saveButton.classList.toggle('hidden', !isEditing);
}

function updateDisplayValues() {
    fieldInputs.forEach((input) => {
        const displayNode = document.querySelector(`[data-display="${input.id}"]`);
        if (!displayNode) return;

        const value = input.value.trim();
        displayNode.textContent = input.type === 'password' ? (value ? '••••••••' : '••••••••') : value || '—';
    });
}

function restorePreviousValues() {
    fieldInputs.forEach((input) => {
        input.value = initialValues[input.id] || '';
    });
    updateDisplayValues();
}

editButton.addEventListener('click', () => {
    toggleEditMode(true);
});

cancelButton.addEventListener('click', () => {
    restorePreviousValues();
    toggleEditMode(false);
});

saveButton.addEventListener('click', () => {
    updateDisplayValues();
    fieldInputs.forEach((input) => {
        initialValues[input.id] = input.value;
    });
    toggleEditMode(false);
});

function openDeleteModal() {
    deleteModal.hidden = false;
}

function closeDeleteModal() {
    deleteModal.hidden = true;
}

deleteButton.addEventListener('click', openDeleteModal);
deleteCancelButton.addEventListener('click', closeDeleteModal);
deleteConfirmButton.addEventListener('click', () => {
    closeDeleteModal();
    alert('Delete account request confirmed. This is a front-end-only confirmation.');
});

deleteModal.addEventListener('click', (event) => {
    if (event.target === deleteModal) {
        closeDeleteModal();
    }
});

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !deleteModal.hidden) {
        closeDeleteModal();
    }
});

updateDisplayValues();
