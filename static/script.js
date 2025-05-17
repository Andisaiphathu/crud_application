document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'http://localhost:5000';
    const userForm = document.getElementById('userForm');
    const userIdField = document.getElementById('userId');
    const nameField = document.getElementById('name');
    const ageField = document.getElementById('age');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const userTable = document.getElementById('userTable');
    const alertBox = document.getElementById('alertBox');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    let allUsers = [];

    function showAlert(message, type) {
        alertBox.textContent = message;
        alertBox.className = 'alert alert-' + type;
        alertBox.style.display = 'block';
        setTimeout(() => alertBox.style.display = 'none', 3000);
    }

    function fetchUsers() {
        fetch(API_URL + '/users')
            .then(res => res.json())
            .then(data => {
                allUsers = data;
                renderUsers(data);
            });
    }

    function renderUsers(users) {
        userTable.innerHTML = '';
        if (users.length === 0) {
            userTable.innerHTML = '<tr><td colspan="4">No users found.</td></tr>';
        }
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.age}</td>
                <td>
                    <button onclick="editUser(${user.id})">Edit</button>
                    <button onclick="deleteUser(${user.id})" class="cancel">Delete</button>
                </td>
            `;
            userTable.appendChild(row);
        });
    }

    window.editUser = function (id) {
        const user = allUsers.find(u => u.id === id);
        if (user) {
            userIdField.value = user.id;
            nameField.value = user.name;
            ageField.value = user.age;
            submitBtn.textContent = 'Update User';
            cancelBtn.style.display = 'inline-block';
        }
    };

    window.deleteUser = function (id) {
        fetch(`${API_URL}/users/${id}`, { method: 'DELETE' })
            .then(() => {
                showAlert('User deleted!', 'success');
                fetchUsers();
            });
    };

    cancelBtn.addEventListener('click', () => {
        userForm.reset();
        userIdField.value = '';
        submitBtn.textContent = 'Add User';
        cancelBtn.style.display = 'none';
    });

    userForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const user = { name: nameField.value, age: parseInt(ageField.value) };
        const id = userIdField.value;

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_URL}/users/${id}` : `${API_URL}/users`;

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        })
            .then(res => res.json())
            .then(() => {
                fetchUsers();
                userForm.reset();
                userIdField.value = '';
                submitBtn.textContent = 'Add User';
                cancelBtn.style.display = 'none';
                showAlert(`User ${id ? 'updated' : 'added'} successfully!`, 'success');
            });
    });

    searchBtn.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filtered = allUsers.filter(u => u.name.toLowerCase().includes(searchTerm));
        renderUsers(filtered);
    });

    fetchUsers();
});
