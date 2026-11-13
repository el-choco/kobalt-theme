import app from 'flarum/forum/app';
import { override } from 'flarum/common/extend';
import Link from 'flarum/common/components/Link';
import IndexPage from 'flarum/forum/components/IndexPage';
import DiscussionPage from 'flarum/forum/components/DiscussionPage';
import { resolveDestination } from './config';
import { footerData, footerView, footerVisible } from './footerView';

export function installFooter(config) {
  override('flarum/forum/components/Footer', 'view', function (original) {
    const existing = original();
    const settings = config();
    if (!footerVisible(settings, app, IndexPage, DiscussionPage)) return existing;
    const title = app.forum.attribute('title') || 'Kobalt';
    const node = footerView(settings, footerData(settings, app),
      (key) => app.translator.trans('el-choco-kobalt.forum.' + key),
      (item, children) => {
        const external = new URL(item.href, document.baseURI).origin !== location.origin;
        return Link.component({ href: item.href, external, target: external ? '_blank' : undefined,
          rel: external ? 'noopener noreferrer' : undefined }, children);
      }, {
        forumTitle: title, logo: resolveDestination(app.forum.attribute('logoUrl'), app),
        toTop: () => {
          const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
          window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' });
        },
      });
    return m.fragment({}, [existing, node]);
  });
}
