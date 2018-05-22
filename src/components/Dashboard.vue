<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card class="mb-2">
          <v-card-text>
            <h1>Invoices</h1>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-data-table
        :headers="headers"
        :items="invoices"
        hide-actions
        class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-left">{{ invoiceState(props.item.state) }}</td>
            <td class="text-xs-right">{{ props.item.dateCreated }}</td>
            <td class="justify-center layout px-0">
              <v-btn icon class="mx-0" @click="viewInvoice(props.item)">
                <v-icon color="teal">search</v-icon>
              </v-btn>
              <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                <v-icon color="pink">delete</v-icon>
              </v-btn>
            </td>
          </template>
          <template slot="no-data">
            <div>You currently have no invoices</div>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import utils from '@/utils.js'
export default {
  name: 'Dashboard',
  data () {
    return {
      headers: [
        {text: 'Name', value: 'name', align: 'left'},
        {text: 'Status', value: 'status', width: '200px'},
        {text: 'Date Created', value: 'dateCreated', width: '120px'},
        {text: 'Actions', sortable: false, width: '60px'}
      ]
    };
  },
  computed: {
    invoices () {
      return this.$store.getters.invoices;
    },
    formTitle () {
      return this.editedIndex === -1 ? 'New Invoice' : 'Edit Invoice'
    }
  },
  watch: {
    invoiceDetailsDialog (val) {
      val || this.close();
    }
  },
  methods: {
    deleteItem (item) {

    },
    viewInvoice (item) {
      this.$router.push({name: 'InvoicePage', params: {id: item.id}});
    },
    invoiceState (state) {
      return utils.paymentStates[state];
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
