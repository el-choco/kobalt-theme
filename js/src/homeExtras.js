import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import Link from 'flarum/common/components/Link';
import humanTime from 'flarum/common/utils/humanTime';
import { projectCards, resolveDestination } from './config';
import { projectsView } from './studioView';

const tr = (key, params) => app.translator.trans('el-choco-kobalt.forum.' + key, params);
const depotReady = () => Object.hasOwn(app.routes, 'depot.file');
const api = (path, params) => app.request({
  url: app.forum.attribute('apiUrl') + path, params, errorHandler: () => {},
});
const depotSlug = (slug) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug);
const sitePath = (href) => new URL(href, document.baseURI).origin === location.origin;

export class Projects extends Component {
  oninit(vnode) {
    super.oninit(vnode);
    this.projects = this.attrs.projects || projectCards(this.attrs.config);
    if (!depotReady()) return;

    for (const project of this.projects) {
      if (!depotSlug(project.depot)) continue;
      api('/depot/file', { slug: project.depot }).then((data) => {
        if (data?.slug !== project.depot) return;
        project.depotVersion = data.version?.version;
        project.depotPage = app.route('depot.file', { slug: project.depot });
      }).catch(() => {});
    }
  }

  view() {
    return projectsView(this.projects, tr, (project, field) => {
      const href = resolveDestination(project[field], app) || (field === 'download' && project.depotPage);
      return href && Link.component({ href, external: !sitePath(href) }, tr('project_' + field));
    }, this.attrs.heading);
  }
}

const idle = 30 * 60 * 1000;
const limit = 20;
const displayed = 4;

export function visitWindow(storage, key, now) {
  let previous;
  try {
    previous = JSON.parse(storage.getItem(key));
  } catch {
    previous = null;
  }
  const last = Number.isFinite(previous?.last) && previous.last > 0 && previous.last <= now ? previous.last : 0;
  const cutoff = last && now - last >= idle ? last
    : Number.isFinite(previous?.cutoff) && previous.cutoff > 0 && previous.cutoff <= last ? previous.cutoff : 0;
  storage.setItem(key, JSON.stringify({ last: now, cutoff }));
  return cutoff;
}

function recentDiscussions(sort) {
  return api('/discussions', {
    include: '', sort, 'page[limit]': limit,
    'fields[discussions]': 'title,createdAt,lastPostedAt,lastPostNumber',
  }).then((response) => response.data);
}

export class VisitUpdates extends Component {
  oninit(vnode) {
    super.oninit(vnode);
    this.groups = {};
    this.load();
  }

  async load() {
    const baseUrl = app.forum.attribute('baseUrl');
    const userId = app.session.user.id();
    try {
      this.since = visitWindow(window.localStorage, 'kobalt-visit:' + baseUrl + ':' + userId, Date.now());
    } catch {
      this.status = 'visit_storage';
      return;
    }
    if (!this.since) {
      this.status = 'visit_first';
      return;
    }

    const requests = {
      discussions: recentDiscussions('-createdAt').then((rows) => this.discussions(rows, false)),
      replies: recentDiscussions('-lastPostedAt').then((rows) => this.discussions(rows, true)),
    };
    if (depotReady()) {
      requests.downloads = api('/depot/browse', { sort: 'updated', page: 0 }).then(({ files }) => files
        .filter((file) => depotSlug(file.slug) && Date.parse(file.version?.date) > this.since)
        .slice(0, displayed).map((file) => ({
          title: file.title,
          date: file.version.date,
          href: app.route('depot.file', { slug: file.slug }),
        })));
    }
    await Promise.all(Object.entries(requests).map(async ([key, request]) => {
      this.groups[key] = { loading: true };
      try {
        this.groups[key] = { rows: await request };
      } catch {
        this.groups[key] = { error: true };
      }
    }));
    m.redraw();
  }

  discussions(rows, replies) {
    return rows.filter(({ attributes }) => {
      const created = Date.parse(attributes.createdAt);
      return replies ? created <= this.since && Date.parse(attributes.lastPostedAt) > this.since : created > this.since;
    }).slice(0, displayed).map(({ id, attributes }) => ({
      title: attributes.title,
      date: replies ? attributes.lastPostedAt : attributes.createdAt,
      href: replies && attributes.lastPostNumber > 1
        ? app.route('discussion.near', { id, near: attributes.lastPostNumber })
        : app.route('discussion', { id }),
    }));
  }

  view() {
    return m('section.KobaltHome.KobaltVisit', [
      m('h2', tr('visit_title')),
      this.status ? m('p', tr(this.status)) : [
        this.since && m('p', tr('visit_since', { time: humanTime(new Date(this.since)) })),
        m('.KobaltHome-grid', Object.entries(this.groups).map(([key, group]) => m('.KobaltHome-card', { key }, [
          m('h3', tr('visit_' + key)),
          group.loading ? m('p', tr('visit_loading')) : group.error ? m('p', tr('visit_error')) :
            !group.rows.length ? m('p', tr('visit_empty')) :
              m('ul', group.rows.map((entry) => m('li', Link.component({ href: entry.href }, entry.title)))),
        ]))),
      ],
    ]);
  }
}
