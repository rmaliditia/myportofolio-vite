import "./style.css";

import { gsap } from "gsap/dist/gsap";
import { CustomEase } from "gsap/dist/CustomEase";
import { Draggable } from "gsap/dist/Draggable";
import { Flip } from "gsap/dist/Flip";
import { MorphSVGPlugin } from "gsap/dist/MorphSVGPlugin";
import { MotionPathHelper } from "gsap/dist/MotionPathHelper";
import { MotionPathPlugin } from "gsap/dist/MotionPathPlugin";
import { ScrambleTextPlugin } from "gsap/dist/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ScrollSmoother } from "gsap/dist/ScrollSmoother";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";
import { SplitText } from "gsap/dist/SplitText";
import { TextPlugin } from "gsap/dist/TextPlugin";

gsap.registerPlugin(
  Draggable,
  Flip,
  MotionPathHelper,
  MotionPathPlugin,
  MorphSVGPlugin,
  ScrambleTextPlugin,
  ScrollTrigger,
  ScrollSmoother,
  ScrollToPlugin,
  SplitText,
  TextPlugin,
  CustomEase,
);

// ===========================
//        GSAP CODE START
// ===========================

// ===== SIDEBAR CODE START =====
// Tangkap Elemen
const btnOpen = document.getElementById("btn-open-menu");
const btnClose = document.getElementById("btn-close-menu");
const menuContainer = document.getElementById("fullscreen-menu");
const menuContent = document.getElementById("menu-content");
const menuPath = document.getElementById("menu-path");
const menuItems = document.querySelectorAll(".menu-item");
const overlay = document.getElementById("menu-overlay");

// Data Path untuk Curve Swipe
const startPath = "M 100 0 L 100 100 L 50 100 Q 0 50 50 0 Z";
const endPath = "M 100 0 L 100 100 L 0 100 Q 0 50 0 0 Z";

// Setup Timeline
const tl = gsap.timeline({ paused: true });

// 1. Ubah container agar bisa diklik saat menu aktif
tl.set(menuContainer, { pointerEvents: "auto" });

// Tambahkan baris ini: Munculkan overlay perlahan (mulai di detik ke-0)
tl.to(overlay, { autoAlpha: 1, duration: 0.2 }, 0);

// 2. Animasi Gelombang MorphSVG
tl.to(menuPath, { morphSVG: startPath, duration: 0.4, ease: "power2.in" }).to(
  menuPath,
  { morphSVG: endPath, duration: 0.4, ease: "power2.out" },
);

// 3. Munculkan Container Teks (autoAlpha mengatur opacity & visibility sekaligus)
tl.to(menuContent, { autoAlpha: 1, duration: 0.1 }, "-=0.2");

// 4. Stagger Efek untuk Teks (Muncul dari bawah bergiliran layaknya ombak)
tl.from(
  menuItems,
  {
    y: 50,
    opacity: 0,
    stagger: 0.05,
    duration: 0.5,
    ease: "back.out(1.5)",
  },
  "-=0.3",
);

// Event Listeners Sidebar
btnOpen.addEventListener("click", () => {
  tl.play();
  document.body.classList.add("overflow-hidden");
});

btnClose.addEventListener("click", () => {
  tl.reverse();
  document.body.classList.remove("overflow-hidden");
});

// Tutup menu otomatis jika salah satu link diklik
const links = document.querySelectorAll(".menu-item a");
links.forEach((link) => {
  link.addEventListener("click", () => {
    tl.reverse();
    document.body.classList.remove("overflow-hidden");
  });
});

// Tutup menu jika area gelap (overlay) diklik
overlay.addEventListener("click", () => {
  tl.reverse();
  document.body.classList.remove("overflow-hidden");
});
// ===== SIDEBAR CODE END =====

