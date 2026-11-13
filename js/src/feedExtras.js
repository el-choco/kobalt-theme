import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import Link from 'flarum/common/components/Link';
import LinkButton from 'flarum/common/components/LinkButton';
import IndexPage from 'flarum/forum/components/IndexPage';
import { enabled } from './config';

const tr = (key) => app.translator.trans('el-choco-kobalt.forum.' + key);
const extension = (id) => Object.hasOwn(flarum.extensions || {}, id);
const followingKey = 'following-tag';
const core = 'flarum/forum/components/';
const options = [['0', 'support_all'], ['2', 'support_open'], ['1', 'support_solved']];

export function isFollowing() {
  const value = app.search?.state.stickyParams().filter?.[followingKey];
  return value === 'true' || value === '1' || value === true;
}

function isSupport(config) {
  return enabled(config.support_filters) && extension('fof-best-answer') && app.currentTag?.()?.isQnA?.();
}

export function bestAnswerLink(discussion) {
  const post = discussion.bestAnswerPost?.();
  if (post?.isHidden?.()) return null;

  const id = discussion.hasBestAnswer?.();
  const href = (number) => app.route.discussion(discussion, number);
  if (post?.number?.()) return Link.component({ href: href(post.number()), className: 'KobaltSolution' }, tr('best_answer'));
  if (!id) return null;

  return m('a.KobaltSolution', { href: href(), onclick: async (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const origin = m.route.get();
    let number;
    try {
      const data = await app.request({
        url: app.forum.attribute('apiUrl') + '/posts/' + encodeURIComponent(id),
        params: { include: '', 'fields[posts]': 'number,isHidden' },
        errorHandler: () => {},
      });
      const post = data?.data?.attributes;
      if (post && !post.isHidden) number = post.number;
    } catch {
      // Open the topic if the selected post is no longer available.
    }
    if (m.route.get() === origin) m.route.set(href(number));
  } }, tr('best_answer'));
}

export function installFeedExtras(config) {
  extend(core + 'IndexSidebar', 'navItems', (items) => {
    if (!enabled(config().following_feed) || !app.session.user || !extension('fof-follow-tags')) return;
    const params = app.search.state.stickyParams();
    const filter = { ...params.filter };
    if (isFollowing() && items.has('allDiscussions')) {
      delete filter[followingKey];
      const all = items.get('allDiscussions');
      all.attrs.href = app.route('index', { ...params, filter });
      all.attrs.active = false;
    }
    items.add('kobaltFollowing', LinkButton.component({
      href: app.route('index', { filter: { [followingKey]: 'true' } }),
      icon: 'fas fa-layer-group',
      active: isFollowing() && app.current.matches(IndexPage, { routeName: 'index' }),
    }, tr('following')), 95);
  });

  extend(core + 'IndexPage', 'contentItems', (items) => {
    if (!isSupport(config()) || !items.has('discussionList')) return;
    const selected = app.discussions.bestAnswer || '0';
    items.add('kobaltSupport', m('div.KobaltSupport', { role: 'group', 'aria-label': tr('support_status') },
      options.map(([value, key]) => m('button.Button', {
        type: 'button',
        'aria-pressed': String(selected === value),
        onclick: () => {
          if (selected === value) return;
          if (value === '0') delete app.discussions.bestAnswer;
          else app.discussions.bestAnswer = value;
          app.discussions.refresh().catch(() => {});
        },
      }, tr(key)))), 92);
  });

  extend(core + 'IndexPage', 'viewItems', (items) => {
    if (isSupport(config()) && items.has('solved-filter')) items.remove('solved-filter');
  });

  extend('flarum/forum/states/DiscussionListState', 'requestParams', function (params) {
    const tag = this.params?.tags && app.store.getBy('tags', 'slug', this.params.tags);
    if (!enabled(config().support_filters) || !extension('fof-best-answer') || !tag?.isQnA?.()) return;
    if (Array.isArray(params.include) && !params.include.includes('bestAnswerPost')) params.include.push('bestAnswerPost');
  });

  extend(core + 'DiscussionListItem', 'contentItems', function (items) {
    if (!isSupport(config()) || !items.has('main')) return;
    const link = bestAnswerLink(this.attrs.discussion);
    if (link) items.add('kobaltBestAnswer', link, 65);
  });
}
