const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const container = document.getElementById('particle-container');

container.appendChild(canvas);

let particles = [];
const particleCount = 80;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.init();
    }

    init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random();
        this.fading = Math.random() > 0.5;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.fading) {
            this.opacity -= 0.005;
            if (this.opacity <= 0) this.fading = false;
        } else {
            this.opacity += 0.005;
            if (this.opacity >= 1) this.fading = true;
        }

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        const colors = [
            'rgba(0, 102, 255,', // Blue
            'rgba(248, 223, 28,', // Yellow
            'rgba(0, 204, 136,'  // Green
        ];
        const color = colors[Math.floor(this.x + this.y) % 3];

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${color} ${this.opacity * 0.25})`;
        ctx.fill();
    }
}

function init() {
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}

init();
animate();

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

tl.from(".neon-text", {
    duration: 1.5,
    y: 100,
    opacity: 0,
    skewY: 10,
    stagger: 0.1,
    scale: 0.8,
    delay: 0.2
})
    .from("h2", {
        duration: 1,
        y: -50,
        opacity: 0,
    }, "-=1")
    .from("p", {
        duration: 1,
        y: 30,
        opacity: 0,
    }, "-=0.8")
    .from(".social-card", {
        duration: 1.2,
        y: 50,
        opacity: 0,
        stagger: 0.1,
        ease: "back.out(1.7)"
    }, "-=0.6")
    .from(".brand-footer", {
        duration: 1.5,
        y: 20,
        opacity: 0,
        ease: "power2.out"
    }, "-=0.4");

// Parallax and Mouse Effects
const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");
const spotlight = document.getElementById("mouse-spotlight");

window.addEventListener("mousemove", (e) => {
    const { clientX, clientY } = e;

    // Show cursor on first move
    gsap.set([cursorDot, cursorOutline, spotlight], { opacity: 1 });

    // Update Spotlight
    spotlight.style.setProperty("--x", `${clientX}px`);
    spotlight.style.setProperty("--y", `${clientY}px`);

    // Custom Cursor Followering
    gsap.to(cursorDot, {
        x: clientX,
        y: clientY,
        duration: 0.1,
        ease: "power2.out"
    });

    gsap.to(cursorOutline, {
        x: clientX - 16,
        y: clientY - 16,
        duration: 0.4,
        ease: "power3.out"
    });

    // Global Parallax
    const x = (clientX - window.innerWidth / 2) / 50;
    const y = (clientY - window.innerHeight / 2) / 50;

    gsap.to(".neon-text", {
        duration: 2,
        x: x * 1.5,
        y: y * 1.5,
        ease: "power2.out"
    });

    gsap.to(".logo-glow", {
        duration: 2,
        x: x * 0.5,
        y: y * 0.5,
        ease: "power2.out"
    });
});

// Magnetic & Interaction Logic for Social Cards
document.querySelectorAll(".social-card").forEach(card => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Card Tilt
        gsap.to(card, {
            duration: 0.5,
            x: x * 0.3,
            y: y * 0.3,
            rotateX: -y * 0.1,
            rotateY: x * 0.1,
            ease: "power2.out"
        });

        // Hover Cursor State
        gsap.to(cursorOutline, {
            width: 70,
            height: 70,
            x: e.clientX - 35,
            y: e.clientY - 35,
            borderColor: "rgba(0, 255, 170, 1)",
            backgroundColor: "rgba(0, 255, 170, 0.1)",
            duration: 0.3
        });

        gsap.to(cursorDot, { scale: 0, duration: 0.2 });
    });

    card.addEventListener("mouseleave", () => {
        gsap.to(card, {
            duration: 0.5,
            x: 0,
            y: 0,
            rotateX: 0,
            rotateY: 0,
            ease: "elastic.out(1, 0.3)"
        });

        gsap.to(cursorOutline, {
            width: 32,
            height: 32,
            borderColor: "rgba(0, 255, 170, 0.4)",
            backgroundColor: "transparent",
            duration: 0.3
        });

        gsap.to(cursorDot, { scale: 1, duration: 0.2 });
    });
});
