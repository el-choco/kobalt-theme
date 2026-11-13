import defaults from '../../settings.json';

export const id = 'el-choco-kobalt';
export const settingKey = (key) => id + '.' + key;
export { defaults };

const widths = { balanced: '1210px', wide: '1420px', narrow: '1040px' };
const radii = { soft: '19px', round: '26px', sharp: '10px' };
const heights = { compact: '82px', short: '52px', tall: '160px' };
const select = (choices, value, fallback) => Object.hasOwn(choices, value) ? choices[value] : choices[fallback];

export function readConfig(get) {
  return Object.fromEntries(Object.entries(defaults).map(([key, fallback]) => [
    key, get(key) ?? fallback,
  ]));
}

export function enabled(value) {
  return value === true || value === 1 || value === '1';
}

export function themeStyle(config) {
  const color = /^#[a-f0-9]{6}$/i.test(config.accent) ? config.accent : defaults.accent;
  const channels = color.slice(1).match(/../g).map((hex) => {
    const channel = parseInt(hex, 16) / 255;
    return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
  });
  const luminance = channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
  const shade = (limit) => {
    if (luminance <= limit) return color;
    return '#' + channels.map((channel) => {
      const level = channel * limit / luminance;
      const srgb = level <= .0031308 ? 12.92 * level : 1.055 * level ** (1 / 2.4) - .055;
      return Math.round(srgb * 255).toString(16).padStart(2, '0');
    }).join('');
  };
  const compact = config.density === 'compact';

  return {
    '--kobalt-brand': color,
    '--kobalt-on-brand': luminance > .179 ? '#000' : '#fff',
    '--kobalt-brand-mix': luminance > .179 ? '#fff' : '#000',
    '--kobalt-accent-light': shade(.16),
    '--kobalt-stage-end': shade(.12),
    '--kobalt-frame': select(widths, config.width, 'balanced'),
    '--kobalt-radius': select(radii, config.radius, 'soft'),
    '--kobalt-shoutbox-height': select(heights, config.shoutbox, 'compact'),
    '--kobalt-card-gap': compact ? '9px' : '14px',
    '--kobalt-card-pad': compact ? '13px' : '20px',
  };
}

export function pattern(config) {
  return ['orbit', 'grid', 'plain'].includes(config.pattern) ? config.pattern : defaults.pattern;
}

export function glass(config) {
  return enabled(config.glass) ? 'on' : 'off';
}

export const projectSlots = [1, 2, 3];
export const projectFields = ['title', 'version', 'depot', 'download', 'docs', 'support', 'repo'];

export function projectCards(config) {
  return projectSlots.map((slot) => ({ slot, ...Object.fromEntries(projectFields.map((field) => [
    field, String(config['project' + slot + '_' + field] ?? '').trim(),
  ])) })).filter((project) => project.title);
}

export const categoryFields = ['tag', 'mode', 'project', 'notice', 'label', 'url'];
export const stepSlots = [1, 2, 3, 4, 5];

export function categoryRules(config) {
  return projectSlots.map((slot) => Object.fromEntries(categoryFields.map((field) => [
    field, String(config['category' + slot + '_' + field] ?? '').trim(),
  ]))).filter((rule) => rule.tag);
}

export function journeySteps(config) {
  return stepSlots.map((slot) => ({ title: String(config['step' + slot + '_title'] ?? '').trim(),
    url: String(config['step' + slot + '_url'] ?? '').trim() })).filter((step) => step.title && step.url);
}

export function discussionId(value) {
  let input = String(value ?? '').trim();
  if (/^https?:\/\//i.test(input)) {
    try {
      const url = new URL(input);
      if (url.origin !== location.origin || url.username || url.password) return null;
      input = url.pathname;
    } catch {
      return null;
    }
  }

  const path = input.match(/^\/(?:[^/?#]+\/)*d\/([^/?#]+)(?:\/\d+)?\/?(?:[?#].*)?$/);
  if (path) input = path[1];
  return input.match(/^([1-9]\d{0,9})(?:-[^\s/?#\\]+)?$/)?.[1] ?? null;
}

export function resolveDestination(value, app) {
  const raw = String(value ?? '').trim();
  if (!raw || /[\\\u0000-\u0020]/u.test(raw) || raw.startsWith('//')) return null;

  if (raw.startsWith('@')) {
    const route = raw.slice(1);
    if (!Object.hasOwn(app.routes, route) || /:[\w]+/.test(app.routes[route].path)) return null;
    return app.route(route);
  }

  try {
    const base = new URL(app.forum.attribute('baseUrl').replace(/\/$/, '') + '/');
    const url = new URL(raw, base);
    if (url.username || url.password || !['http:', 'https:'].includes(url.protocol)) return null;
    if (url.origin === base.origin) return url.pathname + url.search + url.hash;
    return url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}
