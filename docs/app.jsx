/* Flawed Frame — single-page React site (revised) */
const { useEffect, useState, useCallback } = React;

/* ----- DATA ----- */
const SERIES_I = {
  eyebrow: "Series I — Now live",
  name: "Access",
  tagline: "Signs without roads. Symbols without arrival.",
  days: 67,
  urgent: false,
  statement:
    "Six pieces. Each one a sign placed where signs were never meant to go. Available until 1 November 2026. Not before. Not after.",
  cards: [
    {
      id: "s1-summit",
      title: "Summit Reserved",
      inscription: "still reserved.",
      img: "assets/art-01.jpg",
      badge: { tone: "gold", label: "1 of 1" },
      price: "$2,400",
      sold: true,
      edition: { sold: 1, total: 1, kind: "unique" },
      desc:
        "A blue square at altitude. Permission posted to a place no permission was ever needed. The wind keeps its own record.",
      collectorNote: "Sold. Permanent inscription complete.",
    },
    {
      id: "s1-horizon",
      title: "Horizon Ramp",
      inscription: "this way out.",
      img: "assets/art-04.jpg",
      badge: { tone: "blue", label: "3 of 3" },
      price: "$680",
      edition: { sold: 1, total: 3, kind: "edition" },
      desc:
        "A ramp that means it. Handrails worn smooth. The ocean does not notice. The horizon does not move. One copy remaining.",
      collectorNote: "Copy 2 of 3. Ships framed.",
    },
    {
      id: "s1-cloud",
      title: "Written in Cloud",
      inscription: "read the sky.",
      img: "assets/art-03.jpg",
      badge: { tone: "sage", label: "Edition of 10" },
      price: "$195",
      edition: { sold: 3, total: 10, kind: "edition" },
      desc:
        "A message arranged in cloud above a watcher. Either it is for her or it is for no one. Seven copies remain.",
    },
    {
      id: "s1-loop",
      title: "The Loop",
      inscription: "hear this.",
      img: "assets/art-02.jpg",
      badge: { tone: "gold", label: "1 of 1" },
      price: "$1,800",
      edition: { sold: 0, total: 1, kind: "unique" },
      desc:
        "A hearing loop pitched into desert. The signal carries to nothing. The nothing carries it back.",
    },
    {
      id: "s1-455",
      title: "Four Fifty Five",
      inscription: "four fifty five.",
      img: "assets/art-05.jpg",
      badge: { tone: "blue", label: "3 of 3" },
      price: "$750",
      edition: { sold: 0, total: 3, kind: "edition" },
      desc:
        "A finish line crossed alone at the time on the clock. Crutches forward. Sun behind. Three copies, none claimed yet.",
    },
    {
      id: "s1-desert",
      title: "Desert Signal",
      inscription: "frequency unknown.",
      img: null,
      placeholderMark: "FF · I.VI",
      badge: { tone: "sage", label: "Edition of 10" },
      price: "$220",
      edition: { sold: 2, total: 10, kind: "edition" },
      desc:
        "A transmitter in dry country. Nothing receives. Eight copies remain.",
    },
  ],
};

const SERIES_II = {
  eyebrow: "Series II — Now live",
  name: "Almost",
  tagline: "The millimetre between triumph and everything else.",
  days: 23,
  urgent: true,
  statement:
    "Six pieces. Closing 31 October 2026. Four remain. Two are gone.",
  cards: [
    {
      id: "s2-mm",
      title: "The Millimetre",
      inscription: "close enough.",
      img: null, placeholderMark: "FF · II.I",
      badge: { tone: "gold", label: "1 of 1" },
      price: "$3,100",
      sold: true,
      edition: { sold: 1, total: 1, kind: "unique" },
      desc: "The distance no ruler reads.",
    },
    {
      id: "s2-tide",
      title: "Tide & Line",
      inscription: "not today.",
      img: null, placeholderMark: "FF · II.II",
      badge: { tone: "blue", label: "3 of 3" },
      price: "$590",
      sold: true,
      edition: { sold: 3, total: 3, kind: "edition" },
      desc: "Water that came one step further than expected. All three claimed.",
    },
    {
      id: "s2-shelf",
      title: "One Shelf Up",
      inscription: "almost yours.",
      img: null, placeholderMark: "FF · II.III",
      badge: { tone: "sage", label: "Edition of 10" },
      price: "$175",
      edition: { sold: 6, total: 10, kind: "edition" },
      desc: "The thing the hand did not reach. Four copies remain.",
    },
    {
      id: "s2-washed",
      title: "Washed Away",
      inscription: "it was here.",
      img: null, placeholderMark: "FF · II.IV",
      badge: { tone: "gold", label: "1 of 1" },
      price: "$2,200",
      edition: { sold: 0, total: 1, kind: "unique" },
      desc: "What the river kept. Unique work.",
    },
    {
      id: "s2-laststep",
      title: "The Last Step",
      inscription: "one more.",
      img: null, placeholderMark: "FF · II.V",
      badge: { tone: "blue", label: "3 of 3" },
      price: "$620",
      edition: { sold: 2, total: 3, kind: "edition" },
      desc: "One stride short of arrival. One copy remaining.",
    },
    {
      id: "s2-silver",
      title: "Silver Lining",
      inscription: "but still.",
      img: null, placeholderMark: "FF · II.VI",
      badge: { tone: "sage", label: "Edition of 10" },
      price: "$195",
      edition: { sold: 3, total: 10, kind: "edition" },
      desc: "Second place, framed. Seven copies remain.",
    },
  ],
};

