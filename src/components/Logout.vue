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
    axios.get('http://185.59.209.146:38080' + '/Account/Logout', {withCredentials: true}).then(() => {
      window.location.replace('http://185.59.209.146:38080' + '/Account/Login/');
    }).catch((error) => {
      console.error(error);
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
