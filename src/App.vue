<template>
  <div id="app">
    <v-app>
      <v-toolbar app color="indigo">
        <span class="title ml-3 mr-5"><a @click="push('/')">Crypto Invoice</a></span>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down" v-if="isAuthorized()"  v-for="item in navItems" :key="item.title">
          <v-btn color="white" flat :to="item.path">{{item.title}}</v-btn>
        </v-toolbar-items>
        <v-toolbar-items class="hidden-sm-and-down" v-if="!isAuthorized()"  v-for="item in unauthNavItems" :key="item.title">
          <v-btn color="white" flat :href="item.href">{{item.title}}</v-btn>
        </v-toolbar-items>
        <v-menu transition="slide-y-transition" bottom left attach offset-y offset-overflow nudge-left>
          <v-toolbar-side-icon class="hidden-md-and-up white--text" slot="activator"></v-toolbar-side-icon>
          <v-list>
            <v-list-tile v-for="item in navItems" v-if="isAuthorized()" :key="item.title" @click="push(item.path)">
              <v-list-tile-title :to="item.path">{{ item.title }}</v-list-tile-title>
            </v-list-tile>
            <v-list-tile v-for="item in unauthNavItems" v-if="!isAuthorized()" :key="item.title" @click="push(item.path)">
              <v-list-tile-title :href="item.href">{{ item.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar>
      <v-content class="pt-3">
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
      { title: 'Invoices', path: '/' },
      { title: 'Payment Request', icon: 'currency-btc', path: '/paymentrequest' },
      { title: 'Account Settings', icon: 'account-settings-variant', path: '/accountsettings' },
      { title: 'Log Out', path: '/logout' }
    ],
    unauthNavItems: [
      { title: 'Log In', href: '/Account/Login' }
    ]
  }),
  methods: {
    push (path) {
      this.$router.push(path);
    },
    isAuthorized () {
      return this.$store.getters.unlogged === false;
    }
  },
  created () {
    if (process.env.NODE_ENV === 'development') {
      console.log('Running development instance!');
    }
  }
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
span.title > a {
  color: white;
  text-decoration: none;
}
span.title > a:link{
  color: white;
}
span.title > a:visited{
  color: white;
}
main.content {
  padding: none;
}
</style>
