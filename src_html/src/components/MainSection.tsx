import { Component } from "solid-js";

interface Props {}

export const MainSection: Component<Props> = (props: Props) => {
  return (
    <>
      <h1 id="chapter-1">
        <a class="header" href="#chapter-1">
          Chapter 1
        </a>
      </h1>
      <h2 id="mediaque-praesens-hinc-fuit-operis-ad-matris">
        <a class="header" href="#mediaque-praesens-hinc-fuit-operis-ad-matris">
          Mediaque praesens hinc fuit operis ad matris
        </a>
      </h2>
      <p>
        Lorem markdownum ducem dicet, vulnera luctatur pia accipiunt coniunx si
        <em>Ausonio</em> iubet. Non movebo annis habentem nisi: conscendit tua
        oculis ipse quantumque in illius.{" "}
        <a href="http://macies-lacertis.io/vero-et">Matris prima hoc</a>
        solus nunc partes et meas bis altus est aeterna dicta animi! Genus
        virgineas Hyacinthon veniens deus nam, ne mox septem.
      </p>
      <ul>
        <li>Veneno mors capellae aves</li>
        <li>Taurorum ibat turis licet nec</li>
        <li>Oraque et alta neque quamquam in aequora</li>
      </ul>
      <h2 id="causa-captavit-quoque-sanguine-sic">
        <a class="header" href="#causa-captavit-quoque-sanguine-sic">
          Causa captavit quoque sanguine sic
        </a>
      </h2>
      <p>
        Gemino placidum frustra sic. Per Phlegon, Tyrrhenia aversos. Ignara quis
        remota, ipse, aras tegens, <strong>in</strong> mei, tu in laniata
        constitit <a href="http://furca.org/recentes-et.aspx">est lapillo</a>.
        Nempe peremi amari anhelitus et heros nisi. Per curvae negat, ut illius,
        exhortatus seque in, armos divae, <strong>est quaerit</strong>.
      </p>
      <p>
        Fecundior si agisque pluma Romulus veste, inponere et victo ab quibus
        audita et vinaque traxisse se inde Hymenaeus tactusque.{" "}
        <em>Tulit facies</em> qui; cum hoc!
      </p>
      <pre>
        <pre class="playground">
          <code class="language-rust">
            use tokio::runtime::*; pub fn main()
          </code>
        </pre>
      </pre>
    </>
  );
};
