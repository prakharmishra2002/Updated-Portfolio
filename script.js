/**
 * Main JavaScript file for portfolio website
 * Includes theme toggle, 3D background, animations, and form handling
 */

// Declare global variables for external libraries
const AOS = window.AOS
const THREE = window.THREE
const emailjs = window.emailjs
const gsap = window.gsap

document.addEventListener("DOMContentLoaded", () => {
  // ===== Toggle Experience Section =====
  window.toggleExperience = () => {
    const moreExperience = document.getElementById("more-experience")
    const btn = document.getElementById("see-more-btn")

    if (moreExperience.style.display === "none") {
      moreExperience.style.display = "block"
      btn.textContent = "See Less"
    } else {
      moreExperience.style.display = "none"
      btn.textContent = "See More"
    }
  }

  // Initialize AOS animation library
  AOS.init({
    duration: 1000,
    once: true,
  })

  // ===== Theme Toggle Functionality =====
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

  // ===== 3D Background Setup =====
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

  // Animation loop
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

  // ===== Smooth Scrolling for Navigation Links =====
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

  // ===== Form Submission Handler with EmailJS =====
  // Initialize EmailJS with your public key
  emailjs.init("Pn4yFLXy4sk-x5yry")
  const contactForm = document.querySelector("#contact-form")
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form data
      const formData = new FormData(contactForm)

      // Send email using EmailJS
      emailjs
        .send("service_s069mpj", "template_fnsnl9p", {
          from_name: formData.get("from_name"),
          reply_to: formData.get("reply_to"),
          subject: formData.get("subject"),
          message: formData.get("message"),
          to_email: "prakharmishra027@gmail.com",
        })
        .then(() => {
          alert("Thank you for your message! I will get back to you soon.")
          contactForm.reset()
        })
        .catch((error) => {
          console.error("Error:", error)
          alert("There was an error sending your message. Please try again.")
        })
    })
  }

  // ===== Navbar Background Change on Scroll =====
  window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar")
    if (window.scrollY > 50) {
      navbar.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)"
    } else {
      navbar.style.boxShadow = "none"
    }
  })

  // ===== GSAP Animations =====
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

  // ===== Projects Scrolling Functionality =====
  const projectsContainer = document.getElementById("projectsContainer")
  const scrollHint = document.getElementById("scrollHint")

  if (projectsContainer && scrollHint) {
    const projectCards = projectsContainer.children

    // Check if there are more than 3 projects
    if (projectCards.length > 3) {
      let isDragging = false
      let startX
      let scrollLeft

      // Mouse scroll functionality
      projectsContainer.addEventListener("mousedown", (e) => {
        isDragging = true
        startX = e.pageX - projectsContainer.offsetLeft
        scrollLeft = projectsContainer.scrollLeft
      })

      projectsContainer.addEventListener("mouseleave", () => {
        isDragging = false
      })

      projectsContainer.addEventListener("mouseup", () => {
        isDragging = false
      })

      projectsContainer.addEventListener("mousemove", (e) => {
        if (!isDragging) return
        e.preventDefault()
        const x = e.pageX - projectsContainer.offsetLeft
        const walk = (x - startX) * 2 // Scroll speed
        projectsContainer.scrollLeft = scrollLeft - walk
      })

      // Show/hide scroll hint based on scroll position
      projectsContainer.addEventListener("scroll", () => {
        const maxScroll = projectsContainer.scrollWidth - projectsContainer.clientWidth
        if (projectsContainer.scrollLeft < maxScroll - 10) {
          scrollHint.classList.add("visible")
        } else {
          scrollHint.classList.remove("visible")
        }
      })

      // Initial check for scroll hint visibility
      if (projectsContainer.scrollWidth > projectsContainer.clientWidth) {
        scrollHint.classList.add("visible")
      }
    }
  }
})

