export class Pagination {
    constructor(data, itemsPerPage, tableBodyEl, paginationEl, templateFn) {
        this.data = data; // Array completo de datos 
        this.itemsPerPage = itemsPerPage; // Cantidad de filas por página
        this.currentPage = 1; 
        this.tableBodyEl = tableBodyEl; // El <tbody> de la tabla
        this.paginationEl = paginationEl; // El <div> donde irán los botones
        this.templateFn = templateFn; // la función que dibuja los <tr> 
    }

    // Útil para el buscador en tiempo real
    updateData(newData) {
        this.data = newData;
        this.currentPage = 1; // Volvemos a la página 1 al filtrar
        this.render();
    }

    render() {
        //  Calcular el total de páginas
        const totalPages = Math.ceil(this.data.length / this.itemsPerPage) || 1;
        if (this.currentPage > totalPages) this.currentPage = totalPages;

        // Cortar el array original para obtener solo los datos de la página actual
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const paginatedItems = this.data.slice(start, end);

        // Inyectar las filas en la tabla 
        this.tableBodyEl.innerHTML = this.templateFn(paginatedItems);

        // Dibujar los botones
        this.renderControls(totalPages);
    }

    renderControls(totalPages) {
        // Si hay una sola página (o ninguna), no mostramos botones
        if (totalPages <= 1) {
            this.paginationEl.innerHTML = '';
            return;
        }

        let html = `<ul class="pagination pagination-sm justify-content-end mb-0">`;

        // Botón Anterior
        html += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${this.currentPage - 1}">Anterior</a>
            </li>
        `;

        // Números de página
        for (let i = 1; i <= totalPages; i++) {
            html += `
                <li class="page-item ${this.currentPage === i ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }

        // Botón Siguiente
        html += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${this.currentPage + 1}">Siguiente</a>
            </li>
        `;

        html += `</ul>`;
        this.paginationEl.innerHTML = html;

        // 5. Escuchar los clics en los botones de paginación
        this.paginationEl.querySelectorAll('.page-link').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const parentLi = e.target.closest('.page-item');
                
                // Ignorar clics en botones deshabilitados o en la página actual
                if (parentLi.classList.contains('disabled') || parentLi.classList.contains('active')) return;

                // Actualizar página y volver a renderizar
                this.currentPage = parseInt(e.target.dataset.page);
                this.render();
            });
        });
    }
}