/* ----- COMPONENTS ----- */
function Nav() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a href="#top" aria-label="Flawed Frame — home">
          <img className="nav-logo" src="assets/logomark.png" alt="Flawed Frame" />
        </a>
        <div className="nav-links">
          <a href="#series-1">Current</a>
          <a href="archive.html">Archive</a>
          <a href="#series-1">Collect</a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  // staggered entrance — delays 100, 220, 340, 460
  const d = (i) => ({ animationDelay: 100 + i * 120 + "ms" });
  return (
    <header className="hero" id="top">
      <div className="wrap hero-inner">
        <span className="eyebrow fade-up" style={d(0)}>
          Two series. Twelve pieces. Ninety days. Then gone.
        </span>
        <h1 className="fade-up" style={d(1)}>
          Each piece, one window. <span className="accent">Then gone.</span>
        </h1>
        <p className="hero-body fade-up" style={d(2)}>
          Ninety days. Sold or unsold, the series disappears. No reprints. No exceptions. No second chances.
        </p>
        <div className="hero-stats fade-up" style={d(3)}>
          <div className="hero-stat">
            <div className="n">48</div>
            <div className="lbl">Pieces per year</div>
          </div>
          <div className="hero-stat">
            <div className="n">8</div>
            <div className="lbl">Series per year</div>
          </div>
          <div className="hero-stat">
            <div className="n">0</div>
            <div className="lbl">Reprints. Ever.</div>
          </div>
        </div>
      </div>
      <div className="scroll-cue" aria-hidden="true" />
    </header>
  );
}

function Card({ data, onOpen }) {
  const sold = !!data.sold;
  const ed = data.edition;
  const showProgress = ed && ed.kind === "edition" && !sold;
  const pct = ed ? Math.round((ed.sold / ed.total) * 100) : 0;

  const handle = () => { if (!sold) onOpen(data); };

  return (
    <article
      className={"card" + (sold ? " is-sold" : "")}
      onClick={handle}
      role={sold ? undefined : "button"}
      tabIndex={sold ? -1 : 0}
      onKeyDown={(e) => { if (!sold && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); handle(); } }}
    >
      <div className={"card-media" + (data.img ? "" : " placeholder")}>
        {data.img
          ? <img src={data.img} alt={data.title} loading="lazy" />
          : <span className="ph-mark">{data.placeholderMark || "FF"}</span>}
        {sold && <div className="sold-veil" aria-hidden="true" />}
        {sold && <div className="stamp">Collected</div>}
        {!sold && (
          <div className="card-overlay" aria-hidden="true">
            <div className="pill">View piece</div>
          </div>
        )}
      </div>

      <div className="card-body">
        <h3 className="card-title">{data.title}</h3>
        <div className="card-inscription">"{data.inscription}"</div>

        <div className="card-foot">
          <span className={"badge " + data.badge.tone}>{data.badge.label}</span>
          <span className={"price" + (sold ? " strike" : "")}>{data.price}</span>
        </div>

        {showProgress && (
          <div className="progress" aria-label={`${ed.sold} of ${ed.total} collected`}>
            <div className="progress-bar"><i style={{ width: pct + "%" }} /></div>
            <span className="progress-text">{ed.sold}/{ed.total} collected</span>
          </div>
        )}
      </div>
    </article>
  );
}

