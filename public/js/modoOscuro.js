// =========================================================================
// APLICACION DE MODO OSCURO 
// =========================================================================

const estilosOscuros = document.createElement('style');
estilosOscuros.id = 'estilos-modo-oscuro-forzados';
estilosOscuros.innerHTML = ` 
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
`;

// Insertamos los estilos en el head al cargar la página
if (!document.getElementById('estilos-modo-oscuro-forzados')) {
  document.head.appendChild(estilosOscuros);
}

const cargarTemaGuardado = () => {
  const temaGuardado = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-bs-theme', temaGuardado);
};

// Se ejecuta inmediatamente para evitar el parpadeo blanco al cargar
cargarTemaGuardado();

document.addEventListener('click', (e) => {
  if (e.target.closest('#btn-cambiar-tema')) {
    const html = document.documentElement;
    const nuevoTema = html.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-bs-theme', nuevoTema);
    localStorage.setItem('theme', nuevoTema);
    
    // Notificación visual con Toastr
    if (typeof toastr !== 'undefined') {
      toastr.success(`Modo ${nuevoTema === 'dark' ? 'oscuro' : 'claro'} activado`);
    }
  }
});