// Función auxiliar para actualizar el icono visualmente dependiendo de si es luna o sol
const actualizarIconoTema = (tema) => {
  const botones = document.querySelectorAll('#btn-cambiar-tema');
  botones.forEach(btn => {
    const icono = btn.querySelector('i');
    if (icono) {
      if (tema === 'dark') {
        // En el modo oscuro pasa a ser un sol
        icono.className = 'fas fa-sun text-warning';
      } else {
        // En el modo claro pasa a ser una luna
        icono.className = 'fas fa-moon text-secondary';
      }
    }
  });
};

const cargarTemaGuardado = () => {
  const temaGuardado = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-bs-theme', temaGuardado);
  setTimeout(() => actualizarIconoTema(temaGuardado), 50);
};

// Se ejecuta inmediatamente para evitar el parpadeo blanco al cargar
cargarTemaGuardado();

document.addEventListener('click', (e) => {
  if (e.target.closest('#btn-cambiar-tema')) {
    const html = document.documentElement;
    const nuevoTema = html.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-bs-theme', nuevoTema);
    localStorage.setItem('theme', nuevoTema);
    
    // Cambiamos el icono
    actualizarIconoTema(nuevoTema);
    
    // Notificación visual con Toastr
    if (typeof toastr !== 'undefined') {
      toastr.success(`Modo ${nuevoTema === 'dark' ? 'oscuro' : 'claro'} activado`);
    }
  }
});




