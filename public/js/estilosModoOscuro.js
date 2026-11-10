export const estilosModoOscuroString = ` 
  /* Estilos base forzados */
  html[data-bs-theme="dark"] body,
  html[data-bs-theme="dark"] main,
  html[data-bs-theme="dark"] #wrapper,
  html[data-bs-theme="dark"] #content-wrapper,
  html[data-bs-theme="dark"] .navbar {
    background-color: #121214 !important;
    color: #ffffff !important;
  }
  html[data-bs-theme="dark"] .text-secondary,
  html[data-bs-theme="dark"] .lead {
    color: #dee2e6 !important;
  }

   html[data-bs-theme="dark"] .card {
    background-color: #1a1a1e !important;
    border: 1px solid #2d2d34 !important;
  }
  html[data-bs-theme="dark"] .table {
    color: #ffffff !important;
    background-color: #1a1a1e !important;
  }
  /* Fuerza a que las cabeceras blancas pasen a ser gris */
  html[data-bs-theme="dark"] .table thead,
  html[data-bs-theme="dark"] .table thead th,
  html[data-bs-theme="dark"] .table-light {
    background-color: #222227 !important;
    color: #e3e3e3 !important;
    border-bottom: 2px solid #2d2d34 !important;
    font-weight: 600;
  }
  html[data-bs-theme="dark"] .table-hover tbody tr:hover {
    background-color: #222227 !important;
  }
  html[data-bs-theme="dark"] .table td {
    border-color: #2d2d34 !important;
    background-color: transparent !important;
  }

  .navbar .btn-primary,
  nav .btn-primary {
    background-color: transparent !important;
    color: #0d6efd !important;
    border: none !important;
    font-weight: 600;
    font-size: 0.85rem;
    letter-spacing: 0.5px;
    padding: 6px 14px;
    margin-right: 6px;
    transition: all 0.2s ease-in-out;
    border-radius: 6px;
    box-shadow: none !important;
  }
  .navbar .btn-primary:hover,
  nav .btn-primary:hover {
    background-color: rgba(13, 110, 253, 0.08) !important;
    color: #0b5ed7 !important;
  }
  /* Ajuste de contraste para los botones en modo oscuro */
  html[data-bs-theme="dark"] .navbar .btn-primary,
  html[data-bs-theme="dark"] nav .btn-primary {
    color: #4da3ff !important;
  }
  html[data-bs-theme="dark"] .navbar .btn-primary:hover,
  html[data-bs-theme="dark"] nav .btn-primary:hover {
    background-color: rgba(77, 163, 255, 0.15) !important;
  }

  html[data-bs-theme="dark"] .text-muted,
  html[data-bs-theme="dark"] .text-secondary {
    color: #b0b3b8 !important;
  }

  .table tbody tr td[colspan],
  .table tbody tr:only-child td {
    padding: 4rem 2rem !important; 
    text-align: center;
    background-color: transparent !important;
  }

  .table tbody tr td i,
  .table tbody tr td [class*="fa-"],
  .table tbody tr td [class*="bi-"] {
    font-size: 2.5rem !important; 
    margin-bottom: 1rem;
    display: inline-block;
    opacity: 0.6;
    transition: transform 0.3s ease;
  }

  .table tbody tr:hover td i,
  .table tbody tr:hover td [class*="fa-"] {
    transform: translateY(-5px);
  }

  .text-muted, .text-secondary {
    opacity: 0.75;
  }

  html[data-bs-theme="dark"] .table tbody tr td i,
  html[data-bs-theme="dark"] .table tbody tr td [class*="fa-"] {
    color: #398bfd !important; 
    opacity: 0.8;
  }

  html[data-bs-theme="dark"] .table tbody tr td {
    color: #f8f9fa !important; 
  }

  /* Estabilizacion de botones en columna acciones */
  .table tbody tr td:last-child .btn,
  .table tbody tr td:last-child button {
    background: transparent !important;
    border: none !important; 
    padding: 4px 6px !important; 
    transition: transform 0.2s ease, opacity 0.2s ease;
    opacity: 0.85;
    box-shadow: none !important;
  }

  .table tbody tr td:last-child .btn i,
  .table tbody tr td:last-child button i,
  .table tbody tr td:last-child .btn [class*="fa-"] {
    font-size: 1rem !important; 
  }

  /* REDUCCIÓN DE TAMAÑO PARA LA COLUMNA ESTADO */
  .table tbody tr td .badge {
    font-size: 0.72rem !important;
    padding: 3px 6px !important;
    border-radius: 4px !important;
    font-weight: 600 !important;
    display: inline-flex !important;
    align-items: center;
    gap: 3px;
  }

  .table tbody tr td .badge i,
  .table tbody tr td .badge svg {
    font-size: 0.72rem !important;
    margin: 0 !important;
  }

  html[data-bs-theme="dark"] .card-footer,
  html[data-bs-theme="dark"] [id^="paginacion"] {
    background-color: #1a1a1e !important;
    border-color: #2d2d34 !important;
    color: #ffffff !important;
  }

  html[data-bs-theme="dark"] .table td .btn:hover,
  html[data-bs-theme="dark"] .table td button:hover,
  .table td .btn:hover,
  .table td button:hover {
    transform: scale(1.2) !important; 
    opacity: 1 !important;
  }

  html[data-bs-theme="dark"] .table td .btn .fa-eye,
  html[data-bs-theme="dark"] .table td .btn .bi-eye { color: #4da3ff !important; }
  html[data-bs-theme="dark"] .table td .btn .fa-edit, 
  html[data-bs-theme="dark"] .table td .btn .fa-pencil-alt,
  html[data-bs-theme="dark"] .table td .btn .bi-pencil { color: #ffd54f !important; }
  html[data-bs-theme="dark"] .table td .btn .fa-user-slash,
  html[data-bs-theme="dark"] .table td .btn .bi-person-x { color: #ff8a65 !important; }
  html[data-bs-theme="dark"] .table td .btn .fa-trash,
  html[data-bs-theme="dark"] .table td .btn .bi-trash { color: #ff5252 !important; }

  #btn-cambiar-tema {
    border: none !important;
    background: transparent !important;
    font-size: 1.15rem;
    transition: transform 0.3s ease, color 0.2s ease;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
  }

  /* Efecto hover */
  #btn-cambiar-tema:hover {
    transform: rotate(15deg) scale(1.15);
    background-color: rgba(0, 0, 0, 0.05) !important;
  }

  /* Hover adaptado cuando está modo oscuro */
  html[data-bs-theme="dark"] #btn-cambiar-tema:hover {
    background-color: rgba(255, 255, 255, 0.1) !important;
    color: #ffca28 !important;
  }
`;

