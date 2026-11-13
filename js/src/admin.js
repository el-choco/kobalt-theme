import app from 'flarum/admin/app';
import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import Admin from 'flarum/common/extenders/Admin';
import { categoryFields, defaults, discussionId, enabled, glass, id, journeySteps, pattern, projectCards, projectFields, projectSlots, readConfig, resolveDestination, settingKey, stepSlots, themeStyle } from './config';
import { footerData, footerLinks, footerSlots, footerView } from './footerView';
import { dockView, featuredView, focusView, icons, projectsView } from './studioView';

const tr = (key) => app.translator.trans(id + '.admin.' + key);
const previewText = (key) => tr('preview_text.' + key);
const fields = {
  orbit: [
    ['dock', 'bool'], ['link1_label'], ['link1_url'], ['link2_label'], ['link2_url'], ['link3_label'], ['link3_url'],
  ],
  stage: [
    ['hero', 'bool'], ['hero_title'], ['hero_subtitle'], ['pattern', 'select', ['orbit', 'grid', 'plain']],
    ['focus', 'bool'], ['focus_label'], ['focus_title'], ['focus_text'], ['focus_action'], ['focus_url'],
    ['glass', 'bool'],
  ],
  featured: [
    ['featured', 'bool'], ['featured_source', 'select', ['manual', 'discussion']],
    ['featured_discussion'], ['featured_title'], ['featured_text'], ['featured_image'], ['featured_url'],
  ],
  projects: [['projects', 'bool']],
  community: [['visit_updates', 'bool'], ['support_filters', 'bool'], ['following_feed', 'bool']],
  experience: [['workspace', 'bool'], ['onboarding', 'bool'], ['reader', 'bool'], ['toolbox', 'bool'],
    ['category_notices', 'bool'], ['content_modes', 'bool']],
  journey: [],
  categories: [],
  footer: [],
  layout: [
    ['accent', 'color'], ['width', 'select', ['balanced', 'wide', 'narrow']], ['radius', 'select', ['soft', 'round', 'sharp']],
    ['density', 'select', ['comfortable', 'compact']], ['composer', 'bool'], ['widgets', 'bool'],
    ['shoutbox', 'select', ['compact', 'short', 'tall']],
    ['feed_actions', 'bool'], ['tag_accents', 'bool'],
  ],
};

class KobaltStudio extends ExtensionPage {
  group = 'orbit';
  project = 1;
  step = 1;
  category = 1;
  footerTab = 'general';
  block = 1;
  social = 1;

  controls(config) {
    let current = fields[this.group];
    if (this.group === 'footer') current = this.footerFields();
    if (this.group === 'projects') current = [...fields.projects, ...projectFields.map((field) => ['project' + this.project + '_' + field])];
    if (this.group === 'journey') current = ['title', 'url'].map((field) => ['step' + this.step + '_' + field]);
    if (this.group === 'categories') current = categoryFields.map((field) => {
      const key = 'category' + this.category + '_' + field;
      if (field === 'mode') return [key, 'select', ['standard', 'support', 'guide', 'software']];
      if (field === 'project') return [key, 'select', ['1', '2', '3']];
      return [key];
    });
    const controls = current.filter(([key]) => {
      if (key === 'featured_discussion') return config.featured_source === 'discussion';
      if (key === 'featured_url') return config.featured_source !== 'discussion';
      return true;
    }).map(([key, type = 'text', options]) => {
      if (key === 'footer_text') {
        const value = this.setting(settingKey(key), defaults[key]);
        return m('.Form-group', [
          m('label', { for: 'kobalt-footer-description' }, tr('fields.footer_text')),
          m('textarea.FormControl', { id: 'kobalt-footer-description', rows: 4, maxlength: 1000,
            value: value(), oninput: (event) => value(event.target.value) }),
        ]);
      }
      return this.buildSettingComponent({
        setting: settingKey(key),
        default: defaults[key],
        type,
        label: tr('fields.' + key.replace(/^(project|step|category)\d+_/, '$1_').replace(/footer_block\d+_link\d+_/, 'footer_link_').replace(/footer_(block|social)\d+_/, 'footer_$1_')) + (key.match(/_link(\d+)_/) ? ' (' + key.match(/_link(\d+)_/)[1] + ')' : ''),
        options: options && Object.fromEntries(options.map((value) => [value, tr('choices.' + value)])),
        extra: type === 'text' ? { maxlength: /_(url|image|download|docs|support|repo)$/.test(key) ? 400 : 180 } : undefined,
      });
    });
    if (this.group === 'featured' && config.featured_source === 'discussion' &&
      String(config.featured_discussion).trim() && !discussionId(config.featured_discussion)) {
      controls.push(m('p.helpText', { role: 'status' }, tr('invalid_discussion')));
    }
    return controls;
  }