// ===== CUSTOM CURSOR GLOBAL START =====
document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.getElementById("custom-cursor");
  const cursorText = document.getElementById("cursor-text");
  const projectCards = document.querySelectorAll(".project-card");

  // Tangkap semua tombol dan link di website untuk efek hover tambahan
  const interactables = document.querySelectorAll("a, button, input, label");

  if (!cursor) return;

  // Set poros kursor tepat di tengah titik
  gsap.set(cursor, { xPercent: -50, yPercent: -50 });

  // GSAP quickTo agar animasi ngikutin mouse tidak ngelag (60fps)
  const xTo = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3" });
  const yTo = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3" });

  window.addEventListener("mousemove", (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
  });

  // 1. Interaksi saat kursor MASUK ke area Project Card (Berubah jadi VIEW)
  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      gsap.to(cursor, {
        width: "6rem",
        height: "6rem",
        duration: 0.4,
        ease: "back.out(1.5)",
      });
      gsap.to(cursorText, { opacity: 1, scale: 1, duration: 0.3, delay: 0.1 });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(cursorText, { opacity: 0, scale: 0.5, duration: 0.2 });
      gsap.to(cursor, {
        width: "1rem",
        height: "1rem",
        duration: 0.4,
        ease: "power3.inOut",
      });
    });
  });

  // 2. Interaksi saat kursor MASUK ke Link / Button (Titik membesar ringan)
  interactables.forEach((el) => {
    if (el.closest(".project-card") || el.classList.contains("project-card"))
      return;

    el.addEventListener("mouseenter", () => {
      gsap.to(cursor, {
        scale: 2.5,
        opacity: 0.5,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    el.addEventListener("mouseleave", () => {
      gsap.to(cursor, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });
}); // <--- INI ADALAH KURUNG TUTUP YANG HILANG TADI!
// ===== CUSTOM CURSOR GLOBAL END =====

// ===== ARTICLE HOVER IMAGE PREVIEW START =====
document.addEventListener("DOMContentLoaded", () => {
  const articleRows = gsap.utils.toArray(".article-row");

  // Set titik kordinat awal gambar agar tepat berada di tengah kursor
  gsap.set(".article-image", { yPercent: -50, xPercent: -50 });

  articleRows.forEach((row) => {
    const image = row.querySelector(".article-image");
    // Jika diakses dari HP (gambar disembunyikan CSS), lewati animasinya
    if (!image || window.innerWidth < 768) return;

    let firstEnter;

    // GSAP quickTo untuk pergerakan gambar membuntuti kursor (super smooth 60fps)
    const setX = gsap.quickTo(image, "x", { duration: 0.4, ease: "power3" });
    const setY = gsap.quickTo(image, "y", { duration: 0.4, ease: "power3" });

    const align = (e) => {
      if (firstEnter) {
        setX(e.clientX, e.clientX); // Snap posisi saat pertama kali masuk (mencegah gambar terbang dari ujung)
        setY(e.clientY, e.clientY);
        firstEnter = false;
      } else {
        setX(e.clientX);
        setY(e.clientY);
      }
    };

    const startFollow = () => document.addEventListener("mousemove", align);
    const stopFollow = () => document.removeEventListener("mousemove", align);

    // Animasi GSAP untuk memunculkan gambar (autoAlpha membaca class opacity-0 invisible dari Tailwind)
    const fade = gsap.to(image, {
      autoAlpha: 1,
      ease: "power2.out",
      paused: true,
      duration: 0.3,
      onReverseComplete: stopFollow,
    });

    row.addEventListener("mouseenter", (e) => {
      firstEnter = true;
      fade.play();
      startFollow();
      align(e);
    });

    row.addEventListener("mouseleave", () => fade.reverse());
  });
});
// ===== ARTICLE HOVER IMAGE PREVIEW END =====

// ===========================
//        GSAP CODE END
// ===========================

// ===== NAVBAR KODE (DARK/LIGHT MODE TOGGLE) START =====
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const html = document.documentElement;

  if (!themeToggle) return;

  // 1. Sinkronisasi awal:
  themeToggle.checked = html.getAttribute("data-theme") !== "dark";

  // 2. Event saat tombol diklik
  themeToggle.addEventListener("change", (e) => {
    if (e.target.checked) {
      // Ke Mode Terang
      html.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    } else {
      // Ke Mode Gelap
      html.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
  });
});
// ===== NAVBAR KODE (DARK/LIGHT MODE TOGGLE) END =====

// ===== NAVBAR KODE (SCROLL DOWN = HIDDEN) START =====
const navbar = document.getElementById("navbar");
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
  // Jika scroll lebih dari 50px (agar tidak terlalu sensitif di paling atas)
  if (window.scrollY > 50) {
    if (window.scrollY > lastScrollY) {
      // Sedang scroll ke bawah -> Sembunyikan navbar (geser ke atas 100%)
      navbar.classList.add("-translate-y-full");
    } else {
      // Sedang scroll ke atas -> Munculkan navbar kembali
      navbar.classList.remove("-translate-y-full");
    }
  } else {
    // Memastikan navbar selalu muncul saat berada di paling atas halaman
    navbar.classList.remove("-translate-y-full");
  }

  // Perbarui posisi scroll terakhir
  lastScrollY = window.scrollY;
});
// ===== NAVBAR KODE (SCROLL DOWN = HIDDEN) END =====
