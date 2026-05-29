/* Flawed Frame — Archive page */
const { useState, useEffect, useCallback } = React;

/* ----- DATA ----- */
const ARCHIVED = [
  {
    id: "s-almost",
    name: "Almost",
    date: "15 Jan 2025 — 15 Apr 2025",
    collected: "8 of 14 collected",
    pieces: [
      {
        title: "The Millimetre", sold: true, soldOn: "22 Jan 2025",
        edition: "1 of 1 · unique",
        inscription: "close enough.",
        desc: "The distance no ruler reads.",
      },
      {
        title: "Tide & Line", sold: true, soldOn: "9 Feb 2025",
        edition: "Edition of 3 · all claimed",
        inscription: "not today.",
        desc: "Water that came one step further than expected.",
      },
      {
        title: "One Shelf Up", sold: true, soldOn: "1 Mar 2025",
        edition: "Edition of 10 · 6 collected",
        inscription: "almost yours.",
        desc: "The thing the hand did not reach.",
      },
      {
        title: "Washed Away", sold: true, soldOn: "28 Mar 2025",
        edition: "1 of 1 · unique",
        inscription: "it was here.",
        desc: "What the river kept.",
      },
      {
        title: "The Last Step", sold: false,
        edition: "Edition of 3 · 2 claimed",
        inscription: "one more.",
        desc: "One stride short of arrival. Retired with one copy unmade.",
      },
      {
        title: "Silver Lining", sold: false,
        edition: "Edition of 10 · 3 collected",
        inscription: "but still.",
        desc: "Second place, framed. Retired with seven copies unmade.",
      },
    ],
  },
  {
    id: "s-access",
    name: "Access",
    date: "1 Jan 2025 — 1 Apr 2025",
    collected: "5 of 14 collected",
    pieces: [
      {
        title: "Summit Reserved", sold: true, soldOn: "4 Jan 2025",
        edition: "1 of 1 · unique",
        inscription: "still reserved.",
        desc: "A blue square at altitude. Permission posted to a place no permission was ever needed.",
      },
      {
        title: "Horizon Ramp", sold: false,
        edition: "Edition of 3 · 1 collected",
        inscription: "this way out.",
        desc: "A ramp that means it. Retired with two copies unmade.",
      },
      {
        title: "Written in Cloud", sold: true, soldOn: "17 Feb 2025",
        edition: "Edition of 10 · 3 collected",
        inscription: "read the sky.",
        desc: "A message arranged in cloud above a watcher. Either it is for her or it is for no one.",
      },
      {
        title: "The Loop", sold: false,
        edition: "1 of 1 · never claimed",
        inscription: "hear this.",
        desc: "A hearing loop pitched into desert. The signal carried to nothing. Retired.",
      },
      {
        title: "Four Fifty Five", sold: true, soldOn: "12 Mar 2025",
        edition: "Edition of 3 · all claimed",
        inscription: "four fifty five.",
        desc: "A finish line crossed alone at the time on the clock.",
      },
      {
        title: "Desert Signal", sold: false,
        edition: "Edition of 10 · 2 collected",
        inscription: "frequency unknown.",
        desc: "A transmitter in dry country. Retired with eight copies unmade.",
      },
    ],
  },
];

/* ----- COMPONENTS ----- */
function Nav() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a href="index.html" aria-label="Flawed Frame — home">
          <img className="nav-logo" src="assets/logomark.png" alt="Flawed Frame" />
        </a>
        <div className="nav-links">
          <a href="index.html">Current</a>
          <a href="archive.html" className="is-active" aria-current="page">Archive</a>
          <a href="index.html#series-1">Collect</a>
        </div>
      </div>
    </nav>
  );
}

function PageHead() {
  return (
    <section className="page-head">
      <div className="wrap">
        <h1>Archive.</h1>
        <p className="lede">
          Every series that has passed. Nothing here is available. Nothing returns.
        </p>
      </div>
    </section>
  );
}

