class UserList {
	constructor() {
		this.list = {};
	}

	add(id) {
		let user = {};

		this.list[id] = user;
	}

	remove(id) {
		delete this.list[id];
	}

	// setPublicKey(id, key) {
	// 	this.list[id].publicKey = key;
	// }
	update(id, data) {
		this.list[id] = data;
	}

	getByUsername(name) {
		for (let id in this.list) {
			if (this.list[id].name == name)
				return id;
		}
	}

	readable() {
		return JSON.stringify(this.list)
	}
}

let users = new UserList();

export { users };