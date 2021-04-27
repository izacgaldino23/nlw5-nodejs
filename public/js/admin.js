const socket = io()
let connectionsUsers = []

socket.on('admin_list_all_users', (connections) => {
	connectionsUsers = connections
	document.getElementById("list_users").innerHTML = ''

	let template = document.getElementById('template').innerHTML

	connections.forEach(connection => {
		const rendered = Mustache.render(template, {
			email: connection.user.email,
			id: connection.socket_id
		})

		document.getElementById('list_users').innerHTML += rendered
	})
})

socket.on('admin_receive_message', data => {
	const connection = connectionsUsers.find(connection => connection.socket_id === data.socket_id)

	const user_message_template = document.getElementById('user_message_template').innerHTML

	const divMessages = document.getElementById(`allMessages${connection.user_id}`)

	const rendered = Mustache.render(user_message_template, {
		email: connection.user.email,
		text: data.message.text,
		date: () => {
			return dayjs(data.message.created_at).format('DD/MM/YYYY HH:mm:ss')
		}
	})

	divMessages.innerHTML += rendered
})

function call (id) {
	const connection = connectionsUsers.find(connection => connection.socket_id === id)

	const template = document.getElementById('admin_template').innerHTML

	const rendered = Mustache.render(template, {
		email: connection.user.email,
		id: connection.user_id,
	})

	document.getElementById('supports').innerHTML += rendered


	const params = {
		user_id: connection.user_id
	}

	socket.emit('admin_user_in_support', params)

	socket.emit('admin_list_messages_by_user', params, messages => {
		const divMessages = document.getElementById(`allMessages${connection.user_id}`)

		const user_message_template = document.getElementById('user_message_template').innerHTML
		const admin_message_template = document.getElementById('admin_message_template').innerHTML

		messages.forEach(message => {
			if (message.admin_id === null) {
				const rendered = Mustache.render(user_message_template, {
					email: connection.user.email,
					text: message.text,
					date: () => {
						return dayjs(message.created_at).format('DD/MM/YYYY HH:mm:ss')
					}
				})

				divMessages.innerHTML += rendered
			} else {
				const rendered = Mustache.render(admin_message_template, {
					text: message.text,
					date: () => {
						return dayjs(message.created_at).format('DD/MM/YYYY HH:mm:ss')
					}
				})

				divMessages.innerHTML += rendered
			}
		})
	})
}

function sendMessage (user_id) {
	const text = document.getElementById(`send_message_${user_id}`)

	const params = {
		text: text.value,
		user_id
	}

	socket.emit('send_message_admin', params)

	const divMessages = document.getElementById(`allMessages${user_id}`)

	const admin_message_template = document.getElementById('admin_message_template').innerHTML

	const rendered = Mustache.render(admin_message_template, {
		text: text.value,
		date: () => {
			return dayjs().format('DD/MM/YYYY HH:mm:ss')
		}
	})

	text.value = ''

	divMessages.innerHTML += rendered
}