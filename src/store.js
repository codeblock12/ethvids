import Vue from 'vue'
import Vuex from 'vuex'
import Blockchain from './services/blockchain';
import Marketplace from './services/marketplace';
import { waitForAsync } from './utilities';

let market = new Marketplace();
let blockchain = new Blockchain();

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentAccount: web3.eth.accounts[0] || 'Account Loading...',
    accountRole: 'Role Loading...',
    storefronts: []
  },
  mutations: {
    setCurrentAccount(state, account){
      state.currentAccount = account;
    },
    setAccountBalance(state, balance){
      state.accountBalance = balance;
    },
    setAccountRole(state, role){
      state.accountRole = role;
    },
    setStorefronts(state, storefronts) {
      state.storefronts = storefronts
    } 
  },
  actions: {
    async getCurrentAccount({ commit, dispatch, state }){
      await market.init();
      let account = await blockchain.getCurrentAccount();
      commit('setCurrentAccount', account);
      let role = await market.getRoleByAddress(account);
      commit('setAccountRole', Number(role))
    },
    setAdminRole({ state }, address){
      market.setAdminRoleByAddress(address, state.currentAccount)
      .then(success => console.log('successfully set admin role'))
    },
    removeAdminRole({ state }, address){
      market.removeAdminRoleByAddress(address, state.currentAccount)
      .then(success => console.log('successfully remove admin role'))
    },
    setStoreOwnerRole({ state }, address){
      market.setStoreOwnerByAddress(address, state.currentAccount)
      .then(success => console.log('successfully set admin role'))
    },
    removeStoreOwnerRole({ state }, address){
      market.removeStoreOwnerByAddress(address, state.currentAccount)
      .then(success => console.log('successfully remove admin role'))
    },
    getStorefronts({ commit } ){
      market.getStorefronts()
      .then(storefronts => commit('setStorefronts', storefronts))
    },    
    createStorefront({ state }, name){
      market.createStorefrontByName(name, state.currentAccount)
      .then(success => console.log('successfully created new storefront'))
    },                 
  }
})