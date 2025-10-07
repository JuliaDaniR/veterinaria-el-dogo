document.addEventListener('DOMContentLoaded', () => {

    // Mock Database (datos ficticios)
    let clientes = [
        { id: 1, nombre: 'Carlos', apellido: 'Gomez', dni: '25123456', telefono: '341-555-1234', direccion: 'Av. Siempre Viva 742', estado: 'Activo' },
        { id: 2, nombre: 'Maria', apellido: 'Lopez', dni: '30789012', telefono: '341-555-5678', direccion: 'Calle Falsa 123', estado: 'Activo' },
        { id: 3, nombre: 'Juan', apellido: 'Perez', dni: '28901234', telefono: '341-555-9012', direccion: 'Boulevard Secreto 456', estado: 'Inactivo' },
    ];
    let mascotas = [
        { id: 1, nombre: 'Fido', especie: 'Perro', raza: 'Mestizo', edad: 5, idCliente: 1, salud: 'Alergia al polen' },
        { id: 2, nombre: 'Mishi', especie: 'Gato', raza: 'Siamés', edad: 2, idCliente: 2, salud: '' },
        { id: 3, nombre: 'Rocky', especie: 'Perro', raza: 'Boxer', edad: 8, idCliente: 1, salud: 'Artritis leve' },
    ];
    let nextClienteId = 4;
    let nextMascotaId = 4;
    
    // --- Elementos del DOM y Vistas ---
    const landingView = document.getElementById('landing-view');
    const mainApp = document.getElementById('main-app');
    const authModal = document.getElementById('auth-modal');
    
    // Vistas dentro del Modal
    const loginFormView = document.getElementById('login-form-view');
    const registerFormView = document.getElementById('register-form-view');

    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const logoutButton = document.getElementById('logout-button');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const userDisplayName = document.getElementById('user-display-name');

    const views = {
        dashboard: document.getElementById('dashboard-view'),
        clientes: document.getElementById('clientes-view'),
        mascotas: document.getElementById('mascotas-view'),
    };
    const navLinks = {
        dashboard: document.getElementById('nav-dashboard'),
        clientes: document.getElementById('nav-clientes'),
        mascotas: document.getElementById('nav-mascotas'),
    };
    
    // Modales de Gestión
    const clienteModal = document.getElementById('cliente-modal');
    const mascotaModal = document.getElementById('mascota-modal');
    const mascotaDueñoSelect = document.getElementById('mascota-dueño');


    // --- FUNCIONES MODAL AUTH ---
    document.getElementById('open-login-modal').addEventListener('click', () => {
        authModal.classList.remove('hidden-view');
        // Asegurar que inicie en Login
        loginFormView.classList.remove('hidden-view');
        registerFormView.classList.add('hidden-view');
        loginError.classList.add('hidden-view');
    });

    document.getElementById('close-auth-modal').addEventListener('click', () => {
        authModal.classList.add('hidden-view');
    });

    // Toggle Login/Register
    document.getElementById('switch-to-register').addEventListener('click', () => {
        loginFormView.classList.add('hidden-view');
        registerFormView.classList.remove('hidden-view');
        loginError.classList.add('hidden-view');
        document.getElementById('register-form').reset();
    });

    document.getElementById('switch-to-login').addEventListener('click', () => {
        loginFormView.classList.remove('hidden-view');
        registerFormView.classList.add('hidden-view');
        document.getElementById('register-message').classList.add('hidden-view');
        document.getElementById('login-form').reset();
    });

    // --- LÓGICA DE AUTENTICACIÓN (Simulada) ---

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('auth-username').value;
        const password = document.getElementById('auth-password').value;
        
        // Simulación: solo 'admin'/'password' funciona
        if (username === 'admin' && password === 'password') {
            landingView.classList.add('hidden-view');
            authModal.classList.add('hidden-view');
            mainApp.classList.remove('hidden-view');
            userDisplayName.textContent = 'Ricardo (Admin)';
            loginError.classList.add('hidden-view');
            navigateTo('dashboard');
            renderClientesTable(); // Cargar datos al entrar
            renderMascotasTable();
        } else {
            loginError.classList.remove('hidden-view');
        }
    });

    document.getElementById('register-form').addEventListener('submit', (e) => {
        e.preventDefault();
        // Simulación: En un sistema real, esto enviaría los datos al backend
        document.getElementById('register-form').reset();
        document.getElementById('register-message').classList.remove('hidden-view');
        showToast('Simulación: Usuario registrado con éxito.');
    });

    logoutButton.addEventListener('click', () => {
        mainApp.classList.add('hidden-view');
        landingView.classList.remove('hidden-view');
        loginForm.reset();
        showToast('Sesión cerrada.');
    });

    // --- LÓGICA DE NAVEGACIÓN Y VISTAS ---
    
    function navigateTo(viewName) {
        Object.values(views).forEach(view => view.classList.add('hidden-view'));
        Object.values(navLinks).forEach(link => link.classList.remove('active'));
        
        if (views[viewName]) {
            views[viewName].classList.remove('hidden-view');
            navLinks[viewName].classList.add('active');
            if (viewName === 'clientes') renderClientesTable(document.getElementById('search-cliente').value);
            if (viewName === 'mascotas') renderMascotasTable(document.getElementById('search-mascota').value);
        }
    }

    document.getElementById('goto-clientes').addEventListener('click', () => navigateTo('clientes'));
    document.getElementById('goto-mascotas').addEventListener('click', () => navigateTo('mascotas'));
    navLinks.dashboard.addEventListener('click', (e) => { e.preventDefault(); navigateTo('dashboard'); });
    navLinks.clientes.addEventListener('click', (e) => { e.preventDefault(); navigateTo('clientes'); });
    navLinks.mascotas.addEventListener('click', (e) => { e.preventDefault(); navigateTo('mascotas'); });


    // --- LÓGICA TOAST NOTIFICATION ---
    function showToast(message) {
        toastMessage.textContent = message;
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
        setTimeout(() => {
            toast.style.transform = 'translateY(80px)';
            toast.style.opacity = '0';
        }, 3000);
    }

    // --- LÓGICA DE CLIENTES (Registro/Edición) ---

    const clientesTableBody = document.getElementById('clientes-table-body');
    const searchClienteInput = document.getElementById('search-cliente');

    function renderClientesTable(filter = '') {
        clientesTableBody.innerHTML = '';
        const filteredClientes = clientes.filter(c => 
            c.estado === 'Activo' && (
            c.nombre.toLowerCase().includes(filter.toLowerCase()) ||
            c.apellido.toLowerCase().includes(filter.toLowerCase()) ||
            c.dni.includes(filter))
        );

        if (filteredClientes.length === 0) {
            clientesTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 1rem; color: var(--color-text-muted);">No se encontraron clientes activos.</td></tr>';
            return;
        }

        filteredClientes.forEach(cliente => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div style="font-weight: 600;">${cliente.nombre} ${cliente.apellido}</div>
                    <div style="color: var(--color-text-muted); font-size: 0.8rem;">DNI: ${cliente.dni}</div>
                </td>
                <td style="color: var(--color-text-muted);">${cliente.telefono}</td>
                <td>
                    <span class="status-badge">${cliente.estado}</span>
                </td>
                <td class="action-buttons">
                    <button class="edit-btn" data-id="${cliente.id}">Editar</button>
                    <button class="deactivate-btn" data-id="${cliente.id}">Dar de Baja</button>
                </td>
            `;
            clientesTableBody.appendChild(row);
        });
    }

    searchClienteInput.addEventListener('keyup', () => renderClientesTable(searchClienteInput.value));

    // Abrir modal de cliente
    document.getElementById('add-cliente-button').addEventListener('click', () => {
        document.getElementById('cliente-modal-title').textContent = 'Registro de Cliente (Nuevo Dueño)';
        document.getElementById('cliente-form').reset();
        document.getElementById('cliente-id').value = '';
        clienteModal.classList.remove('hidden-view');
    });

    // Cerrar modal de cliente
    document.getElementById('cancel-cliente-modal').addEventListener('click', () => {
        clienteModal.classList.add('hidden-view');
    });

    // Guardar cliente
    document.getElementById('cliente-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('cliente-id').value;
        const newCliente = {
            nombre: document.getElementById('cliente-nombre').value,
            apellido: document.getElementById('cliente-apellido').value,
            dni: document.getElementById('cliente-dni').value,
            telefono: document.getElementById('cliente-telefono').value,
            direccion: document.getElementById('cliente-direccion').value,
            estado: 'Activo'
        };

        if (id) { // Editando
            const index = clientes.findIndex(c => c.id == id);
            clientes[index] = { ...clientes[index], ...newCliente };
            showToast('Cliente actualizado correctamente.');
        } else { // Creando (Registro)
            newCliente.id = nextClienteId++;
            clientes.push(newCliente);
            showToast('Cliente registrado exitosamente.');
        }

        renderClientesTable(searchClienteInput.value);
        clienteModal.classList.add('hidden-view');
    });

    // Delegación de eventos para editar y desactivar
    clientesTableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const id = e.target.dataset.id;
            const cliente = clientes.find(c => c.id == id);
            document.getElementById('cliente-modal-title').textContent = 'Editar Cliente Existente';
            document.getElementById('cliente-id').value = cliente.id;
            document.getElementById('cliente-nombre').value = cliente.nombre;
            document.getElementById('cliente-apellido').value = cliente.apellido;
            document.getElementById('cliente-dni').value = cliente.dni;
            document.getElementById('cliente-telefono').value = cliente.telefono;
            document.getElementById('cliente-direccion').value = cliente.direccion;
            clienteModal.classList.remove('hidden-view');
        }
        if (e.target.classList.contains('deactivate-btn')) {
            const id = e.target.dataset.id;
            const index = clientes.findIndex(c => c.id == id);
            clientes[index].estado = 'Inactivo';
            renderClientesTable(searchClienteInput.value);
            showToast('Cliente dado de baja.');
        }
    });

    // --- LÓGICA DE MASCOTAS ---
    const mascotasTableBody = document.getElementById('mascotas-table-body');
    const searchMascotaInput = document.getElementById('search-mascota');
    
    function getClienteNombre(idCliente) {
        const cliente = clientes.find(c => c.id == idCliente);
        return cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Dueño Desconocido';
    }
    
    function populateDueñosSelect(selectedId = null) {
        mascotaDueñoSelect.innerHTML = '';
        clientes.filter(c => c.estado === 'Activo').forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.id;
            option.textContent = `${cliente.nombre} ${cliente.apellido} (DNI: ${cliente.dni})`;
            if (cliente.id == selectedId) {
                option.selected = true;
            }
            mascotaDueñoSelect.appendChild(option);
        });
        if (mascotaDueñoSelect.options.length === 0) {
            mascotaDueñoSelect.innerHTML = '<option value="" disabled>No hay clientes activos</option>';
            mascotaDueñoSelect.disabled = true;
        } else {
            mascotaDueñoSelect.disabled = false;
        }
    }


    function renderMascotasTable(filter = '') {
        mascotasTableBody.innerHTML = '';
        const filteredMascotas = mascotas.filter(m => 
            m.nombre.toLowerCase().includes(filter.toLowerCase()) ||
            m.especie.toLowerCase().includes(filter.toLowerCase()) ||
            getClienteNombre(m.idCliente).toLowerCase().includes(filter.toLowerCase())
        );

        if (filteredMascotas.length === 0) {
            mascotasTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 1rem; color: var(--color-text-muted);">No se encontraron mascotas.</td></tr>';
            return;
        }

        filteredMascotas.forEach(mascota => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div style="font-weight: 600;">${mascota.nombre}</div>
                    <div style="color: var(--color-text-muted); font-size: 0.8rem;">${mascota.raza || 'N/A'}</div>
                </td>
                <td style="color: var(--color-text-muted);">${mascota.especie}</td>
                <td style="color: var(--color-primary); font-weight: 600;">${getClienteNombre(mascota.idCliente)}</td>
                <td class="action-buttons">
                    <button class="details-btn">Detalles</button>
                    <button class="edit-btn edit-mascota" data-id="${mascota.id}">Editar</button>
                </td>
            `;
            mascotasTableBody.appendChild(row);
        });
    }

    searchMascotaInput.addEventListener('keyup', () => renderMascotasTable(searchMascotaInput.value));
    
    // Abrir Modal Mascota
    document.getElementById('add-mascota-button').addEventListener('click', () => { 
        document.getElementById('mascota-modal-title').textContent = 'Registro de Nueva Mascota';
        document.getElementById('mascota-form').reset();
        document.getElementById('mascota-id').value = '';
        populateDueñosSelect();
        mascotaModal.classList.remove('hidden-view'); 
    });
    
    // Cerrar Modal Mascota
    document.getElementById('cancel-mascota-modal').addEventListener('click', () => {
        mascotaModal.classList.add('hidden-view');
    });

    // Guardar Mascota (Simulación)
    document.getElementById('mascota-form').addEventListener('submit', e => {
        e.preventDefault();
        showToast('Simulación: Mascota guardada/actualizada.');
        mascotaModal.classList.add('hidden-view');
        // En un sistema real, se actualizaría el array 'mascotas' y se llamaría a renderMascotasTable()
    });
    
    // Delegación de eventos para editar mascota
    mascotasTableBody.addEventListener('click', e => {
        if(e.target.classList.contains('edit-mascota')) {
            const id = e.target.dataset.id;
            const mascota = mascotas.find(m => m.id == id);
            document.getElementById('mascota-modal-title').textContent = 'Editar Mascota: ' + mascota.nombre;
            document.getElementById('mascota-id').value = mascota.id;
            document.getElementById('mascota-nombre').value = mascota.nombre;
            document.getElementById('mascota-especie').value = mascota.especie;
            document.getElementById('mascota-raza').value = mascota.raza;
            document.getElementById('mascota-edad').value = mascota.edad;
            document.getElementById('mascota-salud').value = mascota.salud;

            populateDueñosSelect(mascota.idCliente);
            mascotaModal.classList.remove('hidden-view');
        }
    });

});