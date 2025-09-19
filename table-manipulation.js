// table-manipulation.js
document.addEventListener('DOMContentLoaded', function() {
    // Hacer las tablas ordenables
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
        makeTableSortable(table);
    });
    
    // Agregar funcionalidad de búsqueda si existe un input de búsqueda
    const searchInput = document.querySelector('input[type="text"][placeholder*="Buscar"]');
    if (searchInput) {
        setupSearchFunctionality(searchInput);
    }
});

// Hacer una tabla ordenable
function makeTableSortable(table) {
    const headers = table.querySelectorAll('th');
    const tbody = table.querySelector('tbody');
    
    headers.forEach((header, index) => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', () => {
            // Determinar el tipo de datos de la columna
            const columnType = determineColumnType(table, index);
            
            // Ordenar la tabla
            sortTable(table, index, columnType);
            
            // Actualizar indicadores visuales
            updateSortIndicators(headers, header);
        });
    });
}

// Determinar el tipo de datos de una columna
function determineColumnType(table, columnIndex) {
    const rows = table.querySelectorAll('tbody tr');
    if (rows.length === 0) return 'string';
    
    const sampleCell = rows[0].cells[columnIndex];
    const sampleText = sampleCell.textContent.trim();
    
    // Verificar si es numérico (incluyendo porcentajes)
    if (/^[\d.,]+%?$/.test(sampleText)) {
        return 'number';
    }
    
    // Verificar si es fecha
    if (Date.parse(sampleText)) {
        return 'date';
    }
    
    // Por defecto, tratar como texto
    return 'string';
}

// Ordenar tabla por columna
function sortTable(table, columnIndex, columnType) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const direction = tbody.getAttribute('data-sort-direction') === 'asc' ? 'desc' : 'asc';
    
    // Ordenar filas
    rows.sort((a, b) => {
        let aValue = a.cells[columnIndex].textContent.trim();
        let bValue = b.cells[columnIndex].textContent.trim();
        
        // Convertir valores según el tipo de columna
        if (columnType === 'number') {
            aValue = parseFloat(aValue.replace('%', '').replace(',', '.'));
            bValue = parseFloat(bValue.replace('%', '').replace(',', '.'));
        } else if (columnType === 'date') {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
        }
        
        // Comparar valores
        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
    });
    
    // Eliminar filas existentes
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    
    // Agregar filas ordenadas
    rows.forEach(row => {
        tbody.appendChild(row);
    });
    
    // Guardar dirección de ordenamiento
    tbody.setAttribute('data-sort-direction', direction);
    tbody.setAttribute('data-sort-column', columnIndex);
}

// Actualizar indicadores visuales de ordenamiento
function updateSortIndicators(headers, currentHeader) {
    headers.forEach(header => {
        header.querySelector('.sort-indicator')?.remove();
        header.classList.remove('sorted-asc', 'sorted-desc');
    });
    
    const indicator = document.createElement('span');
    indicator.className = 'sort-indicator ms-1';
    
    const tbody = currentHeader.closest('table').querySelector('tbody');
    const direction = tbody.getAttribute('data-sort-direction');
    
    if (direction === 'asc') {
        indicator.textContent = '↑';
        currentHeader.classList.add('sorted-asc');
    } else {
        indicator.textContent = '↓';
        currentHeader.classList.add('sorted-desc');
    }
    
    currentHeader.appendChild(indicator);
}

// Configurar funcionalidad de búsqueda
function setupSearchFunctionality(searchInput) {
    const searchButton = searchInput.nextElementSibling;
    const table = searchInput.closest('.container').querySelector('table');
    
    if (!table) return;
    
    searchButton.addEventListener('click', () => {
        filterTable(table, searchInput.value);
    });
    
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            filterTable(table, searchInput.value);
        }
    });
}

// Filtrar tabla según término de búsqueda
function filterTable(table, searchTerm) {
    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        let found = false;
        const cells = row.querySelectorAll('td');
        
        cells.forEach(cell => {
            if (cell.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
                found = true;
            }
        });
        
        row.style.display = found ? '' : 'none';
    });
}

// Función para agregar una nueva fila a la tabla
function addTableRow(table, data) {
    const tbody = table.querySelector('tbody');
    const newRow = document.createElement('tr');
    
    data.forEach(cellData => {
        const cell = document.createElement('td');
        cell.textContent = cellData;
        newRow.appendChild(cell);
    });
    
    tbody.appendChild(newRow);
}

// Función para eliminar una fila de la tabla
function deleteTableRow(table, rowIndex) {
    const tbody = table.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');
    
    if (rowIndex >= 0 && rowIndex < rows.length) {
        tbody.removeChild(rows[rowIndex]);
    }
}