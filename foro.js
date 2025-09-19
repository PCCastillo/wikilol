document.addEventListener('DOMContentLoaded', function() {
    // Inicializar tooltips de Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Validación del formulario de debate
    const debateForm = document.getElementById('debateForm');
    if (debateForm) {
        debateForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateDebateForm()) {
                // Simular envío exitoso
                simulateDebateSubmission();
            }
        });
        
        // Validación en tiempo real
        setupRealTimeValidation();
    }
    
    // Funcionalidad para los elementos de debate
    setupDebateInteractions();
});

// Validar formulario de debate
function validateDebateForm() {
    const titulo = document.getElementById('titulo');
    const campeon = document.getElementById('campeon');
    const categoria = document.getElementById('categoria');
    const mensaje = document.getElementById('mensaje');
    
    let isValid = true;
    
    // Validar título
    if (!titulo.value.trim()) {
        showError(titulo, 'Por favor ingresa un título para el debate');
        isValid = false;
    } else if (titulo.value.trim().length < 10) {
        showError(titulo, 'El título debe tener al menos 10 caracteres');
        isValid = false;
    } else {
        showSuccess(titulo);
    }
    
    // Validar campeón
    if (!campeon.value) {
        showError(campeon, 'Por favor selecciona un campeón');
        isValid = false;
    } else {
        showSuccess(campeon);
    }
    
    // Validar categoría
    if (!categoria.value) {
        showError(categoria, 'Por favor selecciona una categoría');
        isValid = false;
    } else {
        showSuccess(categoria);
    }
    
    // Validar mensaje
    if (!mensaje.value.trim()) {
        showError(mensaje, 'Por favor escribe tu mensaje');
        isValid = false;
    } else if (mensaje.value.trim().length < 50) {
        showError(mensaje, 'El mensaje debe tener al menos 50 caracteres');
        isValid = false;
    } else {
        showSuccess(mensaje);
    }
    
    return isValid;
}

// Configurar validación en tiempo real
function setupRealTimeValidation() {
    const titulo = document.getElementById('titulo');
    const mensaje = document.getElementById('mensaje');
    
    if (titulo) {
        titulo.addEventListener('input', function() {
            if (titulo.value.trim().length >= 10) {
                showSuccess(titulo);
            }
        });
    }
    
    if (mensaje) {
        // Contador de caracteres
        const counter = document.createElement('div');
        counter.className = 'form-text character-counter';
        counter.textContent = `Caracteres: ${mensaje.value.length}/50 mínimo`;
        mensaje.parentNode.appendChild(counter);
        
        mensaje.addEventListener('input', function() {
            counter.textContent = `Caracteres: ${mensaje.value.length}/50 mínimo`;
            
            if (mensaje.value.trim().length >= 50) {
                showSuccess(mensaje);
                counter.classList.remove('text-danger');
                counter.classList.add('text-success');
            } else {
                counter.classList.remove('text-success');
                counter.classList.add('text-danger');
            }
        });
    }
}

// Simular envío de debate
function simulateDebateSubmission() {
    const debateForm = document.getElementById('debateForm');
    const submitBtn = debateForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Cambiar texto del botón y deshabilitarlo
    submitBtn.textContent = 'Publicando...';
    submitBtn.disabled = true;
    
    // Simular retraso de red
    setTimeout(() => {
        // Mostrar mensaje de éxito
        alert('¡Debate publicado con éxito! Aparecerá en la lista después de ser revisado.');
        
        // Restaurar botón
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Reiniciar formulario
        debateForm.reset();
        
        // Limpiar validaciones
        clearAllValidation();
    }, 2000);
}

// Configurar interacciones de debate
function setupDebateInteractions() {
    // Hacer clic en elementos de debate para "expandirlos"
    const debateItems = document.querySelectorAll('.debate-item');
    debateItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function(e) {
            if (!e.target.closest('.badge')) { // No hacer nada si se hace clic en una etiqueta
                this.classList.toggle('expanded');
                
                if (this.classList.contains('expanded')) {
                    this.querySelector('p').style.display = 'block';
                    this.style.height = 'auto';
                } else {
                    this.querySelector('p').style.display = '-webkit-box';
                    this.style.height = '120px';
                }
            }
        });
    });
    
    // Sistema de votación simple
    setupVotingSystem();
}