function Thumb({ piece, onOpen }) {
  const handle = () => onOpen(piece);
  return (
    <div
      className={"thumb " + (piece.sold ? "is-sold" : "is-unsold")}
      onClick={handle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handle(); } }}
    >
      <div className="thumb-media">
        <div className="img" />
        <div className="veil" aria-hidden="true" />
      </div>
      <div className="thumb-title" title={piece.title}>{piece.title}</div>
    </div>
  );
}

function SeriesBlock({ data, onOpen }) {
  return (
    <section className="series-block">
      <div className="wrap">
        <div className="series-row1">
          <h2 className="name">{data.name}</h2>
          <div className="meta">
            <div className="date">{data.date}</div>
            <div className="count">{data.collected}</div>
          </div>
        </div>
        <div className="thumb-strip">
          {data.pieces.map((p, i) => (
            <Thumb key={i} piece={{ ...p, seriesName: data.name, seriesDate: data.date }} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="empty">
      <p>The archive is empty. This is only the beginning.</p>
    </div>
  );
}

function RunningTotal({ seriesCount, piecesGone, days }) {
  return (
    <section className="total">
      <div className="wrap">
        <p>{seriesCount} series archived · {piecesGone} pieces gone · {days} days elapsed</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <img src="assets/logomark.png" alt="Flawed Frame" />
            <div className="tag">Imperfection. Preserved.</div>
          </div>
          <div className="foot-links">
            <a href="archive.html">Archive</a>
            <a href="index.html#series-1">Collect</a>
            <a href="#">Instagram</a>
          </div>
        </div>
        <div className="foot-bottom">
          <div>© 2025 Flawed Frame. All pieces registered. No reprints.</div>
          <div>International shipping. USD.</div>
        </div>
      </div>
    </footer>
  );
}

function Modal({ piece, onClose }) {
  useEffect(() => {
    document.body.classList.add("modal-open");
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  if (!piece) return null;
  const stop = (e) => e.stopPropagation();
  const stateClass = piece.sold ? "is-sold" : "is-unsold";

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal" onClick={stop}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className={"modal-media " + stateClass}>
          <div className="img" />
          <div className="veil" aria-hidden="true" />
          <div className="modal-inscription">"{piece.inscription}"</div>
        </div>

        <div className="modal-body">
          <div className="series-line">Archived · {piece.seriesName} · {piece.seriesDate}</div>
          <h2 className="m-title">{piece.title}</h2>
          <div className="edition-line">{piece.edition}</div>
          <p className="desc">{piece.desc}</p>

          <div className="modal-divider" />

          <div className="status-block">
            <span className={"status-pill" + (piece.sold ? "" : " unsold")}>
              {piece.sold ? "Collected" : "Retired unsold"}
            </span>
            <div className="status-detail">
              {piece.sold
                ? `Sold ${piece.soldOn}. Provenance issued. The prompt has been permanently destroyed.`
                : "The window closed without a collector. This piece has been retired and will never be made again."}
            </div>
          </div>

          <div className="archived-note">Archived · Not for sale</div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [archived] = useState(ARCHIVED);
  const [openPiece, setOpenPiece] = useState(null);
  const piecesGone = archived.reduce((n, s) => n + s.pieces.length, 0);

  const handleOpen = useCallback((piece) => setOpenPiece(piece), []);
  const handleClose = useCallback(() => setOpenPiece(null), []);

  return (
    <React.Fragment>
      <Nav />
      <PageHead />
      {archived.length === 0
        ? <EmptyState />
        : archived.map((s) => <SeriesBlock key={s.id} data={s} onOpen={handleOpen} />)
      }
      <RunningTotal
        seriesCount={archived.length}
        piecesGone={piecesGone}
        days={84}
      />
      <Footer />
      {openPiece && <Modal piece={openPiece} onClose={handleClose} />}
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
