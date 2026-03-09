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

// ===== CUSTOM CURSOR START =====

class ArrowPointer {
  constructor() {
    this.root = document.body;
    this.cursor = document.querySelector(".curzr");

    ((this.position = {
      distanceX: 0,
      distanceY: 0,
      distance: 0,
      pointerX: 0,
      pointerY: 0,
    }),
      (this.previousPointerX = 0));
    this.previousPointerY = 0;
    this.angle = 0;
    this.previousAngle = 0;
    this.angleDisplace = 0;
    this.degrees = 57.296;
    this.cursorSize = 23;

    this.cursorStyle = {
      boxSizing: "border-box",
      position: "fixed",
      top: "0px",
      left: `${-this.cursorSize / 2}px`,
      zIndex: "2147483647",
      width: `${this.cursorSize}px`,
      height: `${this.cursorSize}px`,
      transition: "250ms, transform 100ms",
      userSelect: "none",
      pointerEvents: "none",
    };

    this.init(this.cursor, this.cursorStyle);
  }

  init(el, style) {
    Object.assign(el.style, style);
    this.cursor.removeAttribute("hidden");
  }

  move(event) {
    this.previousPointerX = this.position.pointerX;
    this.previousPointerY = this.position.pointerY;
    this.position.pointerX = event.pageX + this.root.getBoundingClientRect().x;
    this.position.pointerY = event.pageY + this.root.getBoundingClientRect().y;
    this.position.distanceX = this.previousPointerX - this.position.pointerX;
    this.position.distanceY = this.previousPointerY - this.position.pointerY;
    this.distance = Math.sqrt(
      this.position.distanceY ** 2 + this.position.distanceX ** 2,
    );

    this.cursor.style.transform = `translate3d(${this.position.pointerX}px, ${this.position.pointerY}px, 0)`;

    if (this.distance > 1) {
      this.rotate(this.position);
    } else {
      this.cursor.style.transform += ` rotate(${this.angleDisplace}deg)`;
    }
  }

  rotate(position) {
    let unsortedAngle =
      Math.atan(Math.abs(position.distanceY) / Math.abs(position.distanceX)) *
      this.degrees;
    let modAngle;
    const style = this.cursor.style;
    this.previousAngle = this.angle;

    if (position.distanceX <= 0 && position.distanceY >= 0) {
      this.angle = 90 - unsortedAngle + 0;
    } else if (position.distanceX < 0 && position.distanceY < 0) {
      this.angle = unsortedAngle + 90;
    } else if (position.distanceX >= 0 && position.distanceY <= 0) {
      this.angle = 90 - unsortedAngle + 180;
    } else if (position.distanceX > 0 && position.distanceY > 0) {
      this.angle = unsortedAngle + 270;
    }

    if (isNaN(this.angle)) {
      this.angle = this.previousAngle;
    } else {
      if (this.angle - this.previousAngle <= -270) {
        this.angleDisplace += 360 + this.angle - this.previousAngle;
      } else if (this.angle - this.previousAngle >= 270) {
        this.angleDisplace += this.angle - this.previousAngle - 360;
      } else {
        this.angleDisplace += this.angle - this.previousAngle;
      }
    }
    style.transform += ` rotate(${this.angleDisplace}deg)`;

    setTimeout(() => {
      modAngle =
        this.angleDisplace >= 0
          ? this.angleDisplace % 360
          : 360 + (this.angleDisplace % 360);
      if (modAngle >= 45 && modAngle < 135) {
        style.left = `${-this.cursorSize}px`;
        style.top = `${-this.cursorSize / 2}px`;
      } else if (modAngle >= 135 && modAngle < 225) {
        style.left = `${-this.cursorSize / 2}px`;
        style.top = `${-this.cursorSize}px`;
      } else if (modAngle >= 225 && modAngle < 315) {
        style.left = "0px";
        style.top = `${-this.cursorSize / 2}px`;
      } else {
        style.left = `${-this.cursorSize / 2}px`;
        style.top = "0px";
      }
    }, 0);
  }

  remove() {
    this.cursor.remove();
  }
}

(() => {
  const cursor = new ArrowPointer();
  if (
    !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    )
  ) {
    document.onmousemove = function (event) {
      cursor.move(event);
    };
  } else {
    cursor.remove();
  }
})();
// ===== CUSTOM CURSOR END =====

// ===== REVEAL FOOTER EFFECT START =====
document.addEventListener("DOMContentLoaded", () => {
  function initSiteFooter() {
    const siteContent = document.getElementById("site-content");
    const siteFooter = document.getElementById("site-footer");

    if (!siteContent || !siteFooter) return;

    // Ambil tinggi dinamis dari Footer
    const siteFooterHeight = siteFooter.offsetHeight;

    // Berikan ruang kosong di paling bawah konten utama (margin-bottom)
    // agar footer yang melayang di belakangnya bisa terlihat saat di-scroll mentok
    siteContent.style.marginBottom = `${siteFooterHeight}px`;
  }

  // Jalankan saat load awal
  initSiteFooter();

  // PENTING: Kalkulasi ulang tinggi footer jika user mengubah ukuran window browser (responsive)
  window.addEventListener("resize", initSiteFooter);

  // Ekstra safety: kalkulasi ulang setelah semua gambar termuat
  window.addEventListener("load", initSiteFooter);
});
// ===== REVEAL FOOTER EFFECT END =====
