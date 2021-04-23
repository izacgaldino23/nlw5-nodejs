import { Socket } from 'socket.io'
import { io } from '../http'
import { ConnectionsService } from '../services/ConnectionsService'
import { MessagesService } from '../services/MessagesService'
import { UsersService } from '../services/UsersService'

interface IParams {
    text: string
    email: string
}

io.on('connect', (socket: Socket) => {
    const connectionsService = new ConnectionsService()
    const usersService = new UsersService()
    const messagesService = new MessagesService()

    socket.on('cliente_first_access', async (params) => {
        const socket_id = socket.id
        const { text, email } = params as IParams

        const user = await usersService.create({ email })

        const connection = await connectionsService.findByUserID(user.id)

        if (!connection) {
            await connectionsService.create({
                socket_id,
                user_id: user.id,
            })
        } else {
            connection.socket_id = socket_id

            await connectionsService.create(connection)
        }

        await messagesService.create({
            text,
            user_id: user.id,
        })
    })
})