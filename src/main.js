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
// ScrollSmoother requires ScrollTrigger
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

// 1. Ubah container agar bisa diklik saat menu aktif
tl.set(menuContainer, { pointerEvents: "auto" });

// Tambahkan baris ini: Munculkan overlay perlahan (mulai di detik ke-0)
tl.to(overlay, { autoAlpha: 1, duration: 0.2 }, 0);

// 2. Animasi Gelombang MorphSVG
tl.to(menuPath, { morphSVG: startPath, duration: 0.4, ease: "power2.in" }).to;

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
); // Dimulai sedikit sebelum ombak selesai

// Event Listeners
btnOpen.addEventListener("click", () => {
  tl.play();
});

btnClose.addEventListener("click", () => {
  tl.reverse();
});

// Opsional: Tutup menu otomatis jika salah satu link diklik
const links = document.querySelectorAll(".menu-item a");
links.forEach((link) => {
  link.addEventListener("click", () => tl.reverse());
});
// ===== SIDEBAR CODE END =====

// ===========================
//        GSAP CODE END
// ===========================

// ===== NAVBAR KODE (DARK/LIGHT MODE TOGGLE) START =====
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const html = document.documentElement;

  if (!themeToggle) return;

  // 1. Sinkronisasi awal:
  // Jika data-theme BUKAN dark (berarti light), maka centang (Matahari).
  // Jika dark, jangan dicentang (Bulan).
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

// ===== NAVBAR KODE (EVENT LISTENERS) START =====
btnOpen.addEventListener("click", () => {
  tl.play();
  // Mengunci scroll saat menu dibuka
  document.body.classList.add("overflow-hidden");
});

btnClose.addEventListener("click", () => {
  tl.reverse();
  // Membuka kembali scroll saat menu ditutup
  document.body.classList.remove("overflow-hidden");
});
// Tutup menu jika area gelap (overlay) diklik
overlay.addEventListener("click", () => {
  tl.reverse();
  document.body.classList.remove("overflow-hidden"); // Buka kembali scroll halaman
});
