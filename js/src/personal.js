import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import Link from 'flarum/common/components/Link';
import { journeySteps, resolveDestination } from './config';

const tr = (key, params) => app.translator.trans('el-choco-kobalt.forum.' + key, params);

function storageKey(name) {
  return 'kobalt:' + app.forum.attribute('baseUrl') + ':' + (app.session.user?.id() || 'guest') + ':' + name;
}

export function loadPersonal(name, fallback) {
  try {
    return JSON.parse(window.localStorage.getItem(storageKey(name))) ?? fallback;
  } catch {
    return fallback;
  }
}

export function savePersonal(name, value) {
  try {
    window.localStorage.setItem(storageKey(name), JSON.stringify(value));
    return true;
  } catch {
    app.alerts.show({ type: 'error' }, tr('personal_storage'));
    return false;
  }
}

export function pins() {
  const saved = loadPersonal('pins', []);
  return (Array.isArray(saved) ? saved : []).filter((pin) => pin && typeof pin.title === 'string' &&
    pin.title.length <= 120 && typeof pin.url === 'string' && pin.url.length <= 400 &&
    resolveDestination(pin.url, app)).slice(0, 8);
}

export function pinTopic(discussion) {
  const url = app.route.discussion(discussion);
  const entries = pins();
  const index = entries.findIndex((pin) => pin.url === url);
  if (index >= 0) entries.splice(index, 1);
  else if (entries.length < 8) entries.push({ title: discussion.title().slice(0, 120), url });
  else {
    app.alerts.show({ type: 'error' }, tr('workspace_full'));
    return;
  }
  savePersonal('pins', entries);
}

export class Workspace extends Component {
  oninit(vnode) {
    super.oninit(vnode);
    this.title = '';
    this.url = '';
    this.error = false;
  }

  view() {
    const entries = pins();
    return m('section.KobaltHome', [
      m('h2', tr('workspace')),
      m('p.helpText', tr('workspace_help')),
      entries.length ? m('ul.KobaltPins', entries.map((pin, index) => m('li', [
        Link.component({ href: resolveDestination(pin.url, app), external: new URL(pin.url, document.baseURI).origin !== location.origin }, pin.title),
        m('button.Button.Button--flat', { type: 'button', 'aria-label': tr('workspace_remove', { title: pin.title }),
          onclick: () => savePersonal('pins', entries.filter((_, i) => i !== index)) }, '×'),
      ]))) : m('p', tr('workspace_empty')),
      m('form.KobaltInlineForm', { onsubmit: (event) => {
        event.preventDefault();
        const title = this.title.trim();
        const url = resolveDestination(this.url, app);
        this.error = !title || !url || entries.length >= 8;
        if (this.error) return;
        if (!entries.some((pin) => pin.url === url) && !savePersonal('pins', [...entries, { title, url }])) return;
        this.title = this.url = '';
      } }, [
        m('input.FormControl', { value: this.title, maxlength: 120, required: true, placeholder: tr('workspace_name'),
          'aria-label': tr('workspace_name'), oninput: (event) => { this.title = event.target.value; } }),
        m('input.FormControl', { value: this.url, maxlength: 400, required: true, placeholder: tr('workspace_url'),
          'aria-label': tr('workspace_url'), oninput: (event) => { this.url = event.target.value; } }),
        m('button.Button', { type: 'submit', disabled: entries.length >= 8 }, tr('workspace_add')),
      ]),
      this.error && m('p', { role: 'alert' }, tr('workspace_invalid')),
    ]);
  }
}

export class Journey extends Component {
  view() {
    const steps = journeySteps(this.attrs.config).filter((step) => resolveDestination(step.url, app));
    if (!steps.length) return null;
    const saved = loadPersonal('journey', []);
    const completed = Array.isArray(saved) ? saved.filter((value) => typeof value === 'string').slice(0, 5) : [];
    const identity = (step) => JSON.stringify([step.title, step.url]);
    return m('section.KobaltHome', [
      m('h2', tr('journey')),
      m('ol.KobaltJourney', steps.map((step) => {
        const key = identity(step);
        return m('li', [
          m('label', [
            m('input', { type: 'checkbox', checked: completed.includes(key),
              onchange: (event) => savePersonal('journey', steps.map(identity).filter((id) =>
                id === key ? event.target.checked : completed.includes(id))) }),
            m('span.sr-only', tr('journey_done', { title: step.title })),
          ]),
          Link.component({ href: resolveDestination(step.url, app),
            external: new URL(step.url, document.baseURI).origin !== location.origin }, step.title),
        ]);
      })),
    ]);
  }
}
