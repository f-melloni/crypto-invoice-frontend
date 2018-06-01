<template>
  <v-container></v-container>
</template>

<script>
import axios from 'axios';
import { frontEndUrl } from '@/appSettings.json';
export default {
  name: 'Logout',
  data () {
    return {}
  },
  created () {
    axios.get(frontEndUrl[process.env.NODE_ENV] + '/Account/Logout', {withCredentials: true}).then(() => {
      window.location.replace(frontEndUrl[process.env.NODE_ENV] + '/Account/Login/');
    }).catch((error) => {
      console.error(error);
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