function SeriesSection({ data, anchor, onOpen }) {
  return (
    <section className="series" id={anchor}>
      <div className="wrap">
        <div className="series-head">
          <div className="left">
            <span className="series-eyebrow">{data.eyebrow}</span>
            <h2 className="series-name">{data.name}</h2>
            <div className="series-tag">{data.tagline}</div>
          </div>
          <div className={"series-countdown" + (data.urgent ? " urgent" : "")}>
            <span className="lbl">Expires in</span>
            <span className="n">{data.days}</span>
            <span className="unit">days</span>
          </div>
        </div>

        <p className="series-desc">{data.statement}</p>

        <div className="grid">
          {data.cards.map((c) => <Card key={c.id} data={c} onOpen={onOpen} />)}
        </div>
      </div>
    </section>
  );
}

function ThreeFacts() {
  return (
    <section className="facts">
      <div className="wrap">
        <div className="facts-inner">
          <div>Two series at a time.</div>
          <div>Ninety days. Not one more.</div>
          <div>No piece is ever made again.</div>
        </div>
      </div>
    </section>
  );
}

function ArchiveBar() {
  return (
    <section className="archive" id="archive">
      <div className="wrap archive-inner">
        <div className="archive-text">6 series archived. 36 pieces gone forever.</div>
        <a className="archive-link" href="archive.html">View archive →</a>
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
            <a href="#archive">Archive</a>
            <a href="#series-1">Collect</a>
            <a href="#">Instagram</a>
          </div>
        </div>
        <div className="foot-bottom">
          <div>© 2026 Flawed Frame. All pieces registered. No reprints.</div>
          <div>International shipping. USD.</div>
        </div>
      </div>
    </footer>
  );
}

function Modal({ piece, seriesName, onClose }) {
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
  const ed = piece.edition;
  let editionLine = "";
  if (ed?.kind === "unique") {
    editionLine = "1 of 1 · unique";
  } else if (ed) {
    const remaining = ed.total - ed.sold;
    editionLine = `${ed.total} of ${ed.total} · ${remaining} ${remaining === 1 ? "copy" : "copies"} remaining`;
  }
  const pct = ed ? Math.round((ed.sold / ed.total) * 100) : 0;
  const showProgress = ed && ed.kind === "edition";

  const stop = (e) => e.stopPropagation();
  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal" onClick={stop}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className={"modal-media" + (piece.img ? "" : " placeholder")}>
          {piece.img && <img src={piece.img} alt={piece.title} />}
          <div className="modal-inscription">"{piece.inscription}"</div>
        </div>

        <div className="modal-body">
          <div className="series-line">{seriesName}</div>
          <h2 className="m-title">{piece.title}</h2>
          <div className="edition-line">{editionLine}</div>
          <p className="desc">{piece.desc}</p>

          {showProgress && (
            <div className="progress m-progress" aria-label={`${ed.sold} of ${ed.total} collected`}>
              <div className="progress-bar"><i style={{ width: pct + "%" }} /></div>
              <span className="progress-text">{ed.sold}/{ed.total} collected</span>
            </div>
          )}

          <div className="modal-divider" />

          {piece.collectorNote && (
            <div className="collector-note">{piece.collectorNote}</div>
          )}

          <div className="m-purchase">
            <div className="m-price-row">
              <span className="m-price">{piece.price}</span>
              <span className={"badge " + piece.badge.tone}>{piece.badge.label}</span>
            </div>
            <button className="m-pay">Pay with PayPal</button>
            <div className="m-secure">Secure checkout · Ships within 14 days</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [open, setOpen] = useState(null); // { piece, seriesName }

  const openPiece = useCallback((piece) => {
    // find series
    let sn = "";
    if (SERIES_I.cards.some((c) => c.id === piece.id)) sn = "Series I — " + SERIES_I.name;
    else if (SERIES_II.cards.some((c) => c.id === piece.id)) sn = "Series II — " + SERIES_II.name;
    setOpen({ piece, seriesName: sn });
  }, []);

  // Default open state: "Horizon Ramp"
  useEffect(() => {
    if (!window.__flawedDefaultOpened) {
      window.__flawedDefaultOpened = true;
      const p = SERIES_I.cards.find((c) => c.id === "s1-horizon");
      if (p) openPiece(p);
    }
  }, [openPiece]);

  return (
    <React.Fragment>
      <Nav />
      <Hero />
      <SeriesSection data={SERIES_I} anchor="series-1" onOpen={openPiece} />
      <div className="series-divider" />
      <SeriesSection data={SERIES_II} anchor="series-2" onOpen={openPiece} />
      <ThreeFacts />
      <ArchiveBar />
      <Footer />
      {open && (
        <Modal
          piece={open.piece}
          seriesName={open.seriesName}
          onClose={() => setOpen(null)}
        />
      )}
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
