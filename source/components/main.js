'use strict';

// *** Importing main tools for development  ***
import Vue from "vue";

// *** Importing Vue-components ***
import simonsGame from "./simonsGame.vue";


// *** Main Vue development configuration ***
Vue.config.productionTip = false;
Vue.config.devtools = true;


// *** Vue instance ***
new Vue({
  render: h => h(simonsGame)
}).$mount('#simonsGame');
