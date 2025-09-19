// form-validation.js
document.addEventListener('DOMContentLoaded', function() {
    // Validación para el formulario de contacto
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateContactForm()) {
                // Simular envío exitoso
                alert('¡Mensaje enviado con éxito! Te contactaremos pronto.');
                contactForm.reset();
            }
        });
    }
    
    // Validación para el formulario de login
    const loginForm = document.querySelector('form[action=""]');
    if (loginForm && !document.getElementById('contactForm')) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateLoginForm()) {
                alert('Inicio de sesión exitoso');
                // Redirección simulada
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }
        });
    }
    
    // Validación para el formulario de registro
    const signinForm = document.querySelector('form[action=""]');
    if (signinForm && document.querySelector('input[type="file"]')) {
        signinForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateSigninForm()) {
                alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
                // Redirección simulada
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1000);
            }
        });
    }
});

// Validar formulario de contacto
function validateContactForm() {
    const nombre = document.getElementById('nombre');
    const apellido = document.getElementById('apellido');
    const correo = document.getElementById('correo');
    const asunto = document.getElementById('asunto');
    const mensaje = document.getElementById('mensaje');
    
    let isValid = true;
    
    // Validar nombre
    if (!nombre.value.trim()) {
        showError(nombre, 'Por favor ingresa tu nombre');
        isValid = false;
    } else {
        clearError(nombre);
    }
    
    // Validar apellido
    if (!apellido.value.trim()) {
        showError(apellido, 'Por favor ingresa tu apellido');
        isValid = false;
    } else {
        clearError(apellido);
    }
    
    // Validar correo
    if (!correo.value.trim()) {
        showError(correo, 'Por favor ingresa tu correo electrónico');
        isValid = false;
    } else if (!isValidEmail(correo.value)) {
        showError(correo, 'Por favor ingresa un correo electrónico válido');
        isValid = false;
    } else {
        clearError(correo);
    }
    
    // Validar asunto
    if (!asunto.value) {
        showError(asunto, 'Por favor selecciona un asunto');
        isValid = false;
    } else {
        clearError(asunto);
    }
    
    // Validar mensaje
    if (!mensaje.value.trim()) {
        showError(mensaje, 'Por favor ingresa tu mensaje');
        isValid = false;
    } else if (mensaje.value.trim().length < 10) {
        showError(mensaje, 'El mensaje debe tener al menos 10 caracteres');
        isValid = false;
    } else {
        clearError(mensaje);
    }
    
    return isValid;
}

// Validar formulario de login
function validateLoginForm() {
    const correo = document.getElementById('correo');
    const password = document.getElementById('password');
    
    let isValid = true;
    
    // Validar correo
    if (!correo.value.trim()) {
        showError(correo, 'Por favor ingresa tu correo electrónico');
        isValid = false;
    } else if (!isValidEmail(correo.value)) {
        showError(correo, 'Por favor ingresa un correo electrónico válido');
        isValid = false;
    } else {
        clearError(correo);
    }
    
    // Validar contraseña
    if (!password.value) {
        showError(password, 'Por favor ingresa tu contraseña');
        isValid = false;
    } else if (password.value.length < 6) {
        showError(password, 'La contraseña debe tener al menos 6 caracteres');
        isValid = false;
    } else {
        clearError(password);
    }
    
    return isValid;
}

// Validar formulario de registro
function validateSigninForm() {
    const correo = document.getElementById('correo');
    const usuario = document.getElementById('usuario');
    const password = document.getElementById('password');
    const formFile = document.getElementById('formFile');
    
    let isValid = true;
    
    // Validar correo
    if (!correo.value.trim()) {
        showError(correo, 'Por favor ingresa tu correo electrónico');
        isValid = false;
    } else if (!isValidEmail(correo.value)) {
        showError(correo, 'Por favor ingresa un correo electrónico válido');
        isValid = false;
    } else {
        clearError(correo);
    }
    
    // Validar usuario
    if (!usuario.value.trim()) {
        showError(usuario, 'Por favor ingresa tu nombre de usuario');
        isValid = false;
    } else if (usuario.value.length < 3) {
        showError(usuario, 'El nombre de usuario debe tener al menos 3 caracteres');
        isValid = false;
    } else {
        clearError(usuario);
    }
    
    // Validar contraseña
    if (!password.value) {
        showError(password, 'Por favor ingresa tu contraseña');
        isValid = false;
    } else if (password.value.length < 6) {
        showError(password, 'La contraseña debe tener al menos 6 caracteres');
        isValid = false;
    } else {
        clearError(password);
    }
    
    // Validar archivo (opcional)
    if (formFile && formFile.files.length > 0) {
        const file = formFile.files[0];
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        
        if (!validTypes.includes(file.type)) {
            showError(formFile, 'Por favor selecciona una imagen válida (JPEG, PNG o GIF)');
            isValid = false;
        } else if (file.size > 2 * 1024 * 1024) { // 2MB
            showError(formFile, 'La imagen no debe exceder los 2MB');
            isValid = false;
        } else {
            clearError(formFile);
        }
    }
    
    return isValid;
}

// Función auxiliar para validar email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Mostrar error en un campo
function showError(field, message) {
    clearError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'text-danger mt-1 small';
    errorDiv.textContent = message;
    
    field.classList.add('is-invalid');
    field.parentNode.appendChild(errorDiv);
}

// Limpiar error de un campo
function clearError(field) {
    field.classList.remove('is-invalid');
    
    const errorDiv = field.parentNode.querySelector('.text-danger');
    if (errorDiv) {
        errorDiv.remove();
    }
}