  footerFields() {
    if (this.footerTab === 'blocks') {
      const prefix = 'footer_block' + this.block;
      return [[prefix + '_enabled', 'bool'], [prefix + '_title'], [prefix + '_icon'],
        ...footerLinks.flatMap((slot) => [[prefix + '_link' + slot + '_label'], [prefix + '_link' + slot + '_url']])];
    }
    if (this.footerTab === 'social') {
      return ['label', 'icon', 'url'].map((key) => ['footer_social' + this.social + '_' + key]);
    }
    return [['footer', 'bool'], ['footer_mode', 'select', ['all', 'index', 'except_discussion']],
      ['footer_style', 'select', ['soft', 'brand']], ['footer_mobile', 'bool'],
      ['footer_gap', 'select', ['0', '56', '72', '96']], ['footer_info', 'bool'], ['footer_logo', 'bool'],
      ['footer_title'], ['footer_text'], ['footer_copyright'], ['footer_top', 'bool']];
  }

  footerPicker() {
    return m('div.KobaltStudio-footerPicker', [
      m('div.KobaltStudio-projectPicker', ['general', 'blocks', 'social'].map((tab) => m('button.Button', {
        type: 'button', 'aria-pressed': String(this.footerTab === tab), onclick: () => { this.footerTab = tab; },
      }, tr('footer_' + tab)))),
      this.footerTab === 'blocks' && this.slotPicker(footerSlots, 'block'),
      this.footerTab === 'social' && this.slotPicker(footerSlots, 'social'),
    ]);
  }

  projectPicker() {
    return m('div.KobaltStudio-projectPicker', projectSlots.map((slot) => m('button.Button', {
      type: 'button',
      'aria-pressed': String(this.project === slot),
      onclick: () => { this.project = slot; },
    }, app.translator.trans(id + '.admin.project_slot', { slot }))));
  }

  slotPicker(slots, key) {
    return m('div.KobaltStudio-projectPicker', slots.map((slot) => m('button.Button', {
      type: 'button', 'aria-pressed': String(this[key] === slot), onclick: () => { this[key] = slot; },
    }, app.translator.trans(id + '.admin.' + key + '_slot', { slot }))));
  }

