import deepmerge from 'ts-deepmerge';

import conference from './src/conference.md';
import pressrelease from './src/pressrelease.md'

declare const growiFacade: any;

const activate = (): void => {
  const tplConference = {
    id: 'growi-plugin-templates-for-office__conference',
    name: '議事録(シンプル)',
    markdown: conference,
  };
  const tplPressrelease = {
    id: 'growi-plugin-templates-for-office__pressrelease',
    name: 'プレスリリース',
    markdown: pressrelease,
  };

  growiFacade.customTemplates = deepmerge(
    growiFacade.customTemplates ?? {},
    {
      [tplConference.id]: tplConference,
      [tplPressrelease.id]: tplPressrelease,
    },
  );
};

const deactivate = (): void => {
};

// register activate
if ((window as any).pluginActivators == null) {
  (window as any).pluginActivators = {};
}
(window as any).pluginActivators['growi-plugin-templates-for-office'] = {
  activate,
  deactivate,
};
