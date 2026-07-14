// Helper function to handle smooth scrolling to an element ID without changing the hash route
const scrollToElement = (id) => {
  const el = document.getElementById(id);
  if (el) {
    const offset = 85; // accounts for the sticky navbar height
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = el.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

/* ==========================================================================
   Header / Navbar Component
   ========================================================================== */
function Navbar({ currentView, setView }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [robotsOpen, setRobotsOpen] = React.useState(false);

  const getLinkClass = (viewName) => {
    if (viewName === 'tutorials' && currentView.startsWith('tutorials')) return 'active';
    return currentView === viewName ? 'active' : '';
  };

  const isRobotsActive = currentView === 'robots/g1' || currentView === 'robots/spot';

  return (
    <nav className="navbar">
      <div className="nav-brand" style={{ cursor: 'pointer' }} onClick={() => setView('home')}>
        <img src="lab_logo.jpg" alt="Autonomous Systems Lab Logo" className="nav-logo" />
        <span>Autonomous Systems Lab</span>
      </div>
      <button className="nav-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        <i className={mobileMenuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i>
      </button>
      <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`} style={mobileMenuOpen ? { display: 'flex', flexDirection: 'column', position: 'absolute', top: '70px', right: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '8px', gap: '0.75rem', zIndex: 101 } : {}}>
        <li>
          <a href="#home" className={getLinkClass('home')} onClick={() => setMobileMenuOpen(false)}>Home</a>
        </li>
        <li
          className="nav-dropdown-parent"
          onMouseEnter={() => setRobotsOpen(true)}
          onMouseLeave={() => setRobotsOpen(false)}
        >
          <span className={`nav-dropdown-trigger ${isRobotsActive ? 'active' : ''}`}>
            Robots <i className={`fa-solid fa-chevron-down nav-chevron ${robotsOpen ? 'open' : ''}`}></i>
          </span>
          {robotsOpen && (
            <ul className="nav-dropdown-menu">
              <li>
                <a href="#robots/g1" className={currentView === 'robots/g1' ? 'active' : ''}
                  onClick={() => { setMobileMenuOpen(false); setRobotsOpen(false); }}>
                  <i className="fa-solid fa-person-walking" style={{ marginRight: '0.4rem' }}></i>Unitree G1
                </a>
              </li>
              <li>
                <a href="#robots/spot" className={currentView === 'robots/spot' ? 'active' : ''}
                  onClick={() => { setMobileMenuOpen(false); setRobotsOpen(false); }}>
                  <i className="fa-solid fa-dog" style={{ marginRight: '0.4rem' }}></i>SPOT
                </a>
              </li>
            </ul>
          )}
        </li>
        <li>
          <a href="#tutorials" className={getLinkClass('tutorials')} onClick={() => setMobileMenuOpen(false)}>Tutorials</a>
        </li>
        <li>
          <a href="#videos" className={getLinkClass('videos')} onClick={() => setMobileMenuOpen(false)}>Videos</a>
        </li>
        <li>
          <a href="#team" className={getLinkClass('team')} onClick={() => setMobileMenuOpen(false)}>Lab Team</a>
        </li>
      </ul>
    </nav>
  );
}

/* ==========================================================================
   Home View Component
   ========================================================================== */
function HomeView({ setView, featuredTutorials }) {
  return (
    <div>
      <section className="hero">
        <div className="hero-tag">
          <i className="fa-solid fa-wand-magic-sparkles" style={{ fontSize: '0.9rem' }}></i>
          <span>Autonomous Robotics Research</span>
        </div>
        <h1>Robotics Lab Portal</h1>
        <p>
          Welcome to the robotics research and knowledge hub. Explore our state-of-the-art tutorials, project recordings, mathematical kinematic resources, and computer vision utilities.
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={() => setView('tutorials')}>
            <i className="fa-solid fa-book-open"></i> Explore Tutorials
          </button>
          <button className="btn btn-secondary" onClick={() => setView('videos')}>
            <i className="fa-solid fa-video"></i> Watch Demos
          </button>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">12+</div>
          <div className="stat-label">Active Research Projects</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">30+</div>
          <div className="stat-label">Lab Publications</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">100%</div>
          <div className="stat-label">Open Source Code</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">15</div>
          <div className="stat-label">Robotic Platforms</div>
        </div>
      </section>

      <div className="section-header">
        <h2 className="section-title">Latest Lab Tutorials</h2>
        <a href="#tutorials" className="section-link" onClick={() => setView('tutorials')}>
          View all <i className="fa-solid fa-arrow-right"></i>
        </a>
      </div>

      <div className="card-grid" style={{ marginBottom: '4rem' }}>
        {featuredTutorials.map(tutorial => (
          <div key={tutorial.id} className="card">
            <div className="card-content">
              <div className="card-tag-list">
                {tutorial.tags.map(tag => (
                  <span key={tag} className="tag primary">{tag}</span>
                ))}
              </div>
              <h3 className="card-title">
                <a href={`#tutorials/${tutorial.id}`} onClick={() => setView(`tutorials/${tutorial.id}`)}>
                  {tutorial.title}
                </a>
              </h3>
              <p className="card-excerpt">{tutorial.excerpt}</p>
              <div className="card-footer">
                <span className="card-author">
                  <i className="fa-solid fa-user" style={{ marginRight: '4px' }}></i> {tutorial.author}
                </span>
                <span>{tutorial.date}</span>
              </div>
            </div>
          </div>
        ))}
        {featuredTutorials.length === 0 && (
          <p style={{ color: 'var(--text-secondary)' }}>Loading tutorials...</p>
        )}
      </div>

      <div className="section-header">
        <h2 className="section-title">Research Focus Areas</h2>
      </div>
      <div className="card-grid" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div className="card-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <i className="fa-solid fa-compass" style={{ color: 'var(--primary)', fontSize: '1.5rem' }}></i>
              <h3 className="card-title" style={{ margin: 0 }}>Autonomous Navigation</h3>
            </div>
            <p className="card-excerpt">Developing SLAM (Simultaneous Localization and Mapping) and trajectory planning algorithms for ground rovers and aerial drones in GPS-denied environments.</p>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <i className="fa-solid fa-chart-line" style={{ color: 'var(--primary)', fontSize: '1.5rem' }}></i>
              <h3 className="card-title" style={{ margin: 0 }}>Manipulation & Control</h3>
            </div>
            <p className="card-excerpt">High-DOF robotic arm trajectory control, reinforcement learning for tactile grasping, and inverse kinematics solvers optimized for multi-arm cooperation.</p>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <i className="fa-solid fa-eye" style={{ color: 'var(--primary)', fontSize: '1.5rem' }}></i>
              <h3 className="card-title" style={{ margin: 0 }}>Robot Vision</h3>
            </div>
            <p className="card-excerpt">Embedding computer vision models directly into target controllers for real-time 3D object detection, pose estimation, and camera visual feedback control loops.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   Tutorials Directory View Component
   ========================================================================== */
function TutorialsView({ tutorials, setView }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedTag, setSelectedTag] = React.useState('All');

  // Extract all unique tags
  const allTags = React.useMemo(() => {
    const tagsSet = new Set(['All']);
    tutorials.forEach(t => t.tags.forEach(tag => tagsSet.add(tag)));
    return Array.from(tagsSet);
  }, [tutorials]);

  // Filter tutorials based on search and tag selections
  const filteredTutorials = React.useMemo(() => {
    return tutorials.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            t.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            t.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = selectedTag === 'All' || t.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [tutorials, searchTerm, selectedTag]);

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Tutorials Directory</h2>
      </div>

      <div className="controls-bar">
        <div className="search-wrapper">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Search titles, authors, or descriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="tags-filter">
          {allTags.map(tag => (
            <button
              key={tag}
              className={`filter-btn ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="card-grid" style={{ minHeight: '300px' }}>
        {filteredTutorials.map(tutorial => (
          <div key={tutorial.id} className="card">
            <div className="card-content">
              <div className="card-tag-list">
                {tutorial.tags.map(tag => (
                  <span
                    key={tag}
                    className="tag primary"
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTag(tag);
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="card-title">
                <a href={`#tutorials/${tutorial.id}`} onClick={() => setView(`tutorials/${tutorial.id}`)}>
                  {tutorial.title}
                </a>
              </h3>
              <p className="card-excerpt">{tutorial.excerpt}</p>
              <div className="card-footer">
                <span className="card-author">
                  <i className="fa-solid fa-user" style={{ marginRight: '4px' }}></i> {tutorial.author}
                </span>
                <span>{tutorial.date}</span>
              </div>
            </div>
          </div>
        ))}
        {filteredTutorials.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            <i className="fa-solid fa-circle-xmark" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem', color: 'var(--text-muted)' }}></i>
            No tutorials found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   Tutorial Reader / Markdown Viewer Component
   ========================================================================== */
function TutorialReaderView({ tutorialId, setView, tutorials }) {
  const [markdown, setMarkdown] = React.useState('');
  const [htmlContent, setHtmlContent] = React.useState('');
  const [headings, setHeadings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const tutorialMeta = tutorials.find(t => t.id === tutorialId);
  const manifestReady = tutorials.length > 0;

  React.useEffect(() => {
    if (!tutorialId) return;

    if (manifestReady && !tutorialMeta) {
      setLoading(false);
      setError("We couldn't locate this tutorial's record.");
      return;
    }

    if (!tutorialMeta) return;

    setLoading(true);
    setError(null);

    const filePath = tutorialMeta.file || `${tutorialId}.md`;
    fetch(`./content/tutorials/${filePath}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load the tutorial file. Please check if the file exists.');
        }
        return response.text();
      })
      .then(text => {
        setMarkdown(text);
        
        // Custom marked renderer to inject custom IDs for links/anchors to support scrolling
        const renderer = new marked.Renderer();
        renderer.heading = function (textOrToken, level) {
          let text;
          let depth;

          if (typeof textOrToken === 'object' && textOrToken !== null && textOrToken.tokens) {
            text = this.parser.parseInline(textOrToken.tokens);
            depth = textOrToken.depth;
          } else {
            text = textOrToken;
            depth = level;
          }

          const id = text.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
          return `<h${depth} id="${id}">${text}</h${depth}>\n`;
        };

        // Parse markdown text using marked.js CDN compiler
        const compiledHtml = marked.parse(text, { renderer });
        setHtmlContent(compiledHtml);

        // Generate Table of Contents by scanning headers
        const lines = text.split('\n');
        const list = [];
        lines.forEach(line => {
          if (line.startsWith('## ')) {
            const title = line.replace('## ', '').trim();
            const id = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            list.push({ level: 2, title, id });
          } else if (line.startsWith('### ')) {
            const title = line.replace('### ', '').trim();
            const id = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            list.push({ level: 3, title, id });
          }
        });
        setHeadings(list);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [tutorialId, tutorialMeta, manifestReady]);

  // Execute syntax highlighting whenever HTML output is injected into DOM
  React.useEffect(() => {
    if (!loading && window.Prism) {
      window.Prism.highlightAll();
    }
  }, [htmlContent, loading]);

  if (loading || (tutorialId && !manifestReady)) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-secondary)' }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '3rem', display: 'block', margin: '0 auto 1.5rem auto', color: 'var(--primary)' }}></i>
        Loading Tutorial Content...
      </div>
    );
  }

  if (error || !tutorialMeta) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-secondary)' }}>
        <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '3rem', display: 'block', margin: '0 auto 1.5rem auto', color: '#ff4d4d' }}></i>
        <h2>Tutorial Not Found</h2>
        <p style={{ marginTop: '0.5rem', marginBottom: '2rem' }}>{error || "We couldn't locate this tutorial's record."}</p>
        <button className="btn btn-primary" onClick={() => setView('tutorials')}>
          Back to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="tutorial-layout">
      <div className="tutorial-main">
        <a href="#tutorials" className="tutorial-back-btn" onClick={() => setView('tutorials')}>
          <i className="fa-solid fa-arrow-left"></i> Back to Directory
        </a>
        <div className="tutorial-header">
          <h1 className="tutorial-title">{tutorialMeta.title}</h1>
          <div className="tutorial-meta">
            <span className="tutorial-meta-item">
              <i className="fa-solid fa-user" style={{ marginRight: '4px' }}></i> {tutorialMeta.author}
            </span>
            <span className="tutorial-meta-item">
              <i className="fa-solid fa-calendar-days" style={{ marginRight: '4px' }}></i> {tutorialMeta.date}
            </span>
            <span className="tutorial-meta-item">
              <i className="fa-solid fa-tag" style={{ marginRight: '4px' }}></i> {tutorialMeta.tags.join(', ')}
            </span>
          </div>
        </div>
        
        <div className="tutorial-markdown" dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>

      <aside className="toc-sidebar">
        <div className="toc-title">On This Page</div>
        <ul className="toc-list">
          {headings.map((heading, i) => (
            <li key={i} className="toc-item">
              <a
                href="javascript:void(0)"
                className={`toc-link ${heading.level === 3 ? 'h3' : 'h2'}`}
                onClick={() => scrollToElement(heading.id)}
              >
                {heading.title}
              </a>
            </li>
          ))}
          {headings.length === 0 && (
            <li style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No subheadings found in tutorial text.</li>
          )}
        </ul>
      </aside>
    </div>
  );
}

/* ==========================================================================
   Videos Directory View Component
   ========================================================================== */
function VideosView({ videos }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [activeVideo, setActiveVideo] = React.useState(null);

  // Extract all categories
  const categories = React.useMemo(() => {
    const catSet = new Set(['All']);
    videos.forEach(v => catSet.add(v.category));
    return Array.from(catSet);
  }, [videos]);

  // Filter video items
  const filteredVideos = React.useMemo(() => {
    return videos.filter(v => {
      const matchesSearch = v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            v.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            v.speaker.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = selectedCategory === 'All' || v.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [videos, searchTerm, selectedCategory]);

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Video Library</h2>
      </div>

      <div className="controls-bar">
        <div className="search-wrapper">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Search titles, speaker, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="tags-filter">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="card-grid">
        {filteredVideos.map(video => (
          <div key={video.id} className="card" onClick={() => setActiveVideo(video)} style={{ cursor: 'pointer' }}>
            <div className="video-thumbnail-container">
              {/* Uses a high quality YouTube thumbnail URL since we have the youtubeId */}
              <img
                src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                alt={video.title}
                className="video-thumbnail"
              />
              <div className="video-play-btn">
                <i className="fa-solid fa-play" style={{ transform: 'translateX(2px)' }}></i>
              </div>
              <div className="video-duration">{video.duration}</div>
            </div>
            <div className="card-content">
              <div className="card-tag-list">
                <span className="tag primary">{video.category}</span>
              </div>
              <h3 className="card-title">{video.title}</h3>
              <p className="card-excerpt">{video.description}</p>
              <div className="card-footer">
                <span>Presenter: {video.speaker}</span>
                <span>{video.date}</span>
              </div>
            </div>
          </div>
        ))}
        {filteredVideos.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            <i className="fa-solid fa-circle-xmark" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem', color: 'var(--text-muted)' }}></i>
            No video files match your criteria.
          </div>
        )}
      </div>

      {/* Video Modal Player Overlay */}
      {activeVideo && (
        <div className="modal-overlay" onClick={() => setActiveVideo(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{activeVideo.title}</span>
              <button className="modal-close" onClick={() => setActiveVideo(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="video-player-wrapper">
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            <div className="modal-details">
              <div className="modal-meta">
                <span><i className="fa-solid fa-user" style={{ marginRight: '4px' }}></i> Speaker: {activeVideo.speaker}</span>
                <span><i className="fa-solid fa-calendar-days" style={{ marginRight: '4px' }}></i> Published: {activeVideo.date}</span>
                <span><i className="fa-regular fa-clock" style={{ marginRight: '4px' }}></i> {activeVideo.duration}</span>
              </div>
              <p className="modal-desc">{activeVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   Lab Team View Component
   ========================================================================== */
const teamMembers = [
  {
    name: "Dr. Sarah Miller",
    role: "Lab Director / Principal Investigator",
    research: "Focuses on cloud robotics, ROS 2 standard safety frameworks, and co-bot systems in high-precision manufacturing labs.",
    email: "s.miller@university.edu",
    github: "miller-lab",
    robotSeed: "SarahMiller"
  },
  {
    name: "Marcus Thorne",
    role: "PhD Candidate",
    research: "Working on real-time hardware-in-the-loop simulation engines and mathematical kinematics solvers for 7-DOF industrial robot arms.",
    email: "m.thorne@university.edu",
    github: "mthorne-robotics",
    robotSeed: "MarcusThorne"
  },
  {
    name: "Elena Rostova",
    role: "Lead Software & Vision Researcher",
    research: "Specializes in edge computing AI models, HSV-based active stereo vision tracking, and Homography visual servoing.",
    email: "e.rostova@university.edu",
    github: "elena-rost",
    robotSeed: "ElenaRostova"
  },
  {
    name: "Alex Kim",
    role: "M.S. Robotics Student",
    research: "Researching micro-controller driver setups, CAN bus communication standards, and brushless motor driver integrations.",
    email: "a.kim@university.edu",
    github: "akim-dev",
    robotSeed: "AlexKim"
  }
];

function TeamView() {
  return (
    <div>
      <section className="about-section">
        <h2>About the Autonomous Systems Lab</h2>
        <p>
          We are an academic research facility dedicated to developing robust, open-source software and mechanical configurations for robotic systems. Our workspace bridges the gap between raw mathematical control architectures and production-ready implementations in the real world.
        </p>
        <p>
          Our codebases are 100% open, allowing research teams worldwide to compile, modify, and build upon our findings. Visit our repositories to see active developments and hardware CAD diagrams.
        </p>
      </section>

      <div className="section-header">
        <h2 className="section-title">Meet Our Team</h2>
      </div>

      <div className="team-grid">
        {teamMembers.map((member, idx) => (
          <div key={idx} className="team-card">
            <div className="team-avatar-container">
              {/* Uses Robohash to generate cute robot avatars based on the names. Perfect for the theme! */}
              <img
                src={`https://robohash.org/${member.robotSeed}.png?set=set4&size=150x150`}
                alt={member.name}
                className="team-avatar"
              />
            </div>
            <h3 className="team-name">{member.name}</h3>
            <div className="team-role">{member.role}</div>
            <p className="team-research">{member.research}</p>
            <div className="team-links">
              <a href={`mailto:${member.email}`} className="team-link" title="Email Member">
                <i className="fa-regular fa-envelope"></i>
              </a>
              <a href={`https://github.com/${member.github}`} target="_blank" rel="noopener noreferrer" className="team-link" title="GitHub Profile">
                <i className="fa-brands fa-github"></i>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================================================
   Robot Platform Data
   ========================================================================== */
const spotResources = [
  {
    id: 'spot-overview',
    title: 'Boston Dynamics SPOT — Platform Overview',
    excerpt: 'Introduction to SPOT: hardware capabilities, Spot SDK structure, and first steps for lab researchers.',
    tags: ['Hardware', 'SDK'],
    author: 'Lab Team',
    date: 'Jan 2025'
  },
  {
    id: 'spot-autonomy',
    title: 'Autonomous Navigation with SPOT',
    excerpt: 'Using GraphNav and the autowalk service to map environments, record missions, and replay autonomous patrols.',
    tags: ['Navigation', 'SDK'],
    author: 'Dr. Sarah Miller',
    date: 'Feb 2025'
  },
  {
    id: 'spot-arm',
    title: 'SPOT Arm Manipulation',
    excerpt: 'Controlling the SPOT Arm via the Spot SDK — inverse kinematics, grasping objects, and arm-camera visual feedback.',
    tags: ['Control', 'Vision'],
    author: 'Marcus Thorne',
    date: 'Mar 2025'
  },
  {
    id: 'spot-ros2',
    title: 'ROS 2 Driver for Boston Dynamics SPOT',
    excerpt: 'Setting up the open-source spot_ros2 driver, configuring the URDF, and publishing sensor data to ROS 2 topics.',
    tags: ['ROS 2', 'Hardware'],
    author: 'Elena Rostova',
    date: 'Apr 2025'
  }
];

/* ==========================================================================
   Robot Platform View Component
   ========================================================================== */
function RobotView({ robot, resources, setView }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedTag, setSelectedTag] = React.useState('All');

  const allTags = React.useMemo(() => {
    const s = new Set(['All']);
    resources.forEach(r => r.tags.forEach(t => s.add(t)));
    return Array.from(s);
  }, [resources]);

  const filtered = React.useMemo(() => {
    return resources.filter(r => {
      const matchSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTag = selectedTag === 'All' || r.tags.includes(selectedTag);
      return matchSearch && matchTag;
    });
  }, [resources, searchTerm, selectedTag]);

  const isG1 = robot === 'g1';
  const title = isG1 ? 'Unitree G1' : 'Boston Dynamics SPOT';
  const icon = isG1 ? 'fa-solid fa-person-walking' : 'fa-solid fa-dog';
  const subtitle = isG1
    ? 'Resources, tutorials, and guides for the Unitree G1 humanoid robot platform.'
    : 'Resources, tutorials, and guides for the Boston Dynamics SPOT quadruped robot platform.';

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">
          <i className={icon} style={{ marginRight: '0.6rem', color: 'var(--primary)' }}></i>
          {title}
        </h2>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', marginTop: '-0.5rem' }}>{subtitle}</p>

      <div className="controls-bar">
        <div className="search-wrapper">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder={`Search ${title} resources...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="tags-filter">
          {allTags.map(tag => (
            <button
              key={tag}
              className={`filter-btn ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="card-grid" style={{ minHeight: '300px' }}>
        {filtered.map(resource => (
          <div key={resource.id} className="card">
            <div className="card-content">
              <div className="card-tag-list">
                {resource.tags.map(tag => (
                  <span
                    key={tag}
                    className="tag primary"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="card-title">
                {resource.id ? (
                  <a href={`#tutorials/${resource.id}`} onClick={() => setView(`tutorials/${resource.id}`)}>
                    {resource.title}
                  </a>
                ) : (
                  resource.title
                )}
              </h3>
              <p className="card-excerpt">{resource.excerpt}</p>
              <div className="card-footer">
                <span className="card-author">
                  <i className="fa-solid fa-user" style={{ marginRight: '4px' }}></i> {resource.author}
                </span>
                <span>{resource.date}</span>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            <i className="fa-solid fa-circle-xmark" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem', color: 'var(--text-muted)' }}></i>
            No resources found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   Main Application Root
   ========================================================================== */
function App() {
  const [view, setView] = React.useState('home');
  const [tutorials, setTutorials] = React.useState([]);
  const [videos, setVideos] = React.useState([]);

  // Read metadata index lists on startup
  React.useEffect(() => {
    fetch('./content/tutorials.json')
      .then(res => res.json())
      .then(data => setTutorials(data))
      .catch(err => console.error("Failed to load tutorials list:", err));

    fetch('./content/videos.json')
      .then(res => res.json())
      .then(data => setVideos(data))
      .catch(err => console.error("Failed to load videos list:", err));
  }, []);

  // Simple state router synced with address bar hash state
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#home';
      // Route parsing (e.g. #tutorials/intro-to-ros)
      const cleanedRoute = hash.slice(1); // removes the '#'
      setView(cleanedRoute);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run on initial page load

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Navigations wrapper
  const navigateTo = (route) => {
    window.location.hash = `#${route}`;
  };

  const renderContent = () => {
    if (view === 'home' || view === '') {
      // Get the latest 3 tutorials to display on home page
      const featured = tutorials.slice(0, 3);
      return <HomeView setView={navigateTo} featuredTutorials={featured} />;
    }
    
    if (view === 'tutorials') {
      return <TutorialsView tutorials={tutorials} setView={navigateTo} />;
    }
    
    if (view.startsWith('tutorials/')) {
      const tutorialId = view.split('/')[1];
      return <TutorialReaderView tutorialId={tutorialId} setView={navigateTo} tutorials={tutorials} />;
    }
    
    if (view === 'videos') {
      return <VideosView videos={videos} />;
    }
    
    if (view === 'robots/g1') {
      const g1Resources = tutorials.filter(t => t.tags.includes('G1'));
      return <RobotView robot="g1" resources={g1Resources} setView={navigateTo} />;
    }

    if (view === 'robots/spot') {
      return <RobotView robot="spot" resources={spotResources} setView={navigateTo} />;
    }

    if (view === 'team') {
      return <TeamView />;
    }

    return (
      <div style={{ textAlign: 'center', padding: '5rem' }}>
        <h2>404 - Grid Node Out of Reach</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '2rem' }}>The page address does not match any route in our matrix.</p>
        <button className="btn btn-primary" onClick={() => navigateTo('home')}>Return Home</button>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar currentView={view} setView={navigateTo} />
      <main className="app-container">
        {renderContent()}
      </main>
      <footer className="footer">
        &copy; {new Date().getFullYear()} sam1695.dev.robotics Built with <i className="fa-solid fa-heart" style={{ display: 'inline', color: 'var(--primary)' }}></i> using React CDN.
      </footer>
    </div>
  );
}

// Initial mount into HTML DOM root
const rootEl = document.getElementById('root');
const root = ReactDOM.createRoot(rootEl);
root.render(<App />);
