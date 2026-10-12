import AuthScreen from './AuthScreen';
import { useEffect, useState } from 'react';
import './App.css';
const BACKEND_URL = 'https://flixo-backend-1.onrender.com/api/hello';
const MAX_PROFILES = 5;

const avatarOptions = [
  '😀', '😎', '🥰', '🤍', '🩷',
  '🐶', '🐱', '🐼', '🦊', '🐻',
  '🐯', '🐨', '🦋', '🌸', '⭐',
  '👻', '🎧', '🎮', '🦄', '🔥'
];

const defaultProfiles = [
  { id: 1, name: 'Mythri', emoji: '😀' },
  { id: 2, name: 'Kishore', emoji: '🐱' },
  { id: 3, name: 'Sister', emoji: '🎧' },
  { id: 4, name: 'Mom', emoji: '🌸' }
];

const movies = {
  trending: [
    'Titanic',
    'Inception',
    'Oppenheimer',
    'The Dark Knight',
    'Avengers: Endgame'
  ],
  romance: [
    'The Notebook',
    'La La Land',
    'Little Women',
    'Me Before You',
    'The Fault in Our Stars'
  ],
  popular: [
    'Wednesday',
    'Stranger Things',
    'Money Heist',
    'Squid Game',
    'The Witcher'
  ],
  thriller: [
    'A Quiet Place',
    'Get Out',
    'The Conjuring',
    'A Quiet Place Part II',
    'The Nun'
  ]
};

