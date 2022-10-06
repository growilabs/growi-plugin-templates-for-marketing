import conference from './src/conference.md';
import pressrelease from './src/pressrelease.md'

declare const growiFacade: any;

const activate = (): void => {
  growiFacade.customTemplates['growi-plugin-markdown-templates'] = {
    conference: conference,
    pressrelease: pressrelease,
  }
};

const deactivate = (): void => {
};

// register activate
if ((window as any).pluginActivators == null) {
  (window as any).pluginActivators = {};
}
(window as any).pluginActivators['growi-plugin-markdown-templates'] = {
  activate,
  deactivate,
};