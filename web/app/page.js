import Link from "next/link";
import { screens } from "@/lib/screens";
import PhonePreview from "@/components/PhonePreview";

const S = Object.fromEntries(screens.map((s) => [s.id, s.html]));

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      {/* NAV */}
      <nav className="nav">
        <div className="wrap nav-inner">
          <div className="wm">PRIME</div>
          <Link href="/app" className="btn-gold" aria-label="アプリを試す">
            アプリを試す
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <header className="hero">
        <div className="wrap hero-grid">
          <div>
            <div className="eyebrow">40歳からの代謝設計</div>
            <h1 className="h1">
              40代からは
              <br />
              <span style={{ color: "var(--faint)" }}>「同じ努力」</span>では
              <br />
              もう<span className="grad-gold">守れない。</span>
            </h1>
            <p className="lead">
              加齢で変わる身体の防衛本能 — アナボリック抵抗性、睡眠不足時の筋肉分解、脳の省エネモード。
              PRIME はそれらを<strong style={{ color: "var(--tx)" }}>システム側でコントロール</strong>し、
              根性ではなく設計で体脂肪を落とす伴走型コーチングアプリです。
            </p>
            <div className="cta-row">
              <Link href="/app" className="btn-gold">
                無料で体質診断を始める
              </Link>
              <a href="#method" className="btn-ghost">
                メソッドを見る
              </a>
            </div>
            <div className="mini-note">所要2分 ・ クレジットカード不要</div>
          </div>
          <div className="f-phone-wrap">
            <PhonePreview html={S.concept} height={720} float title="コンセプト画面" />
          </div>
        </div>
      </header>

      {/* PROBLEM */}
      <section className="section">
        <div className="wrap">
          <div className="section-tag">なぜ落ちないのか</div>
          <h2 className="h2">
            40代以降、筋トレしても
            <br />
            体脂肪が落ちない残酷な理由
          </h2>
          <p className="sub">
            消費カロリーの主役は筋トレそのものではありません。加齢とともに現れる3つの身体変化が、
            あなたの努力を静かに相殺しています。PRIME はここに一つずつ介入します。
          </p>

          <div className="reasons">
            <div className="card">
              <div className="ic" style={{ background: "rgba(210,106,96,.14)", color: "var(--red)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11" />
                </svg>
              </div>
              <h3>アナボリック抵抗性</h3>
              <p>
                筋肉が刺激に反応しにくくなる状態。「昔と同じメニュー」では筋肉を守れず、基礎代謝が落ちていきます。
              </p>
            </div>
            <div className="card">
              <div className="ic" style={{ background: "rgba(219,150,90,.14)", color: "var(--amber)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <h3>睡眠不足 → 筋肉の分解</h3>
              <p>
                睡眠が足りない日のダイエットは、脂肪ではなく<strong style={{ color: "var(--tx)" }}>筋肉から</strong>削られます。減量そのものが逆効果に。
              </p>
            </div>
            <div className="card">
              <div className="ic" style={{ background: "rgba(203,163,90,.14)", color: "var(--gold)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.4 1 2.5h6c0-1.1.3-1.8 1-2.5A6 6 0 0 0 12 3z" />
                </svg>
              </div>
              <h3>脳の省エネモード</h3>
              <p>
                運動した日ほど、脳が無意識に家事や歩行を減らして消費カロリーを相殺します。頑張るほど動かなくなる罠。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* METHODS */}
      <section id="method" className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-tag">メソッド</div>
          <h2 className="h2">身体の仕組みを、システムで制御する</h2>

          {/* 1 sleep */}
          <div className="feature">
            <div className="f-copy">
              <span className="badge">① 睡眠連動 筋肉保護アルゴリズム</span>
              <div className="f-h">睡眠不足の日は、システムが筋肉を守る</div>
              <p className="f-p">
                スマートウォッチの睡眠データと連携。6時間未満が続くと、目標減量ペースを自動で
                「週0.5%」の筋肉保護モードへ切り替え、その日の優先種目も筋トレへ再構築します。
              </p>
              <ul className="f-list">
                <li><Check />ヘルスケア連携で睡眠を自動取得しアラート</li>
                <li><Check />減量ペースを週0.5%へ自動調整</li>
                <li><Check />睡眠不足時は有酸素より筋トレを優先</li>
              </ul>
            </div>
            <div className="f-phone-wrap">
              <PhonePreview html={S.sleep} height={680} title="睡眠保護" />
            </div>
          </div>

          {/* 2 concurrent */}
          <div className="feature rev">
            <div className="f-phone-wrap">
              <PhonePreview html={S.session} height={680} title="強制順序ナビ" />
            </div>
            <div className="f-copy">
              <span className="badge">② コンカレント順序ナビ</span>
              <div className="f-h">「筋トレ → 有酸素」の黄金順序を強制する</div>
              <p className="f-p">
                脂肪燃焼に有利な順序を、UI そのもので担保。筋トレの全種目を完了しないと、有酸素運動の
                タイマーが起動しません。迷いを消し、正しい順番だけを残します。
              </p>
              <ul className="f-list">
                <li><Check />筋トレ完了まで有酸素をロック</li>
                <li><Check />有酸素枠にテニスや週末のスポーツも合算</li>
                <li><Check />種目ごとの完了チェックで進捗を可視化</li>
              </ul>
            </div>
          </div>

          {/* 3 NEAT */}
          <div className="feature">
            <div className="f-copy">
              <span className="badge">③ 脳のサボり打破トラッカー</span>
              <div className="f-h">筋トレ日ほど、歩数を厳しく監視する</div>
              <p className="f-p">
                運動した日に落ちる無意識の活動量（NEAT）を数値で監視。筋トレ日は基準を引き上げ、
                夕方に歩数が不足していればプッシュ通知で行動を促し、省エネモードを相殺します。
              </p>
              <ul className="f-list">
                <li><Check />筋トレ日は歩数目標を自動で厳格化</li>
                <li><Check />時間帯別の活動量ダウンを検知</li>
                <li><Check />「あと◯歩」を具体的にプッシュ通知</li>
              </ul>
            </div>
            <div className="f-phone-wrap">
              <PhonePreview html={S.neat} height={680} title="NEATトラッカー" />
            </div>
          </div>

          {/* 4 RIR */}
          <div className="feature rev">
            <div className="f-phone-wrap">
              <PhonePreview html={S.rir} height={680} title="RIR安全カウンター" />
            </div>
            <div className="f-copy">
              <span className="badge">④ アナボリック抵抗性・安全カウンター</span>
              <div className="f-h">「あと何回できた？」から最適重量を学習</div>
              <p className="f-p">
                重量と回数に加え、余力（RIR）をスライダーで記録。適正ゾーン1〜2回に収まる重量をアプリが学習し、
                次回の推奨重量を提示。鈍った筋肉を、怪我なく効かせます。
              </p>
              <ul className="f-list">
                <li><Check />RIR スライダーで追い込み過ぎを防止</li>
                <li><Check />履歴から次回推奨重量を自動提示</li>
                <li><Check />部位ごとに週10〜20セットのボリューム管理</li>
              </ul>
            </div>
          </div>

          {/* 5 sports + fatigue */}
          <div className="feature">
            <div className="f-copy">
              <span className="badge">⑤ スポーツ連動 & 部位別疲労管理</span>
              <div className="f-h">テニス・ゴルフ・バレーも、設計の一部にする</div>
              <p className="f-p">
                週末のテニスの試合やゴルフのラウンドも有酸素として合算。さらに、片手バックハンドで
                肩・体幹を酷使した記録を検知すると、翌日の筋トレを安全なマシン種目へ自動で組み替え、
                オーバートレーニングを防ぎます。
              </p>
              <ul className="f-list">
                <li><Check />テニス / ゴルフ / バレー等を有酸素枠に合算</li>
                <li><Check />酷使部位を検知し翌日メニューを自動調整</li>
                <li><Check />フリーウェイト → マシンへ安全に置換</li>
              </ul>
            </div>
            <div className="f-phone-wrap">
              <PhonePreview html={S.sports} height={680} title="スポーツ連動" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="wrap">
        <div className="cta">
          <div className="section-tag" style={{ color: "var(--gold)" }}>体質診断は2分</div>
          <h2 className="h2">あなたが痩せない主因を、可視化する</h2>
          <p className="sub" style={{ margin: "16px auto 30px" }}>
            睡眠・活動量・栄養・ストレスから「落ちない要因」をスコア化し、あなた専用の4週間プランを設計します。
          </p>
          <Link href="/app" className="btn-gold" style={{ fontSize: 15, padding: "15px 28px" }}>
            アプリのプロトタイプを試す
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="wrap" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div className="wm" style={{ fontSize: 14 }}>PRIME</div>
            <div style={{ marginTop: 10 }}>40歳からの代謝設計コーチング（コンセプト・プロトタイプ）</div>
          </div>
          <div style={{ textAlign: "right" }}>
            画面内の数値はすべてサンプルです。<br />
            医療行為ではありません。健康上の判断は専門家にご相談ください。
          </div>
        </div>
      </footer>
    </>
  );
}