function App() {
  const [stage, setStage] = useState(0);
  const [backendStatus, setBackendStatus] = useState('Checking...');
  useEffect(() => {
  fetch(BACKEND_URL)
    .then(response => {
      if (!response.ok) {
        throw new Error('Backend request failed');
      }
      return response.text();
    })
    .then(() => setBackendStatus('Connected'))
    .catch(() => setBackendStatus('Disconnected'));
}, []);
  const [profiles, setProfiles] = useState(() => {
    try {
      const saved = localStorage.getItem('flixoProfiles');
      return saved ? JSON.parse(saved) : defaultProfiles;
    } catch {
      return defaultProfiles;
    }
  });

  const [editing, setEditing] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [authenticatedUser, setAuthenticatedUser] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem('flixoAuthUser') || 'null');
  } catch {
    return null;
  }
});
  const [avatarPicker, setAvatarPicker] = useState(null);

  useEffect(() => {
    localStorage.setItem('flixoProfiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 500),
      setTimeout(() => setStage(2), 1100),
      setTimeout(() => setStage(3), 1700),
      setTimeout(() => setStage(4), 2300),
      setTimeout(() => setStage(5), 2900),
      setTimeout(() => setStage(6), 3900),
      setTimeout(() => setStage(7), 6500)
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  if (stage < 7) {
    return (
      <div className="intro-screen">
        {stage <= 5 && (
          <div className="letter-animation">
            {stage === 1 && 'F'}
            {stage === 2 && 'FL'}
            {stage === 3 && 'FLI'}
            {stage === 4 && 'FLIX'}
            {stage === 5 && 'FLIXO'}
          </div>
        )}

        {stage >= 6 && (
          <div className="final-logo">
            <div className="flixo-logo">FLIXO</div>
            <div className="tagline">YOUR NEXT STORY AWAITS</div>
            <div className="loading-container">
              <div className="loading-bar" />
            </div>
            <div className="loading-text">
              Loading your world...
            </div>
          </div>
        )}
      </div>
    );
  }
  if (!authenticatedUser) {
  return (
    <AuthScreen
      onSuccess={(user) => {
        localStorage.setItem('flixoAuthUser', JSON.stringify(user));
        setAuthenticatedUser(user);
      }}
    />
  );
}
  if (selectedProfile) {
    return (
      <Home
        profile={selectedProfile}
        onBack={() => setSelectedProfile(null)}
      />
    );
  }

  function updateProfile(id, changes) {
    setProfiles(current =>
      current.map(profile =>
        profile.id === id
          ? { ...profile, ...changes }
          : profile
      )
    );
  }

  function addProfile() {
    if (profiles.length >= MAX_PROFILES) return;

    setProfiles(current => [
      ...current,
      {
        id: Date.now(),
        name: 'New Profile',
        emoji: '😀'
      }
    ]);
  }

  return (
    <div className="profiles-screen">
      <div className="profiles-header">
        <div
  style={{
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    zIndex: 9999,
    background: '#181818',
    color: backendStatus === 'Connected' ? '#46d369' : '#ff6b6b',
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '12px'
  }}
>
  Backend: {backendStatus}
</div>
        <div className="small-logo">FLIXO</div>

        <button
          className="edit-button"
          onClick={() => {
            setEditing(value => !value);
            setAvatarPicker(null);
          }}
        >
          {editing ? '✓ Done' : '✎ Edit Profiles'}
        </button>
      </div>

      <div className="profiles-content">
        <h1>Who's watching?</h1>

        <div className="profiles">
          {profiles.map(profile => (
            <div className="profile" key={profile.id}>
              <div
                className="avatar"
                onClick={() => {
                  if (!editing) setSelectedProfile(profile);
                }}
              >
                {editing && (
                  <button
                    className="delete-profile"
                    onClick={event => {
                      event.stopPropagation();
                      setProfiles(current =>
                        current.filter(item => item.id !== profile.id)
                      );
                      setAvatarPicker(null);
                    }}
                  >
                    −
                  </button>
                )}

                {profile.emoji}
              </div>

              {editing ? (
                <input
                  className="profile-name-input"
                  value={profile.name}
                  onChange={event =>
                    updateProfile(profile.id, {
                      name: event.target.value
                    })
                  }
                />
              ) : (
                <p>{profile.name}</p>
              )}

              {editing && (
                <button
                  className="change-avatar-button"
                  onClick={() =>
                    setAvatarPicker(
                      avatarPicker === profile.id
                        ? null
                        : profile.id
                    )
                  }
                >
                  Change Avatar
                </button>
              )}

              {editing && avatarPicker === profile.id && (
                <div className="emoji-picker">
                  <div className="emoji-title">
                    Choose an avatar
                  </div>

                  <div className="emoji-options">
                    {avatarOptions.map(emoji => (
                      <button
                        key={emoji}
                        className="emoji-option"
                        onClick={() => {
                          updateProfile(profile.id, { emoji });
                          setAvatarPicker(null);
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {profiles.length < MAX_PROFILES && (
            <div
              className="profile add-profile-container"
              onClick={addProfile}
            >
              <div className="add-profile">+</div>
              <p>Add Profile</p>
            </div>
          )}
        </div>

        {profiles.length >= MAX_PROFILES && (
          <div className="max-profile-message">
            You can have up to 5 profiles on FLIXO.
          </div>
        )}

        <div className="lock">🔒</div>
      </div>
    </div>
  );
}

function Home({ profile, onBack }) {
  const [activeNav, setActiveNav] = useState('Home');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [myList, setMyList] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem('flixoMyList') || '[]'
      );
    } catch {
      return [];
    }
  });

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    localStorage.setItem('flixoMyList', JSON.stringify(myList));
  }, [myList]);

  const allMovies = Object.entries(movies).flatMap(
    ([category, titles]) =>
      titles.map(title => ({ title, category }))
  );

  const visibleMovies = allMovies.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function toggleList(title) {
    const exists = myList.includes(title);

    setMyList(current =>
      exists
        ? current.filter(item => item !== title)
        : [...current, title]
    );

    setNotice(
      exists
        ? `${title} removed from My List`
        : `${title} added to My List`
    );

    window.setTimeout(() => setNotice(''), 2200);
  }

  function showPlayMessage(title) {
    setSelectedMovie(null);
    setNotice(
      `Playback for "${title}" needs a video source to be connected.`
    );
    window.setTimeout(() => setNotice(''), 3000);
  }

  const sections = [
    { key: 'trending', title: '🎬 Trending Movies' },
    { key: 'romance', title: '❤️ Romance & Drama' },
    { key: 'popular', title: '🔥 Popular on FLIXO' },
    { key: 'thriller', title: '👻 Thriller & Mystery' }
  ];

  return (
    <div className="home-screen">
      <nav className="navbar">
        <button
          className="home-logo logo-button"
          onClick={() => {
            setActiveNav('Home');
            setSearchTerm('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          FLIXO
        </button>

        <div className="nav-links">
          {['Home', 'Movies', 'Series', 'New & Popular', 'My List'].map(item => (
            <button
              key={item}
              className={activeNav === item ? 'active' : ''}
              onClick={() => {
                setActiveNav(item);
                setSearchTerm('');

                const target =
                  item === 'My List'
                    ? 'my-list-row'
                    : item === 'Series' || item === 'New & Popular'
                      ? 'popular-row'
                      : item === 'Movies'
                        ? 'trending-row'
                        : null;

                if (item === 'Home') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (target) {
                  window.setTimeout(() => {
                    document.getElementById(target)?.scrollIntoView({
                      behavior: 'smooth'
                    });
                  }, 50);
                }
              }}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="nav-right">
          {searchOpen && (
            <input
              autoFocus
              className="search-input"
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
              placeholder="Search titles..."
              aria-label="Search titles"
            />
          )}

          <button
            className="search-icon"
            aria-label="Search movies"
            onClick={() => {
              setSearchOpen(value => !value);
              setSearchTerm('');
            }}
          >
            ⌕
          </button>

          <button
            className="profile-button"
            title={`Profile: ${profile.name}`}
            onClick={onBack}
          >
            {profile.emoji}
          </button>

<button
  className="logout-button"
  onClick={() => {
    localStorage.removeItem('flixoAuthUser');
    window.location.reload();
  }}
>
  Log out
</button>

        </div>
      </nav>

      {searchTerm ? (
        <main className="search-results content-section">
          <h2>Search results for “{searchTerm}”</h2>

          <div className="movie-list search-movie-list">
            {visibleMovies.map(item => (
              <MovieCard
                key={item.title}
                movie={item.title}
                onSelect={setSelectedMovie}
                myList={myList}
                onToggleList={toggleList}
                onPlay={showPlayMessage}
              />
            ))}

            {visibleMovies.length === 0 && (
              <p className="empty-state">
                No titles found. Try another search.
              </p>
            )}
          </div>
        </main>
      ) : (
        <>
          {activeNav === 'Home' && (
            <section className="hero-section">
              <div className="hero-content">
                <div className="hero-small">
                  ✦ #1 IN FLIXO TODAY
                </div>

                <h1>THE LAST SIGNAL</h1>

                <div className="hero-info">
                  <span>98% Match</span>
                  <span>2026</span>
                  <span>16+</span>
                  <span>2h 18m</span>
                </div>

                <p>
                  When a mysterious signal reaches Earth, a group
                  of strangers must uncover its secret before the
                  world changes forever.
                </p>

                <div className="hero-buttons">
                  <button
                    className="play-button"
                    onClick={() => showPlayMessage('The Last Signal')}
                  >
                    ▶ Play
                  </button>

                  <button
                    className="list-button"
                    onClick={() => toggleList('The Last Signal')}
                  >
                    {myList.includes('The Last Signal')
                      ? '✓ In My List'
                      : '+ My List'}
                  </button>
                </div>
              </div>
            </section>
          )}

          <main className="content-section">
            {activeNav === 'My List' ? (
              <section className="movie-row" id="my-list-row">
                <h2>♡ My List</h2>

                <div className="movie-list">
                  {myList.map(title => (
                    <MovieCard
                      key={title}
                      movie={title}
                      onSelect={setSelectedMovie}
                      myList={myList}
                      onToggleList={toggleList}
                      onPlay={showPlayMessage}
                    />
                  ))}

                  {myList.length === 0 && (
                    <p className="empty-state">
                      Your list is empty. Add movies using the ＋
                      button on a poster.
                    </p>
                  )}
                </div>
              </section>
            ) : (
              sections
                .filter(section => {
                  if (activeNav === 'Movies') {
                    return ['trending', 'romance', 'thriller'].includes(section.key);
                  }

                  if (activeNav === 'Series') {
                    return section.key === 'popular';
                  }

                  if (activeNav === 'New & Popular') {
                    return ['popular', 'trending'].includes(section.key);
                  }

                  return true;
                })
                .map(section => (
                  <div
                    id={`${section.key}-row`}
                    key={section.key}
                  >
                    <MovieRow
                      title={section.title}
                      movies={movies[section.key]}
                      onSelect={setSelectedMovie}
                      myList={myList}
                      onToggleList={toggleList}
                      onPlay={showPlayMessage}
                    />
                  </div>
                ))
            )}
          </main>
        </>
      )}

      <footer className="flixo-footer">
        <span className="footer-logo">FLIXO</span>
        <span>Stories for every mood.</span>
        <span>Demo streaming experience</span>
      </footer>

      {notice && (
        <div className="flixo-toast" role="status">
          {notice}
        </div>
      )}

      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          isSaved={myList.includes(selectedMovie)}
          onToggleList={() => toggleList(selectedMovie)}
          onPlay={() => showPlayMessage(selectedMovie)}
        />
      )}
    </div>
  );
}

function MovieRow({
  title,
  movies: rowMovies,
  onSelect,
  myList,
  onToggleList,
  onPlay
}) {
  const rowId = title.includes('Trending')
    ? 'trending-row'
    : title.includes('Popular')
      ? 'popular-row'
      : undefined;

  return (
    <section className="movie-row" id={rowId}>
      <div className="row-heading">
        <h2>{title}</h2>
        <span className="row-hint">Explore</span>
      </div>

      <div className="movie-list">
        {rowMovies.map(movie => (
          <MovieCard
            key={movie}
            movie={movie}
            onSelect={onSelect}
            myList={myList}
            onToggleList={onToggleList}
            onPlay={onPlay}
          />
        ))}
      </div>
    </section>
  );
}

function MovieCard({
  movie,
  onSelect,
  myList = [],
  onToggleList = () => {},
  onPlay = () => {}
}) {
  const [poster, setPoster] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function findPoster() {
      setLoading(true);
      setPoster(null);

      try {
        let imageUrl = null;

        const tvmazeQueries = {
          Wednesday: 'Wednesday',
          'Stranger Things': 'Stranger Things',
          'Money Heist': 'La Casa de Papel',
          'Squid Game': 'Squid Game',
          'The Witcher': 'The Witcher'
        };

        if (tvmazeQueries[movie]) {
          try {
            const response = await fetch(
              `https://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(
                tvmazeQueries[movie]
              )}`
            );

            if (response.ok) {
              const show = await response.json();
              imageUrl =
                show.image?.original ||
                show.image?.medium ||
                null;
            }
          } catch (error) {
            console.warn(`TV poster lookup failed for ${movie}`, error);
          }
        }

        if (!imageUrl) {
          const response = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
              movie
            )}`
          );

          if (response.ok) {
            const data = await response.json();
            imageUrl = data.thumbnail?.source || null;
          }
        }

        if (!cancelled) setPoster(imageUrl);
      } catch (error) {
        console.warn(`Could not find poster for ${movie}`, error);
        if (!cancelled) setPoster(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    findPoster();

    return () => {
      cancelled = true;
    };
  }, [movie]);

  return (
    <article className="movie-card">
      <button
        className="poster-open-button"
        onClick={() => onSelect?.(movie)}
        aria-label={`View details for ${movie}`}
      >
        <div className="movie-poster">
          {loading && (
            <div className="poster-loading">
              <span className="loading-spinner" />
              Loading poster…
            </div>
          )}

          {!loading && poster && (
            <img
              src={poster}
              alt={`${movie} poster`}
              loading="lazy"
              onError={() => setPoster(null)}
            />
          )}

          {!loading && !poster && (
            <div className="poster-fallback">
              <div>🎬</div>
              <span>{movie}</span>
              <small>FLIXO ORIGINALS</small>
            </div>
          )}

          <div className="movie-overlay">
            <span className="overlay-play">▶</span>
            <span className="overlay-title">{movie}</span>
          </div>
        </div>
      </button>

      <div className="movie-card-meta">
        <p>{movie}</p>

        <div className="card-actions">
          <button
            onClick={() => onPlay(movie)}
            aria-label={`Play ${movie}`}
            title="Play"
          >
            ▶
          </button>

          <button
            onClick={() => onToggleList(movie)}
            aria-label={`${
              myList.includes(movie) ? 'Remove' : 'Add'
            } ${movie} ${
              myList.includes(movie) ? 'from' : 'to'
            } My List`}
            title="My List"
          >
            {myList.includes(movie) ? '✓' : '+'}
          </button>

          <button
            onClick={() => onSelect?.(movie)}
            aria-label={`More information about ${movie}`}
            title="Details"
          >
            ⓘ
          </button>
        </div>
      </div>
    </article>
  );
}

function MovieDetails({
  movie,
  onClose,
  isSaved,
  onToggleList,
  onPlay
}) {
  return (
    <div
      className="details-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <section
        className="details-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${movie} details`}
        onClick={event => event.stopPropagation()}
      >
        <button
          className="details-close"
          onClick={onClose}
          aria-label="Close details"
        >
          ×
        </button>

        <div className="details-art">
          <div className="details-art-glow">FLIXO</div>
        </div>

        <div className="details-body">
          <span className="details-kicker">FLIXO PICKS</span>

          <h2>{movie}</h2>

          <div className="details-meta">
            <span>HD</span>
            <span>Popular pick</span>
            <span>Movie / Series</span>
          </div>

          <p>
            Explore {movie} on FLIXO. Movie information, trailers
            and streaming playback can be connected through your
            backend and licensed video sources.
          </p>

          <div className="details-actions">
            <button className="play-button" onClick={onPlay}>
              ▶ Play
            </button>

            <button
              className="list-button"
              onClick={onToggleList}
            >
              {isSaved ? '✓ In My List' : '+ My List'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
