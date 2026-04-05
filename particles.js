// particles.js - Motor de partículas independiente con deformación 3D simulada
const ParticleSystem = (() => {
    let canvas, ctx;
    let particles = [];
    let isActive = false;
    let animationId = null;
    const particleImg = new Image();
    const MAX_PARTICLES = 55; // Un poco más para compensar la deformación

    function init() {
        canvas = document.getElementById("canvas-particulas");
        if (!canvas) return;
        ctx = canvas.getContext("2d");
        resize();
        window.addEventListener('resize', resize);
    }

    function resize() {
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    }

    class Particle {
        constructor() { this.reset(); }
        
        reset() {
            // Posición base esparcida
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.z = Math.random() * 1500; // Profundidad virtual

            // Movimiento suave
            this.vx = (Math.random() - 0.5) * 0.2; // Un poco más lentas
            this.vy = (Math.random() - 0.5) * 0.2;

            // --- NUEVO: Propiedades de Rotación y Deformación ---
            
            // 1. Rotación sobre su propio eje (spin 2D)
            this.angleZ = Math.random() * Math.PI * 2; // Ángulo aleatorio inicial
            this.spinSpeed = (Math.random() - 0.5) * 0.01; // Velocidad de giro lenta

            // 2. Rotación en 3D (eje Y) para deformación
            this.angleY = Math.random() * Math.PI; // Ángulo aleatorio inicial
            this.deformSpeed = 0.005 + Math.random() * 0.01; // Velocidad de balanceo
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Movimiento flotante
            this.x += Math.sin(Date.now() * 0.001 + this.z) * 0.1;
            this.y += Math.cos(Date.now() * 0.001 + this.z) * 0.1;

            // --- ACTUALIZAR: Ángulos ---
            this.angleZ += this.spinSpeed; // Giro constante
            this.angleY += this.deformSpeed; // Balanceo 3D

            // Reiniciar si salen del área extendida
            if (this.x < -150 || this.x > canvas.width + 150 || this.y < -150 || this.y > canvas.height + 150) {
                this.reset();
            }
        }

        draw() {
            // 1. Calcular la escala basada en profundidad virtual (z)
            const scale = 900 / (900 + this.z); 
            
            // Proyectar coordenadas al centro del canvas
            const projectedX = (this.x - canvas.width / 2) * scale + canvas.width / 2;
            const projectedY = (this.y - canvas.height / 2) * scale + canvas.height / 2;

            // --- ZONA DE EXCLUSIÓN CENTRAL ---
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const exclusionWidth = canvas.width * 0.35; // Un poco más pequeño el hueco
            const exclusionHeight = canvas.height * 0.45;

            const isInExclusionZone = (
                projectedX > centerX - exclusionWidth / 2 &&
                projectedX < centerX + exclusionWidth / 2 &&
                projectedY > centerY - exclusionHeight / 2 &&
                projectedY < centerY + exclusionHeight / 2
            );

            // Solo dibujar si está fuera del centro
            if (!isInExclusionZone) {
                
                // 2. Definir dimensiones base y aspect ratio
                const baseWidth = 40; 
                const aspect = 189 / 330; // Alto / Ancho
                const width = baseWidth * scale;
                const height = (baseWidth * aspect) * scale;

                // --- NUEVO: SIMULACIÓN DE ROTACIÓN 3D Y DEFORMACIÓN ---
                
                // Guardar el estado actual del canvas antes de transformar
                ctx.save(); 

                // Mover el punto de origen del dibujo al centro de la partícula
                ctx.translate(projectedX, projectedY);

                // Aplicar rotación 2D sobre su eje (Z)
                ctx.rotate(this.angleZ);

                // --- EL TRUCO DE LA DEFORMACIÓN 3D ---
                // Simulamos rotación en el eje Y (profundidad). 
                // Usamos Math.cos() para hacer que el ancho de la imagen fluctúe 
                // rítmicamente, haciéndola parecer más delgada cuando rota en profundidad.
                const deformFactorY = Math.cos(this.angleY + this.z * 0.01); // Añadimos 'z' para que cada una tenga su ritmo
                
                // Si el factor es muy pequeño (<0.1), no lo dibujamos para evitar líneas muertas
                if (Math.abs(deformFactorY) > 0.1) {
                    // Aplicar la transformación de escala deformada
                    // matrix(horizontalScale, skewY, skewX, verticalScale, translateX, translateY)
                    ctx.transform(deformFactorY, 0, 0, 1, 0, 0);

                    // 3. Manejar opacidad (ligeramente más nítida, 0.85)
                    ctx.globalAlpha = 0.85 * scale;

                    // 4. Dibujar la imagen
                    // IMPORTANTE: Como hemos movido el origen con translate(), 
                    // dibujamos la imagen centrada en (0, 0).
                    ctx.drawImage(particleImg, -width / 2, -height / 2, width, height);
                }

                // Restaurar el estado del canvas (quitar transformaciones)
                ctx.restore();
            }
        }
    }

    function loop() {
        if (!isActive) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        animationId = requestAnimationFrame(loop);
    }

    // Funciones públicas
    return {
        activate: (imagePath) => {
            if (!canvas) init();
            particleImg.src = imagePath;
            particles = Array.from({ length: MAX_PARTICLES }, () => new Particle());
            isActive = true;
            canvas.style.display = "block";
            if (!animationId) loop(); 
        },
        deactivate: () => {
            isActive = false;
            if (canvas) canvas.style.display = "none";
            cancelAnimationFrame(animationId);
            animationId = null; 
        }
    };
})();