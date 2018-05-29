<template>
  <v-container fluid grid-list-xs>
    <v-layout row justify-center>
      <v-flex xs12 md6>
        <v-card class="mb-2">
          <v-card-text>
            <h1>Invoices</h1>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row justify-center>
      <v-flex xs12 md6 hidden-sm-and-down>
        <v-data-table
        :headers="headers"
        :items="invoices"
        hide-actions
        class="elevation-1"
        item-key="invoiceGuid"
        :loading="isLoading"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-left">
              <v-avatar size="24px" :color="props.item.state | avatarColor">
                <v-icon size="20px" dark>{{ props.item.state | stateIcon }}</v-icon>
              </v-avatar>
            </td>
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-right">{{ props.item.fiatAmount + ' ' + props.item.fiatCurrencyCode }}</td>
            <td class="text-xs-left">{{ props.item.accepting }}</td>
            <td class="text-xs-left">
              {{ props.item.state | formatState }}
            </td>
            <td class="text-xs-left">{{ props.item.dateCreated | formatDate }}</td>
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
            <div>Loading your invoices...</div>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
    <v-dialog v-model="deleteDialog" max-width="400">
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
    <v-snackbar top color="success" :timeout="5000" v-model="newInvoice">
      New invoice successfully created!
    </v-snackbar>
    <v-snackbar top color="success" :timeout="5000" v-model="settingsChanged">
      Settings successfully changed!
    </v-snackbar>
  </v-container>
</template>

<script>
// import moment from 'moment';

export default {
  name: 'Dashboard',
  data () {
    return {
      isLoading: true,
      headers: [
        {value: 'state', align: 'left'},
        {text: 'Invoice Name', value: 'name', align: 'left'},
        {text: 'Amount', value: 'fiatAmount', align: 'right'},
        {text: 'Accepting', value: 'accepting'},
        {text: 'Status', value: 'state'},
        {text: 'Date Created', value: 'dateCreated'},
        {text: 'Actions', sortable: false}
      ],
      deletedItem: {},
      deleteDialog: false,
      invoices: []
    };
  },
  mounted () {
    // load invoices and stop loading visuals
    var invoices = this.$store.getters.invoices;
    invoices.forEach((invoice) => {
      let accepting = [];
      invoice.accepting = '';
      if (invoice.acceptBTC) {
        accepting.push('BTC');
      }
      if (invoice.acceptLTC) {
        accepting.push('LTC');
      }
      for (let code of accepting) {
        invoice.accepting += code + ', ';
      }
      invoice.accepting = invoice.accepting.slice(0, -2);
    });
    this.invoices = invoices;
    this.isLoading = false;
  },
  computed: {
    newInvoice: {
      get () {
        return this.$store.getters.newInvoice;
      },
      set (value) {
        this.$store.dispatch('newInvoiceAction', value);
      }
    },
    settingsChanged: {
      get () {
        return this.$store.getters.settingsChanged;
      },
      set (value) {
        this.$store.dispatch('settingsChangedAction', value);
      }
    },
    /* invoices () {
      var invoices = this.$store.getters.invoices;
      invoices.forEach((invoice) => {
        let accepting = [];
        invoice.accepting = '';
        if (invoice.acceptBTC) {
          accepting.push('BTC');
        }
        if (invoice.acceptLTC) {
          accepting.push('LTC');
        }
        for (let code of accepting) {
          invoice.accepting += code + ', ';
        }
        invoice.accepting = invoice.accepting.slice(0, -2);
      });
      return invoices;
    }, */
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
      this.$store.dispatch('deleteInvoiceAction', this.deletedItem.invoiceGuid);
      this.deletedItem = {};
      this.deleteDialog = false;
    },
    viewInvoice (item) {
      this.$router.push({name: 'InvoicePage', params: {invoiceGuid: item.invoiceGuid}});
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
