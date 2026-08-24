export default function PhonePreview({ html, height = 720, float = false, title = "preview", interactive = false }) {
  return (
    <div className={"phone" + (float ? " phone-float" : "")}>
      <div className="phone-screen" style={{ height }}>
        <iframe
          srcDoc={html}
          title={title}
          scrolling={interactive ? "yes" : "no"}
          loading="lazy"
          sandbox="allow-same-origin"
          style={{ height, pointerEvents: interactive ? "auto" : "none" }}
        />
      </div>
    </div>
  );
}
