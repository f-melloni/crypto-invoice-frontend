<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm8 offset-sm2>
        <v-card class="mb-2">
          <v-card-text>
            <h1>Invoices</h1>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 sm8 offset-sm2>
        <v-data-table
        :headers="headers"
        :items="invoices"
        hide-actions
        class="elevation-1"
        item-key="Id"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-left">{{ accepting(props.item) }}</td>
            <td class="text-xs-left">{{ invoiceState(props.item.state) }}</td>
            <td class="text-xs-right">{{ props.item.dateCreated }}</td>
            <td class="justify-center layout px-0">
              <v-btn icon class="mx-0" @click="viewInvoice(props.item)">
                <v-icon color="teal">search</v-icon>
              </v-btn>
              <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                <v-icon color="red">delete</v-icon>
              </v-btn>
            </td>
          </template>
          <template slot="no-data">
            <div>You currently have no invoices</div>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
    <v-dialog v-model="deleteDialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Delete Invoice?</v-card-title>
        <v-card-text class="text-xs-left">You are about to permanently delete the selected invoice <b>{{deletedItem.name}}</b>. Are you sure?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" flat="flat" @click.native="deleteItemConfirmed()">Delete</v-btn>
          <v-btn color="green darken-1" flat="flat" @click.native="deleteDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
        {text: 'Accepting', value: 'accepting', width: '60px'},
        {text: 'Status', value: 'status', width: '200px'},
        {text: 'Date Created', value: 'dateCreated', width: '120px'},
        {text: 'Actions', sortable: false, width: '60px'}
      ],
      deletedItem: {},
      deleteDialog: false
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
  methods: {
    deleteItem (item) {
      this.deletedItem = item;
      this.deleteDialog = true;
    },
    deleteItemConfirmed () {
      this.$store.dispatch('deleteInvoiceAction', this.deletedItem.id);
      this.deletedItem = {};
      this.deleteDialog = false;
    },
    viewInvoice (item) {
      this.$router.push({name: 'InvoicePage', params: {id: item.id}});
    },
    invoiceState (state) {
      return utils.paymentStates[state];
    },
    accepting (item) {
      var btc = item.acceptBTC;
      var ltc = item.acceptLTC;
      var eth = item.acceptETH;
      var xmr = item.acceptXMR;
      var accepting = [];
      var acceptingResult = '';

      if (btc) {
        accepting.push('BTC');
      }
      if (ltc) {
        accepting.push('LTC');
      }
      if (eth) {
        accepting.push('ETH');
      }
      if (xmr) {
        accepting.push('XMR');
      }

      for (let code of accepting) {
        acceptingResult += code + ', ';
      }
      return acceptingResult.slice(0, -2);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
