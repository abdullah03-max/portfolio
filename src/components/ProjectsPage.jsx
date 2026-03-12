import { Link } from 'react-router-dom';
import ParticlesBackground from './ParticlesBackground';
import hotelImage from '../card images/hotel managent.png';
import marketplaceImage from '../card images/Screenshot 2026-03-12 121132.png';
import diceImage from '../card images/Screenshot 2026-03-12 122320.png';
import diceImage2 from '../card images/Screenshot 2026-03-12 122829.png';

const webProjects = [
  {
    title: 'Hotel Management System',
    description:
      'A full-stack MERN application with room booking, check-in/check-out, billing, room service workflows, and role-based staff dashboards powered by JWT authentication and REST APIs.',
    tech: ['MongoDB', 'Express', 'React', 'Node.js', 'JWT', 'REST API'],
    github: 'https://github.com/abdullah03-max/hotel-management-system',
    image: hotelImage
  },
  {
    title: 'AllInOne Marketplace',
    description:
      'An OLX-like classified marketplace featuring store registration, ad posting, buyer-seller chat, Cloudinary image uploads, advanced search/filtering, and user review systems.',
    tech: ['React.js', 'Node.js', 'JWT', 'Cloudinary', 'REST API'],
    image: marketplaceImage
  }
];

const flutterProjects = [
  {
    title: 'Weather App',
    description:
      'A Flutter weather application with live API integration for real-time temperature and forecasts, enhanced with smooth animations and reliable state management.',
    tech: ['Flutter', 'Dart', 'Weather API', 'State Management']
  },
  {
    title: 'Dice Roller',
    description:
      'A two-player Flutter dice game featuring animated dice rolls, random roll logic, score tracking, and polished state handling for responsive gameplay.',
    tech: ['Flutter', 'Dart', 'Animations', 'Game Logic'],
    images: [diceImage, diceImage2],
    imageRatio: 'mobile'
  }
];

function ProjectCard({ project, index }) {
  const projectImages = project.images?.length ? project.images : project.image ? [project.image] : [];

  return (
    <article className="projects-page-card">
      {projectImages.length > 0 && (
        <div className={`projects-page-card-gallery ${project.imageRatio === 'mobile' ? 'is-mobile' : ''}`}>
          {projectImages.map((imgSrc, imgIndex) => (
            <div className="projects-page-card-image-wrap" key={`${project.title}-img-${imgIndex + 1}`}>
              <img src={imgSrc} alt={`${project.title} screenshot ${imgIndex + 1}`} className="projects-page-card-image" />
            </div>
          ))}
        </div>
      )}
      <div className="projects-page-card-head">
        <h4>{project.title}</h4>
        <span>{String(index + 1).padStart(2, '0')}</span>
      </div>
      <p>{project.description}</p>
      <div className="badge-wrap">
        {project.tech.slice(0, 4).map((item) => (
          <span key={`${project.title}-${item}`} className="badge">
            {item}
          </span>
        ))}
      </div>
      {project.github ? (
        <a className="project-link" href={project.github} target="_blank" rel="noreferrer">
          View on GitHub
        </a>
      ) : null}
    </article>
  );
}

function ProjectsPage() {
  return (
    <>
      <ParticlesBackground />
      <div className="projects-page-shell">
        <header className="projects-page-header">
          <p className="about-kicker">Portfolio Projects</p>
          <h1>Web + Flutter Projects</h1>
          <p>
            Dedicated project archive split by platform while keeping the same cinematic background frame and visual style.
          </p>
          <Link to="/" className="btn-outline projects-back-btn">
            Back to Portfolio
          </Link>
        </header>

        <section className="projects-page-section">
          <div className="projects-page-section-head">
            <p className="about-kicker">Section 01</p>
            <h2>Web Projects</h2>
          </div>
          <div className="projects-page-grid">
            {webProjects.map((project, index) => (
              <ProjectCard key={project.title} index={index} project={project} />
            ))}
          </div>
        </section>

        <section className="projects-page-section">
          <div className="projects-page-section-head">
            <p className="about-kicker">Section 02</p>
            <h2>Flutter Projects</h2>
          </div>
          <div className="projects-page-grid">
            {flutterProjects.map((project, index) => (
              <ProjectCard key={project.title} index={index} project={project} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export default ProjectsPage;
