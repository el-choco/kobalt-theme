import { enabled, resolveDestination } from './config';

export const footerSlots = [1, 2, 3, 4];
export const footerLinks = [1, 2, 3, 4, 5, 6];

export function footerIcon(value) {
  const icon = String(value || '').trim();
  return /^(?:fas|far|fab|fa-solid|fa-regular|fa-brands) fa-[a-z0-9-]+$/.test(icon) ? icon : '';
}

export function footerCopy(value, title) {
  return String(value || '').replace(/\{year\}/g, String(new Date().getFullYear())).replace(/\{forum\}/g, () => title);
}

export function footerVisible(config, app, IndexPage, DiscussionPage) {
  if (!enabled(config.footer)) return false;
  if (config.footer_mode === 'index') return app.current.matches(IndexPage, { routeName: 'index' });
  if (config.footer_mode === 'except_discussion') return !app.current.matches(DiscussionPage);
  return config.footer_mode === 'all';
}

export function footerData(config, app) {
  const readLink = (prefix) => {
    const label = String(config[prefix + '_label'] || '').trim();
    const href = resolveDestination(config[prefix + '_url'], app);
    return label && href ? { label, href } : null;
  };
  return {
    blocks: footerSlots.filter((slot) => enabled(config['footer_block' + slot + '_enabled'])).map((slot) => {
      const prefix = 'footer_block' + slot;
      return {
        title: String(config[prefix + '_title'] || '').trim(),
        icon: footerIcon(config[prefix + '_icon']),
        links: footerLinks.map((link) => readLink(prefix + '_link' + link)).filter(Boolean),
      };
    }).filter((block) => block.links.length),
    social: footerSlots.map((slot) => {
      const prefix = 'footer_social' + slot;
      const link = readLink(prefix);
      return link && { ...link, icon: footerIcon(config[prefix + '_icon']) };
    }).filter(Boolean),
  };
}

export function footerView(config, data, tr, link, options = {}) {
  const title = String(config.footer_title || '').trim() || options.forumTitle || 'Kobalt';
  const style = config.footer_style === 'brand' ? 'brand' : 'soft';
  const gap = ['0', '56', '72', '96'].includes(String(config.footer_gap)) ? config.footer_gap : '0';
  const copyright = footerCopy(config.footer_copyright, options.forumTitle || title);
  const info = enabled(config.footer_info);
  return m('section.KobaltFooter', {
    'aria-label': tr('footer'), 'data-style': style, 'data-mobile': enabled(config.footer_mobile) ? 'on' : 'off',
    style: { '--kobalt-footer-gap': gap + 'px' },
  }, [
    m('.KobaltFooter-inner', [
      (info || data.blocks.length > 0) && m('.KobaltFooter-grid', [
        info && m('.KobaltFooter-info', [
          enabled(config.footer_logo) && options.logo && m('img.KobaltFooter-logo', { src: options.logo, alt: '', loading: 'lazy', referrerpolicy: 'no-referrer' }),
          m('h2', title),
          config.footer_text && m('p', String(config.footer_text)),
          data.social.length > 0 && m('nav.KobaltFooter-social', { 'aria-label': tr('footer_social') },
            data.social.map((item) => link(item, [item.icon && m('i', { className: item.icon, 'aria-hidden': 'true' }), m('span', item.label)]))),
        ]),
        ...data.blocks.map((block) => m('nav.KobaltFooter-block', { 'aria-label': block.title || tr('footer_links') }, [
          block.title && m('h3', [block.icon && m('i', { className: block.icon, 'aria-hidden': 'true' }), block.title]),
          m('ul', block.links.map((item) => m('li', link(item, item.label)))),
        ])),
      ]),
      (copyright || enabled(config.footer_top)) && m('.KobaltFooter-bottom', [
        m('span', copyright),
        enabled(config.footer_top) && m('button.Button.Button--flat', { type: 'button', onclick: options.toTop, disabled: !!options.preview }, [
          tr('footer_top'), m('i.fas.fa-arrow-up', { 'aria-hidden': 'true' }),
        ]),
      ]),
    ]),
  ]);
}
