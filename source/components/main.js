'use strict';

// *** Importing main tools for development  ***
import Vue from "vue";

// *** Importing Vue-components ***
import simonsGameApp from "./simonsGame.vue";


// *** Main Vue development configuration ***
Vue.config.productionTip = false;
Vue.config.devtools = true;


// *** Vue instance ***
window.addEventListener('load', function () {
  new Vue({
    render: h => h(simonsGameApp)
  }).$mount('#simonsGame');
});

