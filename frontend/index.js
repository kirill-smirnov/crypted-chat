import io from 'socket.io-client';
import Vue from 'vue/dist/vue.esm.js';
import * as encrypt from '../lib/encrypt.js';

import './styles.scss';
import './modal.scss';

const socket = io('http://localhost:3000/');

var app = new Vue({
  el: '#app',
  data: {
  	user: {
  		pair: encrypt.getPair(),
			name: '',
			message: '',
  	},
		messages: {},
		choosedUser: {},
		users: {},
  },
  methods: {
		modalProcessing: function() {
			document.getElementById('myModal').style.display = "none";
			this.login();
		},
		login: function() {
		  socket.emit('login', {name: this.user.name, publicKey: this.user.pair.publicKey});
		},
		messageProcessing: function() {
			if (!this.messages[this.choosedUser])
				this.messages[this.choosedUser.name] = [];
			//TODO: ENCRYPT
      let nonce = encrypt.createNonce();
      let msg = encrypt.encrypt(
        this.user.message,
        nonce,
        this.user.pair.secretKey,
        this.choosedUser.publicKey
      );

			this.messages[this.choosedUser.name]
				.push(`${this.user.name}: ${this.user.message}`);

      this.user.message = '';
			socket.emit('message', {
				sender: this.user.name, 
				message: msg,
				nonce,
				dest: this.choosedUser.name
			});
		},
		chooseUser: function(username) {
			if (username != this.user.name) {
				for(let id in this.users) {
					if(this.users[id].name == username)
						this.choosedUser = this.users[id];
				}
			}
			else this.choosedUser = {};
		}
  }
});

socket.on('updateOnline', data => {
  app.$data.users = JSON.parse(data);
})

socket.on('message', data => {
	if (!app.$data.messages[data.sender])
		app.$data.messages[data.sender] = [];
	//TODO: DECRYPT
	let msg = encrypt.decrypt(
		data.message, 
		data.nonce, 
		app.$data.users[data.senderId].publicKey, 
		app.$data.user.pair.secretKey
	);
	app.$data.messages[data.sender].push(`${data.sender}: ${msg}`);
	app.$forceUpdate();
})