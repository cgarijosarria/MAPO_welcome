// Mensaje de prueba en la consola
console.log('Página Prueba MAPO');

// Funcion estrellas fondo
let sp = document.querySelectorAll(".backg span");

setInterval(() => {
    let no = Math.floor(Math.random() * 100);  // Genera un número aleatorio entre 0 y 99
    let h = Math.floor(Math.random() * 100);   // Genera un porcentaje aleatorio para el valor de 'top'
    let w = Math.floor(Math.random() * 100);   // Genera un porcentaje aleatorio para el valor de 'left'

    // Asigna posiciones y hace visible la estrella
    sp[no].style.top = h + '%';
    sp[no].style.left = w + '%';
    sp[no].style.opacity = '1';  // Hace la estrella visible
}, 80);

// Función para inicializar y animar el globo (tierra)
function main() {
    const canvas = document.querySelector('#globe');
    const scene = new THREE.Scene();

    // Inicializa el renderizador
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    //renderer.setSize(window.innerWidth, window.innerHeight);
    //renderer.setPixelRatio(window.devicePixelRatio);
    //renderer.setClearColor(0x000000, 0); // Fondo transparente
    function resizeRenderer() {
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    // Cámara (perspectiva)
    //const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);    
    //camera.position.set(0, 0.5, 1.5); // Ajuste de la posición de la cámara
    if (camera.aspect > 1) {
        // Si el canvas es más ancho (pantallas horizontales o dispositivos más grandes)
        camera.position.set(0, 0.5, 1);  // Más cerca de la esfera
    } else {
        // Si el canvas es más alto (pantallas verticales o dispositivos móviles)
        camera.position.set(0, 0.5, 1.5);  // Un poco más lejos para abarcar toda la esfera
    }
    camera.lookAt(0, 0, 0); // Apunta a la Tierra

    resizeRenderer(); // Ajustar tamaño inicial
    window.addEventListener('resize', resizeRenderer); // Ajustar al redimensionar

    // Crear geometría y material de la esfera (Tierra)
    const earthGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('../img/earth-11048_1280.png'),
        bumpMap: new THREE.TextureLoader().load('../img/earth-11048_1280.png'),
        bumpScale: 0.01,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earthMesh);

    // Iluminación ambiental
    const ambientlight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientlight);

    // Iluminación puntual
    const pointerlight = new THREE.PointLight(0xffffff, 0.9);
    pointerlight.position.set(5, 3, 5); // Posición de la luz
    scene.add(pointerlight);

    // Función de renderizado
    const render = () => {
        earthMesh.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), 0.0007); // Rotación del globo
        renderer.render(scene, camera);
    };

    // Función de animación
    const animate = () => {
        requestAnimationFrame(animate);
        render();
    };

    // Inicia la animación
    animate();
}

// Funcion movimiento secciones
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const otherSection = sectionId === 'Productos' ? document.getElementById('Contacto') : document.getElementById('Productos');
    
    if (section.classList.contains('activa')) {
        section.classList.remove('activa'); // Oculta la sección si ya está activa
    } else {
        section.classList.add('activa'); // Muestra la sección seleccionada
        otherSection.classList.remove('activa'); // Oculta la otra sección si está abierta
    }
}
/* Eventos para los enlaces del header */
document.getElementById('toggleProductos').addEventListener('click', function() {
    toggleSection('Productos');
    ajustarCanvas();
});

document.getElementById('toggleContacto').addEventListener('click', function() {
    toggleSection('Contacto');
    ajustarCanvas();
});
/* Evento para el visor central: al hacer clic, oculta ambas secciones */
document.getElementById('toggleVisor').addEventListener('click', function() {
    document.getElementById('Productos').classList.remove('activa');
    document.getElementById('Contacto').classList.remove('activa');
    ajustarCanvas();
});

function ajustarCanvas() {
    const productosActivo = document.getElementById('Productos').classList.contains('activa');
    const contactoActivo = document.getElementById('Contacto').classList.contains('activa');
    const globe = document.getElementById('globe');
    
    let translateX = -50;
    if (productosActivo) {
        translateX = 0; // Mueve a la derecha
    } else if (contactoActivo) {
        translateX = -100; // Mueve a la izquierda
    }    
    globe.style.transition = "transform 2s ease-in-out";
    globe.style.transform = `translate(${translateX}%, -50%)`;
}

// Función que se ejecuta cuando la página carga completamente
window.onload = function () {
    main();
}
