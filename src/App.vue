<template>
  <div id="app">
    <v-app>
      <v-toolbar app dark color="indigo">
        <span class="title ml-3 mr-5">Crypto Invoice</span>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down" v-for="item in navItems" :key="item.title">
          <v-btn flat :to="item.path">{{item.title}}</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-content>
        <!--<img src="./assets/logo.png">-->
        <router-view/>
      </v-content>
    </v-app>
  </div>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    navItems: [
      { title: 'Account Settings', icon: 'account-settings-variant', path: '/accountsettings' },
      { title: 'Payment Request', icon: 'currency-btc', path: '/paymentrequest' },
      { title: 'Home', path: '/' }
    ],
    methods: {
      menuClick: function (params) {
      }
    }
  })
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
