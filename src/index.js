import terminal from "./v-terminal.vue";

function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component("v-terminal", terminal);
}

const plugin = {
  install
};

let GlobalVue = null;
if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue = global.vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

terminal.install = install;

export default terminal;
