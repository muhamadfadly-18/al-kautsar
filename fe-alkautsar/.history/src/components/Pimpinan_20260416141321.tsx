import { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/pimpinan.css";
import { useNavigate } from "react-router-dom";

const InteractiveCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    

    let particles: Particle[] = [];
    let animationFrameId: number;

    const mouse = { x: 0, y: 0, active: false };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = "rgba(212, 175, 55, 0.5)";
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas!.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas!.height || this.y < 0) this.speedY *= -1;

        if (mouse.active) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 150) {
            this.x += dx * 0.02;
            this.y += dy * 0.02;
          }
        }
      }

      draw() {
        ctx!.fillStyle = this.color;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
      }
    };

    const handleLinks = () => {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx!.strokeStyle = `rgba(212, 175, 55, ${1 - distance / 100})`;
            ctx!.lineWidth = 0.5;
            ctx!.beginPath();
            ctx!.moveTo(particles[a].x, particles[a].y);
            ctx!.lineTo(particles[b].x, particles[b].y);
            ctx!.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      handleLinks();
      animationFrameId = requestAnimationFrame(animate);
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
      mouse.active = true;
    });

    resize();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="interactive-canvas" />;
};

const PimpinanDepan = () => {
  const [selectedPimpinan, setSelectedPimpinan] = useState<any>(null);
  const navigate = useNavigate();

  const pimpinanData = {
    utama: {
      name: "Ust. Ahmad Fadly",
      position: "Kepala Pondok",
      img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
      bio: "Berdedikasi selama 15 tahun dalam memimpin pendidikan karakter islami.",
      social: { ig: "@ahmad_fadly", mail: "fadly@alkautsar.com" },
    },
    staff: [
      {
        name: "Ust. Nur Aulia",
        position: "Lurah 1",
        img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
        bio: "Bertanggung jawab atas kedisiplinan santri.",
        social: { ig: "@nuraulia", mail: "nuraulia@alkautsar.com" },
      },
      {
        name: "Ust. Hidayat",
        position: "Lurah 2",
        img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
        bio: "Mengelola kurikulum ekstrakurikuler.",
        social: { ig: "@hidayat_ust", mail: "hidayat@alkautsar.com" },
      },
    ],
  };

  return (
    <section className="pimpinan-section py-5" >
      <InteractiveCanvas />

      <div className="container position-relative z-2">
        <div className="text-center mb-5">
          <h6 className="text-accent fw-bold text-uppercase ls-3">
            Dewan Pimpinan
          </h6>
          <h2 className="display-5 fw-bold text-white">
            Mengenal Pimpinan Kami
          </h2>
          <div className="divider-glow-gold mx-auto mt-3"></div>
        </div>

        <div className="row justify-content-center align-items-center g-5">
          <div
            className={`col-lg-${selectedPimpinan ? "5" : "12"} transition-all duration-700`}
          >
            <div className="d-flex flex-column align-items-center">
              <div
                className={`pimpinan-circle big-circle mb-5 ${selectedPimpinan?.name === pimpinanData.utama.name ? "active-ring-gold" : ""}`}
                onClick={() => setSelectedPimpinan(pimpinanData.utama)}
              >
                <img src={pimpinanData.utama.img} alt="Kepala" />
                <div className="label-float-dark">
                  <p className="m-0 fw-bold">{pimpinanData.utama.name}</p>
                  <small className="text-success-light">
                    {pimpinanData.utama.position}
                  </small>
                </div>
              </div>

              <div className="d-flex gap-4 gap-md-5 justify-content-center">
                {pimpinanData.staff.map((person, idx) => (
                  <div
                    key={idx}
                    className={`pimpinan-circle small-circle ${selectedPimpinan?.name === person.name ? "active-ring-gold" : ""}`}
                    onClick={() => setSelectedPimpinan(person)}
                  >
                    <img src={person.img} alt={person.name} />
                    <div className="label-float-dark">
                      <p className="m-0 fw-bold small">
                        {person.name.split(" ")[1]}
                      </p>
                      <small
                        className="text-success-light"
                        style={{ fontSize: "0.7rem" }}
                      >
                        {person.position}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {selectedPimpinan && (
            <div className="col-lg-5 animate-reveal">
              <div className="detail-card-glass p-4 p-md-5 position-relative">
                <button
                  className="btn-close btn-close-white position-absolute top-0 end-0 m-4"
                  onClick={() => setSelectedPimpinan(null)}
                ></button>
                <h3 className="fw-bold text-white mb-1">
                  {selectedPimpinan.name}
                </h3>
                <p className="text-accent fw-bold mb-4">
                  {selectedPimpinan.position}
                </p>
                <p className="text-light-muted lh-lg">{selectedPimpinan.bio}</p>
              </div>
            </div>
          )}
        </div>
        <div className="text-center mt-5">
          <button
            className="btn btn-outline-warning px-5 py-3 rounded-pill fw-semibold shadow-lg"
            onClick={() => navigate("/struktur-organisasi")}
          >
            Lihat Struktur Organisasi
          </button>
        </div>
      </div>
    </section>
  );
};

export default PimpinanDepan;
