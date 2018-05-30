<template>
  <v-container fluid grid-list-sm>
    <v-layout row justify-center>
      <v-flex xs12 md10 lg8>
        <v-card class="mb-2">
          <v-card-text>
            <h1>Invoices</h1>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row justify-center>
      <!-- small devices render data iterator instead of data table -->
      <v-layout hidden-md-and-up>
        <v-data-iterator
          :items="invoices"
          content-tag="v-layout"
          row wrap
          class="px-1"
        >
          <v-flex slot="item" slot-scope="props" xs12>
            <v-card>
              <v-list dense>
                <v-list-tile>
                  <v-list-tile-content>Invoice Name:</v-list-tile-content>
                  <v-list-tile-content class="align-end">
                    <b>{{ props.item.name }}
                    <v-avatar size="20px" :color="props.item.state | avatarColor">
                      <v-icon size="16px" dark>{{ props.item.state | stateIcon }}</v-icon>
                    </v-avatar></b>
                  </v-list-tile-content>
                </v-list-tile>
                <v-divider></v-divider>
                <v-list-tile>
                  <v-list-tile-content>Status:</v-list-tile-content>
                  <v-list-tile-content class="align-end">{{ props.item.state | formatState }}</v-list-tile-content>
                </v-list-tile>
                <v-divider></v-divider>
                <v-list-tile>
                  <v-list-tile-content>Payment Amount:</v-list-tile-content>
                  <v-list-tile-content class="align-end">{{ props.item.atAmount + ' ' + props.item.atCurrencyCode }}</v-list-tile-content>
                </v-list-tile>
                <v-divider></v-divider>
                <v-list-tile>
                  <v-list-tile-content>Date Created</v-list-tile-content>
                  <v-list-tile-content class="align-end">{{ props.item.dateCreated | formatDate }}</v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-flex>
          <v-flex slot="no-data">
            Loading your invoices...
          </v-flex>
        </v-data-iterator>
      </v-layout>

      <v-flex xs12 md10 lg8 hidden-sm-and-down>
        <v-data-table
        :headers="headers"
        :items="invoices"
        hide-actions
        class="elevation-1"
        item-key="invoiceGuid"
        :loading="isLoading"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-left pr-0">
              <v-avatar size="30px" :color="props.item.state | avatarColor">
                <v-icon size="22px" dark>{{ props.item.state | stateIcon }}</v-icon>
              </v-avatar>
            </td>
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-right">{{ props.item.fiatAmount + ' ' + props.item.fiatCurrencyCode }}</td>
            <td class="text-xs-left pr-0">{{ props.item.accepting }}</td>
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
          <v-btn color="red darken-1" flat="flat" @click.native="deleteItemConrmed()">Delete</v-btn>
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
    <v-snackbar top color="error" v-model="errorOnSave">
      Something happened: {{ errorMessage }}
      <v-btn flat @click="errorOnSave = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
// import moment from 'moment';

export default {
  name: 'Dashboard',
  data () {
    return {
      isLoading: false,
      headers: [
        {value: 'state', align: 'left', class: 'pr-0', width: '40px'},
        {text: 'Invoice Name', value: 'name', align: 'left'},
        {text: 'Amount', value: 'atAmount', align: 'right'},
        {text: 'Accepting', value: 'accepting', class: 'pr-0', width: '140px'},
        {text: 'Status', value: 'state', width: '120px'},
        {text: 'Date Created', value: 'dateCreated', width: '150px'},
        {text: 'Actions', sortable: false, width: '80px'}
      ],
      deletedItem: {},
      deleteDialog: false
    };
  },
  /* mounted () {
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
  }, */
  computed: {
    errorOnSave: {
      get () {
        return this.$store.getters.errorOnSave;
      },
      set (value) {
        this.$store.dispatch('errorOnSaveAction', value);
      }
    },
    errorMessage () {
      return this.$store.getters.errorMessage;
    },
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
    invoices () {
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
    deleteItemConrmed () {
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
<style>
  .table__overflow {
    overflow: hidden;
  }
</style>
