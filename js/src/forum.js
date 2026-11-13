import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import { extend, override } from 'flarum/common/extend';
import Avatar from 'flarum/common/components/Avatar';
import Button from 'flarum/common/components/Button';
import Icon from 'flarum/common/components/Icon';
import Link from 'flarum/common/components/Link';
import username from 'flarum/common/helpers/username';
import humanTime from 'flarum/common/utils/humanTime';
import extractText from 'flarum/common/utils/extractText';
import IndexPage from 'flarum/forum/components/IndexPage';
import IndexSidebar from 'flarum/forum/components/IndexSidebar';
import { discussionId, enabled, glass, pattern, readConfig, resolveDestination, themeStyle } from './config';
import { dockView, featuredView, focusView, icons } from './studioView';
import { Projects, VisitUpdates } from './homeExtras';
import { installFeedExtras, isFollowing } from './feedExtras';
import { Journey, Workspace } from './personal';
import { installTopicExtras } from './topicExtras';
import { installFooter } from './footer';

const core = 'flarum/forum/components/';
const title = () => app.translator.trans('core.forum.index.start_discussion_button');
const trans = (key) => app.translator.trans('el-choco-kobalt.forum.' + key);
let config = readConfig(() => undefined);

function dock() {
  if (!enabled(config.dock)) return null;
  const entries = icons.flatMap((icon, i) => {
    const key = 'link' + (i + 1);
    const href = resolveDestination(config[key + '_url'], app);
    if (!href) return [];
    return [{ icon, href, label: config[key + '_label'] || trans(key) }];
  });
  if (!entries.length) return null;

  return dockView(entries, trans('dock'), ({ href, label }, children) => {
    const target = new URL(href, document.baseURI);
    const active = target.origin === location.origin &&
      target.pathname.replace(/\/$/, '') === location.pathname.replace(/\/$/, '') &&
      (!target.search || target.search === location.search);
    return m('a.KobaltDock-link.UrlLink--internal', {
      href, title: label, 'aria-current': active ? 'page' : null,
    }, children);
  });
}

function spotlight() {
  if (!enabled(config.focus)) return null;
  const href = resolveDestination(config.focus_url, app);
  if (!href && !config.focus_title) return null;

  return focusView({
    label: config.focus_label || trans('focus_label'),
    title: config.focus_title || trans('focus_title'),
    text: config.focus_text,
  }, href ? m('a.KobaltFocus-action.UrlLink--internal', { href }, [
    config.focus_action || trans('focus_action'), m('i.fas.fa-arrow-right', { 'aria-hidden': 'true' }),
  ]) : null);
}

const onHome = () => app.current.matches(IndexPage, { routeName: 'index' });

class Featured extends Component {
  oninit(vnode) {
    super.oninit(vnode);
    const id = config.featured_source === 'discussion' && discussionId(config.featured_discussion);
    if (!id) return;

    app.request({
      url: app.forum.attribute('apiUrl') + '/discussions/' + id,
      params: { include: '', 'fields[discussions]': 'title' },
      errorHandler: () => {},
    }).then(({ data }) => {
      if (data?.type === 'discussions' && data.id === id && data.attributes?.title) {
        this.discussion = { title: data.attributes.title, href: app.route('discussion', { id }) };
      }
    }).catch(() => {});
  }

  view() {
    const topic = config.featured_source === 'discussion';
    if (topic && !this.discussion) return null;
    const title = String(config.featured_title).trim() || this.discussion?.title;
    if (!title) return null;

    const href = topic ? this.discussion.href : resolveDestination(config.featured_url, app);
    return featuredView({
      label: trans('featured'),
      title,
      text: config.featured_text,
      image: resolveDestination(config.featured_image, app),
    }, href && m('a.KobaltFeatured-link', { href }, trans('featured_open')));
  }
}

