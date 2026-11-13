import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import Link from 'flarum/common/components/Link';
import { extend } from 'flarum/common/extend';
import DiscussionPage from 'flarum/forum/components/DiscussionPage';
import { categoryRules, discussionId, enabled, projectCards, resolveDestination } from './config';
import { Projects } from './homeExtras';
import { bestAnswerLink } from './feedExtras';
import { loadPersonal, pins, pinTopic, savePersonal } from './personal';

const tr = (key, params) => app.translator.trans('el-choco-kobalt.forum.' + key, params);
const sizes = ['15px', '17px', '19px'];
const spacing = ['1.6', '1.8', '2'];

export function ruleFor(config, tags) {
  const slugs = (Array.isArray(tags) ? tags : []).filter(Boolean).map((tag) => tag.slug?.());
  return categoryRules(config).find((rule) => slugs.includes(rule.tag));
}

export function notice(config, rule) {
  if (!enabled(config.category_notices) || !rule?.notice) return null;
  const href = resolveDestination(rule.url, app);
  return m('aside.KobaltNotice', [
    m('p', rule.notice),
    href && Link.component({ href, external: new URL(href, document.baseURI).origin !== location.origin },
      rule.label || tr('notice_open')),
  ]);
}

class ReadingTools extends Component {
  oninit(vnode) {
    super.oninit(vnode);
    const saved = loadPersonal('reading', {});
    this.size = [0, 1, 2].includes(saved.size) ? saved.size : 0;
    this.spacing = [0, 1, 2].includes(saved.spacing) ? saved.spacing : 0;
    this.active = false;
  }

  apply() {
    const root = this.element.closest('.DiscussionPage');
    if (!root) return;
    root.dataset.kobaltReading = this.active ? 'on' : 'off';
    root.style.setProperty('--kobalt-reading-size', sizes[this.size]);
    root.style.setProperty('--kobalt-reading-spacing', spacing[this.spacing]);
  }

  oncreate(vnode) {
    super.oncreate(vnode);
    this.apply();
  }

  onupdate(vnode) {
    super.onupdate(vnode);
    this.apply();
  }

  onremove(vnode) {
    const root = this.element.closest('.DiscussionPage');
    if (root) {
      delete root.dataset.kobaltReading;
      root.style.removeProperty('--kobalt-reading-size');
      root.style.removeProperty('--kobalt-reading-spacing');
    }
    super.onremove(vnode);
  }

  view() {
    return m('.KobaltReading', [
      m('button.Button', { type: 'button', 'aria-pressed': String(this.active),
        onclick: () => { this.active = !this.active; } }, tr(this.active ? 'reading_exit' : 'reading')),
      this.active && [
        m('label', [tr('reading_size'), m('select.FormControl', { value: this.size, onchange: (event) => {
          this.size = Number(event.target.value);
          savePersonal('reading', { size: this.size, spacing: this.spacing });
        } }, sizes.map((value, i) => m('option', { value: i }, value)))]),
        m('label', [tr('reading_spacing'), m('select.FormControl', { value: this.spacing, onchange: (event) => {
          this.spacing = Number(event.target.value);
          savePersonal('reading', { size: this.size, spacing: this.spacing });
        } }, spacing.map((value, i) => m('option', { value: i }, value)))]),
      ],
    ]);
  }
}

class Outline extends Component {
  oninit(vnode) {
    super.oninit(vnode);
    this.headings = [];
  }

  oncreate(vnode) {
    super.oncreate(vnode);
    const root = this.element.closest('.DiscussionPage');
    const stream = root?.querySelector('.DiscussionPage-stream');
    if (!stream) return;
    const update = () => {
      const body = stream.querySelector('.PostStream-item[data-number="1"] .CommentPost:not(.Post--hidden) .Post-body');
      const headings = body ? [...body.querySelectorAll('h2,h3')].filter((node) => node.textContent.trim()).slice(0, 30) : [];
      if (headings.length === this.headings.length && headings.every((node, i) =>
        node === this.headings[i].node && node.textContent.trim() === this.headings[i].title)) return;
      this.headings = headings.map((node) => ({ node, title: node.textContent.trim().slice(0, 160) }));
      m.redraw();
    };
    this.observer = new MutationObserver(update);
    this.observer.observe(stream, { childList: true, characterData: true, subtree: true });
    update();
  }

  onremove(vnode) {
    this.observer?.disconnect();
    super.onremove(vnode);
  }

  view() {
    return m('nav.KobaltOutline', { 'aria-label': tr('outline') }, [
      m('strong', tr('outline')),
      this.headings.length ? m('ol', this.headings.map(({ node, title }) => m('li',
        m('button.Button.Button--flat', { type: 'button', onclick: () => node.scrollIntoView({ block: 'center', behavior: 'smooth' }) }, title)))) :
        Link.component({ href: app.route.discussion(this.attrs.discussion, 1) }, tr('outline_first')),
    ]);
  }
}

class TopicExtras extends Component {
  view() {
    const { config, discussion } = this.attrs;
    const rule = ruleFor(config, discussion.tags?.());
    const mode = enabled(config.content_modes) ? rule?.mode : 'standard';
    const projects = projectCards(config);
    const direct = projects.find((project) => discussionId(project.support) === discussion.id());
    const project = direct || (mode === 'software' && projects.find((candidate) => String(candidate.slot) === rule?.project));
    const solution = mode === 'support' && bestAnswerLink(discussion);

    return m('.KobaltTopicExtras', [
      notice(config, rule),
      m('.KobaltTopicTools', [
        enabled(config.workspace) && app.session.user && m('button.Button', {
          type: 'button', onclick: () => pinTopic(discussion),
          'aria-pressed': String(pins().some((pin) => pin.url === app.route.discussion(discussion))),
        }, tr('workspace_pin')),
        enabled(config.reader) && m(ReadingTools),
      ]),
      enabled(config.toolbox) && project && m(Projects, {
        config, projects: [project], heading: tr('toolbox'),
      }),
      mode === 'support' && typeof discussion.hasBestAnswer === 'function' && m('aside.KobaltNotice', [
        m('strong', tr(discussion.hasBestAnswer?.() ? 'support_solved' : 'support_open')),
        solution,
      ]),
      mode === 'guide' && m(Outline, { discussion }),
    ]);
  }
}

export function installTopicExtras(config) {
  extend('flarum/forum/components/IndexPage', 'contentItems', (items) => {
    if (!items.has('discussionList')) return;
    const tag = app.currentTag?.();
    const content = notice(config(), ruleFor(config(), tag ? [tag] : []));
    if (content) items.add('kobaltCategoryNotice', content, 111);
  });

  extend('flarum/forum/components/PageStructure', 'containerItems', function (items) {
    if (!this.attrs.className?.split(/\s+/).includes('DiscussionPage') ||
      !app.current.matches(DiscussionPage) || !items.has('content')) return;
    const discussion = app.current.get('discussion');
    if (!discussion) return;
    const content = items.get('content');
    if (!content || !['workspace', 'reader', 'toolbox', 'category_notices', 'content_modes'].some((key) => enabled(config()[key]))) return;
    items.setContent('content', { ...content, children: [
      m(TopicExtras, { key: discussion.id(), config: config(), discussion }),
      m.fragment({ key: 'native-content' }, content.children),
    ] });
  });
}
