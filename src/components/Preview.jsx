import { resolveTemplate } from '../core/templates';

function extractBody(markdown) {
  return markdown
    .split('\n')
    .filter((line) => !/^[-*]\s+/.test(line))
    .slice(0, 3)
    .join(' ');
}

function extractBullets(markdown) {
  return markdown
    .split('\n')
    .filter((line) => /^[-*]\s+/.test(line))
    .map((line) => line.replace(/^[-*]\s+/, ''))
    .slice(0, 5);
}

export function Preview({ slides, templateName, brandName, showAvatar, avatarUrl, previewRefs }) {
  return (
    <section className="space-y-4">
      {slides.map((slide, idx) => {
        const template = resolveTemplate(templateName, slide.layout);
        const bullets = extractBullets(slide.markdown);
        const body = extractBody(slide.markdown);

        return (
          <article
            key={slide.id}
            ref={(el) => { previewRefs.current[idx] = el; }}
            className={`relative mx-auto flex h-[420px] max-w-[340px] flex-col overflow-hidden rounded-2xl border p-5 md:max-w-[420px] ${template.token.card} ${template.layoutClass} ${template.token.decor}`}
            style={{ fontFamily: template.token.font }}
          >
            <div className="relative z-10 flex h-full flex-col">
              {showAvatar && avatarUrl && <img src={avatarUrl} alt="avatar" className="mb-2 h-10 w-10 rounded-full object-cover" />}
              <h4 className={`mb-2 text-xl ${template.token.headline} ${template.token.accent}`}>{slide.title}</h4>

              <div className="text-sm leading-relaxed">
                {bullets.length > 0 ? (
                  <ul className="space-y-1">
                    {bullets.map((bullet, i) => <li key={i}>• {bullet}</li>)}
                  </ul>
                ) : (
                  <p>{body}</p>
                )}
              </div>

              <div className="mt-auto pt-3 text-xs opacity-90">
                <span className={template.token.footer}>{brandName}</span>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
