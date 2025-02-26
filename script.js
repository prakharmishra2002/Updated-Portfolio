document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS
  AOS.init({
    duration: 1000,
    once: true,
  })

  // Theme toggle functionality
  const themeToggle = document.getElementById("theme-toggle")
  const body = document.body
  const icon = themeToggle.querySelector("i")

  // Check for saved theme preference
  const savedTheme = localStorage.getItem("theme") || "light"
  body.setAttribute("data-theme", savedTheme)
  updateThemeIcon(savedTheme === "dark")

  // Theme toggle click handler
  themeToggle.addEventListener("click", () => {
    const isDark = body.getAttribute("data-theme") === "dark"
    const newTheme = isDark ? "light" : "dark"

    body.setAttribute("data-theme", newTheme)
    localStorage.setItem("theme", newTheme)
    updateThemeIcon(!isDark)

    // Update particles color
    if (particlesMaterial) {
      particlesMaterial.color.set(getComputedStyle(document.body).getPropertyValue("--text-primary"))
    }
  })

  function updateThemeIcon(isDark) {
    icon.className = isDark ? "bi bi-sun-fill" : "bi bi-moon-fill"
  }

  // 3D Background Setup
  const canvas = document.getElementById("background-canvas")
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true })
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

  // Set renderer size
  const setSize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
  setSize()
  window.addEventListener("resize", setSize)

  // Create particles
  const particlesGeometry = new THREE.BufferGeometry()
  const particlesCount = 5000
  const posArray = new Float32Array(particlesCount * 3)

  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 5
  }

  particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3))

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: getComputedStyle(document.body).getPropertyValue("--text-primary"),
  })

  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
  scene.add(particlesMesh)

  camera.position.z = 2

  // Mouse movement effect
  let mouseX = 0
  let mouseY = 0

  document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX
    mouseY = event.clientY
  })

  // Animation
  const animate = () => {
    requestAnimationFrame(animate)

    particlesMesh.rotation.y += 0.001
    particlesMesh.rotation.x += 0.001

    // Mouse movement effect
    particlesMesh.rotation.x += mouseY * 0.00001
    particlesMesh.rotation.y += mouseX * 0.00001

    renderer.render(scene, camera)
  }
  animate()

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        })
      }
    })
  })

  // Form submission handler
  const contactForm = document.querySelector("#contact-form")
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()
      // Add your form submission logic here
      alert("Thank you for your message! I will get back to you soon.")
      contactForm.reset()
    })
  }

  // Navbar background change on scroll
  window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar")
    if (window.scrollY > 50) {
      navbar.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)"
    } else {
      navbar.style.boxShadow = "none"
    }
  })

  // GSAP Animations
  if (typeof gsap !== "undefined") {
    gsap.from(".profile-3d-container", {
      duration: 1.5,
      y: 100,
      opacity: 0,
      ease: "power4.out",
    })

    // Scroll-triggered animations for skill items
    if (gsap.ScrollTrigger) {
      gsap.to(".skill-item", {
        scrollTrigger: {
          trigger: ".skills-container",
          start: "top center",
          end: "bottom center",
          scrub: 1,
        },
        stagger: 0.2,
        y: 0,
        opacity: 1,
        ease: "power2.out",
      })
    }
  }
})

