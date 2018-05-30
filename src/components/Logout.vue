<template>
  <v-container></v-container>
</template>

<script>
import axios from 'axios';
import { connectionString } from '@/appSettings.json';
export default {
  name: 'Logout',
  data () {
    return {}
  },
  created () {
    axios.get(connectionString + '/Account/Logout', {withCredentials: true}).then(() => {
      if (process.env.NODE_ENV === 'development') {
        window.location.replace(connectionString + '/Account/Login/');
      } else {
        this.$router.push('/Account/Login');
      }
    }).catch((error) => {
      console.error(error);
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
