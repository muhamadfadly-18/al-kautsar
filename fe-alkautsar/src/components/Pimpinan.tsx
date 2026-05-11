import { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/pimpinan.css";
import { useNavigate } from "react-router-dom";
import type {
  OrganizationContent,
  OrganizationMember,
} from "../data/organizationContent";
import { defaultOrganizationContent } from "../data/organizationContent";
import { getOrganizationContent } from "../services/content/organization";
import { getSafeImageSrc } from "../utils/image";

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
  const [selectedPimpinan, setSelectedPimpinan] =
    useState<OrganizationMember | null>(null);
  const [organization, setOrganization] = useState<OrganizationContent>(
    defaultOrganizationContent,
  );
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrganization = async () => {
      try {
        const result = await getOrganizationContent();
        setOrganization(result);
      } catch (error) {
        console.error("Gagal memuat data pimpinan dari API", error);
        setOrganization(defaultOrganizationContent);
      }
    };

    void loadOrganization();
  }, []);

  return (
    <section className="pimpinan-section py-5" id="pimpinan">
      <InteractiveCanvas />

      <div className="container position-relative z-2">
        <div className="text-center mb-5 pimpinan-header">
          <h6 className="text-accent fw-bold text-uppercase ls-3">
            Dewan Pimpinan
          </h6>
          <h2 className="display-5 fw-bold text-white pimpinan-title">
            Mengenal Pimpinan Kami
          </h2>
          <p className="pimpinan-subtitle mx-auto mt-3 mb-0">
            Kenali sosok-sosok yang membimbing arah pendidikan, karakter, dan
            perkembangan santri Al-Kautsar.
          </p>
          <div className="divider-glow-gold mx-auto mt-3"></div>
        </div>

        <div className="row justify-content-center align-items-center g-4 g-xl-5 pimpinan-layout">
          <div
            className={`${
              selectedPimpinan ? "col-lg-6 col-xl-5" : "col-12"
            } transition-all duration-700`}
          >
            <div className="d-flex flex-column align-items-center pimpinan-network">
              <div
                className={`pimpinan-circle big-circle mb-5 ${selectedPimpinan?.name === organization.head.name ? "active-ring-gold" : ""}`}
                onClick={() => setSelectedPimpinan(organization.head)}
              >
                <img
                  src={getSafeImageSrc(organization.head.img)}
                  alt={organization.head.name}
                />
                <div className="label-float-dark">
                  <p className="m-0 fw-bold">{organization.head.name}</p>
                  <small className="text-success-light">
                    {organization.head.position}
                  </small>
                </div>
              </div>

              <div className="pimpinan-leaders">
                {organization.leaders.map((person) => (
                  <div
                    key={person.id}
                    className={`pimpinan-circle small-circle ${selectedPimpinan?.name === person.name ? "active-ring-gold" : ""}`}
                    onClick={() => setSelectedPimpinan(person)}
                  >
                    <img src={getSafeImageSrc(person.img)} alt={person.name} />
                    <div className="label-float-dark">
                      <p className="m-0 fw-bold small">{person.name}</p>
                      <small className="text-success-light">
                        {person.position}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {selectedPimpinan && (
            <div className="col-lg-6 col-xl-5 animate-reveal">
              <div className="detail-card-glass p-4 p-md-5 position-relative">
                <button
                  className="btn-close btn-close-white position-absolute top-0 end-0 m-4"
                  type="button"
                  onClick={() => setSelectedPimpinan(null)}
                ></button>
                <h3 className="fw-bold text-white mb-1">
                  {selectedPimpinan.name}
                </h3>
                <p className="text-accent fw-bold mb-4">
                  {selectedPimpinan.position}
                </p>
                <p className="text-light-muted lh-lg">
                  {selectedPimpinan.bio || "Bio pimpinan belum diisi."}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="text-center mt-5">
          <button
            className="btn btn-outline-warning px-4 px-md-5 py-3 rounded-pill fw-semibold shadow-lg pimpinan-cta"
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