// Sistema de votación simple
function setupVotingSystem() {
    // Agregar botones de votación a cada debate
    const debateItems = document.querySelectorAll('.debate-item');
    debateItems.forEach(item => {
        const voteSection = document.createElement('div');
        voteSection.className = 'vote-section mt-3';
        voteSection.innerHTML = `
            <button class="btn btn-sm btn-outline-success vote-btn me-2" data-vote="up">
                <i class="bi bi-arrow-up"></i> <span class="vote-count">0</span>
            </button>
            <button class="btn btn-sm btn-outline-danger vote-btn" data-vote="down">
                <i class="bi bi-arrow-down"></i> <span class="vote-count">0</span>
            </button>
        `;
        
        // Evitar que el clic en los botones propague al elemento padre
        voteSection.querySelectorAll('.vote-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                handleVote(this);
            });
        });
        
        item.appendChild(voteSection);
    });
}

// Manejar votos
function handleVote(button) {
    const voteType = button.getAttribute('data-vote');
    const voteCount = button.querySelector('.vote-count');
    let count = parseInt(voteCount.textContent);
    
    // Resetear otros botones en el mismo debate
    const debateItem = button.closest('.debate-item');
    const otherButton = debateItem.querySelector(`.vote-btn[data-vote="${voteType === 'up' ? 'down' : 'up'}"]`);
    
    if (button.classList.contains('active')) {
        // Quitar voto
        button.classList.remove('active');
        count--;
        voteCount.textContent = count;
        
        if (voteType === 'up') {
            button.classList.remove('btn-success');
            button.classList.add('btn-outline-success');
        } else {
            button.classList.remove('btn-danger');
            button.classList.add('btn-outline-danger');
        }
    } else {
        // Agregar voto
        button.classList.add('active');
        count++;
        voteCount.textContent = count;
        
        // Remover voto opuesto si existe
        if (otherButton.classList.contains('active')) {
            const otherCount = otherButton.querySelector('.vote-count');
            let otherCountValue = parseInt(otherCount.textContent);
            otherCountValue--;
            otherCount.textContent = otherCountValue;
            
            otherButton.classList.remove('active');
            if (voteType === 'up') {
                otherButton.classList.remove('btn-danger');
                otherButton.classList.add('btn-outline-danger');
            } else {
                otherButton.classList.remove('btn-success');
                otherButton.classList.add('btn-outline-success');
            }
        }
        
        // Cambiar estilos del botón
        if (voteType === 'up') {
            button.classList.remove('btn-outline-success');
            button.classList.add('btn-success');
        } else {
            button.classList.remove('btn-outline-danger');
            button.classList.add('btn-danger');
        }
    }
}

// Mostrar error en un campo
function showError(field, message) {
    clearValidation(field);
    
    field.classList.add('is-invalid');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

// Mostrar éxito en un campo
function showSuccess(field) {
    clearValidation(field);
    field.classList.add('is-valid');
}

// Limpiar validación de un campo
function clearValidation(field) {
    field.classList.remove('is-invalid', 'is-valid');
    
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Limpiar todas las validaciones
function clearAllValidation() {
    const fields = document.querySelectorAll('.form-control, .form-select');
    fields.forEach(field => {
        clearValidation(field);
    });
    
    const characterCounter = document.querySelector('.character-counter');
    if (characterCounter) {
        characterCounter.textContent = 'Caracteres: 0/50 mínimo';
        characterCounter.classList.remove('text-success', 'text-danger');
    }
}

// Filtro de búsqueda simple
function setupSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Buscar debates...';
    searchInput.className = 'form-control mb-3';
    
    const debateSection = document.querySelector('.debates-list');
    debateSection.parentNode.insertBefore(searchInput, debateSection);
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const debateItems = document.querySelectorAll('.debate-item');
        
        debateItems.forEach(item => {
            const title = item.querySelector('h5').textContent.toLowerCase();
            const content = item.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || content.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// Inicializar búsqueda si no existe
if (!document.querySelector('input[placeholder*="Buscar"]')) {
    document.addEventListener('DOMContentLoaded', setupSearch);
}