  preview(config) {
    const links = icons.flatMap((icon, i) => {
      const key = 'link' + (i + 1);
      return config[key + '_url']?.trim() ? [{ icon, label: config[key + '_label'] || previewText(key) }] : [];
    });
    const dock = enabled(config.dock) && links.length ? dockView(links, previewText('dock'), (entry, children) => m('span.KobaltDock-link', children)) : null;
    const focus = enabled(config.focus) && (config.focus_url || config.focus_title) ? focusView({
      label: config.focus_label || previewText('focus_label'),
      title: config.focus_title || previewText('focus_title'),
      text: config.focus_text,
    }, config.focus_url ? m('span.KobaltFocus-action', config.focus_action || previewText('focus_action')) : null) : null;
    const topic = config.featured_source === 'discussion';
    const featured = enabled(config.featured) && (topic ? discussionId(config.featured_discussion) : config.featured_title.trim()) ?
      featuredView({
        label: previewText('featured'),
        title: config.featured_title.trim() || tr('featured_example'),
        text: config.featured_text,
        image: resolveDestination(config.featured_image, app),
      }, (topic || config.featured_url.trim()) && m('span.KobaltFeatured-link', previewText('featured_open'))) : null;

    return m('.KobaltStudio-preview', {
      style: themeStyle(config),
      'data-kobalt-pattern': pattern(config),
      'data-kobalt-glass': glass(config),
      'data-width': config.width,
    }, [
      m('.KobaltStudio-previewHeader', [m('strong', 'Kobalt'), dock]),
      enabled(config.hero) ? m('.KobaltStudio-stage.KobaltBackdrop', [
        m('.KobaltStudio-stageCopy', [
          m('small', tr('preview')),
          m('h3', config.hero_title || app.data.settings.forum_title || 'Kobalt'),
          m('p', config.hero_subtitle || app.data.settings.forum_description || tr('subtitle')),
        ]),
        focus,
      ]) : null,
      m('.KobaltStudio-previewFeed', [
        enabled(config.widgets) ? m('.KobaltStudio-previewWidgets', ['forum_widget', 'members_widget', 'online_widget'].map((key) => m('span', tr(key)))) : null,
        featured,
        enabled(config.projects) && projectsView(projectCards(config), previewText, (project, field) => {
          const hasLink = project[field] || (field === 'download' && project.depot);
          return hasLink && m('span', previewText('project_' + field));
        }),
        enabled(config.workspace) && m('section.KobaltHome', [m('h3', previewText('workspace')), m('p', previewText('workspace_help'))]),
        enabled(config.onboarding) && journeySteps(config).length > 0 && m('section.KobaltHome', [
          m('h3', previewText('journey')), m('ol', journeySteps(config).map((step) => m('li', step.title))),
        ]),
        this.group === 'categories' && enabled(config.category_notices) && config['category' + this.category + '_notice'] &&
          m('aside.KobaltNotice', config['category' + this.category + '_notice']),
        this.group === 'experience' && m('p.helpText', tr('experience_preview')),
        enabled(config.visit_updates) && m('.KobaltHome.KobaltVisit', [
          m('h3', previewText('visit_title')),
          m('.KobaltHome-links', ['discussions', 'replies', 'downloads'].map((key) => m('span', previewText('visit_' + key)))),
        ]),
        this.group === 'community' && enabled(config.following_feed) && m('span', previewText('following')),
        this.group === 'community' && enabled(config.support_filters) && m('.KobaltSupport',
          ['all', 'open', 'solved'].map((key) => m('span.Button', previewText('support_' + key)))),
        enabled(config.composer) ? m('.KobaltStudio-previewComposer', tr('composer_example')) : null,
        m('.KobaltStudio-previewCard', {
          style: enabled(config.tag_accents) ? { 'box-shadow': 'inset 4px 0 #4d698e' } : undefined,
        }, [
          m('small', tr('example_label')),
          m('strong', tr('discussion_example')),
          m('p', tr('discussion_text')),
          enabled(config.feed_actions) ? m('.KobaltFeed-actions', ['reply', 'react', 'share'].map((key) => m('span', previewText(key)))) : null,
        ]),
        this.group === 'layout' ? m('.KobaltStudio-previewShoutbox', tr('shoutbox_example')) : null,
      ]),
      enabled(config.footer) && footerView(config, footerData(config, app), previewText,
        (item, children) => m('span.KobaltFooter-previewLink', children),
        { forumTitle: app.data.settings.forum_title || 'Kobalt', preview: true }),
    ]);
  }

  content() {
    const config = readConfig((name) => this.setting(settingKey(name), defaults[name])());

    return m('.ExtensionPage-settings.KobaltStudio', m('.container', [
      m('.KobaltStudio-intro', [m('span', 'KOBALT'), m('h2', tr('title')), m('p', tr('subtitle'))]),
      m('.KobaltStudio-grid', [
        m('.KobaltStudio-editor', [
          m('nav.KobaltStudio-tabs', { 'aria-label': tr('title') }, Object.keys(fields).map((group) => m('button.Button', {
            type: 'button',
            'aria-pressed': this.group === group ? 'true' : 'false',
            onclick: () => { this.group = group; },
          }, tr(group)))),
          m('.KobaltStudio-fields', [
            m('h3', tr(this.group)),
            m('p.helpText', tr(this.group + '_help')),
            this.group === 'projects' && this.projectPicker(),
            this.group === 'footer' && this.footerPicker(),
            this.group === 'journey' && this.slotPicker(stepSlots, 'step'),
            this.group === 'categories' && this.slotPicker(projectSlots, 'category'),
            m('.KobaltStudio-controls', this.controls(config)),
          ]),
          m('.KobaltStudio-save', [
            this.submitButton(),
            m('button.Button.Button--link', {
              type: 'button',
              onclick: () => Object.entries(defaults).forEach(([key, value]) => this.setting(settingKey(key))(value)),
            }, tr('defaults')),
          ]),
        ]),
        this.preview(config),
      ]),
    ]));
  }
}

export const extend = [new Admin().page(KobaltStudio)];