async function shareDiscussion(discussion, href) {
  const url = new URL(href, document.baseURI).href;
  if (navigator.share) {
    try {
      await navigator.share({ title: discussion.title(), url });
      return;
    } catch (error) {
      if (error.name === 'AbortError') return;
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    app.alerts.show({ type: 'success' }, trans('share_copied'));
  } catch {
    window.prompt(extractText(trans('share_prompt')), url);
  }
}

function feedActions(discussion) {
  const href = app.route.discussion(discussion);
  const firstPost = discussion.firstPost();
  const Reaction = flarum.reg.checkModule?.('fof-reactions', 'forum/components/PostReactAction');
  const visiblePost = firstPost && !firstPost.isHidden?.();
  const reaction = Reaction && (visiblePost && firstPost.canReact?.() === true
    ? Reaction.component({ post: firstPost })
    : !firstPost && app.session.user && Link.component({
      className: 'Button Button--flat', href: app.route.discussion(discussion, 1),
    }, [Icon.component({ name: 'far fa-smile' }), trans('react')]));

  return m('.KobaltFeed-actions', { role: 'group', 'aria-label': trans('feed_actions') }, [
    discussion.canReply() && Link.component({ className: 'Button Button--flat', href }, [
      Icon.component({ name: 'far fa-comment' }), trans('reply'),
    ]),
    reaction,
    Button.component({ className: 'Button Button--flat', icon: 'fas fa-share', onclick: () => shareDiscussion(discussion, href) }, trans('share')),
    visiblePost && reactionSummary(firstPost),
  ]);
}

function reactionSummary(post) {
  const counts = Object.entries(post.reactionCounts?.() || {}).filter(([, count]) => count > 0);
  if (!counts.length) return null;

  const Counts = flarum.reg.checkModule?.('fof-reactions', 'forum/components/PostReactionCounts');
  const total = counts.reduce((sum, [, count]) => sum + Number(count), 0);
  return m('.KobaltFeed-reactions', [
    Counts && counts.every(([id]) => app.store.getById('reactions', id)) && Counts.component({ post }),
    m('span', { role: 'status' }, app.translator.trans('el-choco-kobalt.forum.reaction_total', { count: total })),
  ]);
}

function authorLine(discussion, user) {
  const name = username(user);

  return m('.KobaltByline', [
    user ? Link.component({ href: app.route.user(user) }, name) : name,
    m('.KobaltByline-time', humanTime(discussion.createdAt())),
  ]);
}

function welcomeView(original, ...args) {
  if (!onHome()) return original(...args);
  if (!enabled(config.hero)) return null;
  const hero = original(...args);
  if (hero) return hero;

  const title = config.hero_title || app.forum.attribute('title');
  const description = config.hero_subtitle || app.forum.attribute('description');
  if (!title) return hero;

  return m('header.Hero.WelcomeHero.KobaltHero', m('.KobaltHero-inner', [
    m('.KobaltHero-heading', [
      m('h1.Hero-title', title),
      description ? m('p.Hero-subtitle', description) : null,
    ]),
    spotlight(),
  ]));
}

function moveSideWidgets(items) {
  if (!enabled(config.widgets) || !app.current.matches(IndexPage) || !items.has('endWidgetSection') || !items.has('content')) return;

  const content = items.get('content');
  const widgets = items.get('endWidgetSection');
  const classes = content?.attrs?.className;
  if (!widgets || typeof classes !== 'string' || !classes.split(/\s+/).includes('Page-content')) return;

  items.setContent('content', {
    ...content,
    children: [m('.KobaltWidgets', widgets), m.fragment({}, content.children)],
  });
  items.remove('endWidgetSection');
}

app.initializers.add(
  'el-choco-kobalt',
  () => {
    installFeedExtras(() => config);
    installTopicExtras(() => config);
    installFooter(() => config);
    app.beforeMount(() => {
      config = readConfig((name) => app.data.kobaltSettings?.[name]);
      const root = document.documentElement;
      root.dataset.kobaltPattern = pattern(config);
      root.dataset.kobaltGlass = glass(config);
      for (const [key, value] of Object.entries(themeStyle(config))) root.style.setProperty(key, value);
    });

    extend(core + 'HeaderPrimary', 'items', function (items) {
      const nav = dock();
      if (nav) items.add('kobaltOrbit', nav, 110);
    });

    extend(core + 'WelcomeHero', 'contentItems', function (items) {
      if (!onHome()) return;
      if (config.hero_title && items.has('title')) items.setContent('title', m('h1.Hero-title', config.hero_title));
      if (config.hero_subtitle && items.has('subtitle')) items.setContent('subtitle', m('.Hero-subtitle', config.hero_subtitle));
    });

    extend(core + 'WelcomeHero', 'bodyItems', function (items) {
      if (!onHome()) return;
      const focus = spotlight();
      if (focus) items.add('kobaltFocus', focus, 70);
    });

    extend(core + 'DiscussionListItem', 'authorItems', function (items) {
      if (!app.current.matches(IndexPage) || !items.has('avatar')) return;
      const discussion = this.attrs.discussion;
      items.add('kobaltByline', authorLine(discussion, this.attrs.author || discussion.user()), 85);
    });

    extend(core + 'DiscussionListItem', 'elementAttrs', function (attrs) {
      if (!enabled(config.tag_accents) || !app.current.matches(IndexPage)) return;
      const tags = this.attrs.discussion.tags?.();
      const color = Array.isArray(tags) && (tags.find((tag) => tag && !tag.isSecondary?.()) || tags.find(Boolean))?.color?.();
      if (!/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(color)) return;
      attrs.style = typeof attrs.style === 'string'
        ? attrs.style + ';--kobalt-tag-accent:' + color
        : { ...attrs.style, '--kobalt-tag-accent': color };
    });

    extend(core + 'DiscussionListItem', 'contentItems', function (items) {
      if (enabled(config.feed_actions) && app.current.matches(IndexPage) && items.has('main')) {
        items.add('kobaltFeedActions', feedActions(this.attrs.discussion), 60);
      }
    });

    extend(core + 'DiscussionListItem', 'oninit', function () {
      if (!enabled(config.feed_actions)) return;
      this.subtree.check(() => this.attrs.discussion.firstPost()?.freshness);
    });

    extend(core + 'IndexPage', 'contentItems', function (items) {
      if (!items.has('discussionList')) return;
      const nav = dock();
      if (nav) items.add('kobaltMobileOrbit', m('.KobaltDock-mobile', nav), 105);
      if (onHome() && enabled(config.featured)) items.add('kobaltFeatured', m(Featured), 110);
      if (onHome() && !isFollowing()) {
        if (enabled(config.workspace) && app.session.user) items.add('kobaltWorkspace', m(Workspace), 109);
        if (enabled(config.onboarding)) items.add('kobaltJourney', m(Journey, { config }), 107);
        if (enabled(config.projects)) items.add('kobaltProjects', m(Projects, { config }), 108);
        if (enabled(config.visit_updates) && app.session.user) items.add('kobaltVisit', m(VisitUpdates), 106);
      }
      if (!enabled(config.composer)) return;
      const user = app.session.user;
      if (user && !app.forum.attribute('canStartDiscussion')) return;

      items.add(
        'kobaltComposer',
        m('.KobaltComposer', [
          Avatar.component({ user, title: '' }),
          Button.component(
            {
              className: 'Button KobaltComposer-button',
              onclick: () => new IndexSidebar().newDiscussionAction().catch(() => {}),
            },
            [m('span.KobaltComposer-label', title()), Icon.component({ name: 'fas fa-pen', className: 'KobaltComposer-icon' })]
          ),
        ]),
        95
      );
    });

    override(core + 'WelcomeHero', 'view', welcomeView);
    extend(core + 'PageStructure', 'containerItems', moveSideWidgets);
  },
  -100
);
