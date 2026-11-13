export const icons = ['fas fa-layer-group', 'fas fa-box-open', 'fas fa-compass'];

export function dockView(entries, label, link) {
  return m('nav.KobaltDock', { 'aria-label': label }, [
    m('span.KobaltDock-orbit', { 'aria-hidden': 'true' }, m('i.fas.fa-satellite')),
    ...entries.map((entry) => link(entry, [
      m('i', { className: entry.icon, 'aria-hidden': 'true' }),
      m('span', entry.label),
    ])),
  ]);
}

export function focusView(copy, action) {
  return m('aside.KobaltFocus', [
    m('.KobaltFocus-orbit', { 'aria-hidden': 'true' }, m('i.fas.fa-star')),
    m('.KobaltFocus-copy', [
      m('.KobaltFocus-label', copy.label),
      m('strong.KobaltFocus-title', copy.title),
      copy.text ? m('p.KobaltFocus-text', copy.text) : null,
      action,
    ]),
  ]);
}

export function featuredView({ label, title, text, image }, action) {
  return m('aside.KobaltFeatured', [
    image ? m('img.KobaltFeatured-image', { src: image, alt: '', loading: 'lazy', referrerpolicy: 'no-referrer' }) :
      m('.KobaltFeatured-icon', { 'aria-hidden': 'true' }, m('i.fas.fa-thumbtack')),
    m('.KobaltFeatured-copy', [
      m('.KobaltFeatured-label', label),
      m('h2', title),
      text ? m('p', text) : null,
      action,
    ]),
  ]);
}

export function projectsView(projects, tr, link, heading) {
  if (!projects.length) return null;
  return m('section.KobaltHome.KobaltProjects', [
    m('h2', heading || tr('projects')),
    m('.KobaltHome-grid', projects.map((project) => m('article.KobaltHome-card', [
      m('h3', project.title),
      (project.depotVersion || project.version) && m('.KobaltProjects-version', project.depotVersion || project.version),
      m('.KobaltHome-links', ['download', 'docs', 'support', 'repo'].map((field) => link(project, field))),
    ]))),
  ]);
}
