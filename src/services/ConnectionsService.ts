import { getCustomRepository, Repository } from "typeorm"
import { Connection } from "../entities/Connection"
import { ConnectionRepository } from "../repositories/ConnectionsRespository"

interface IConnectionCreate {
    socket_id: string
    user_id: string
    admin_id?: string
    id?: string
}

class ConnectionsService {
    private repository: Repository<Connection>

    constructor() {
        this.repository = getCustomRepository(ConnectionRepository)
    }

    async create({ socket_id, user_id, admin_id, id }: IConnectionCreate) {
        const connection = this.repository.create({
            admin_id,
            id,
            socket_id,
            user_id,
        })

        await this.repository.save(connection)

        return connection
    }

    async findByUserID(user_id: string) {
        const connection = await this.repository.findOne({
            user_id,
        })

        return connection
    }

    async findAllWithoutAdmin() {
        const list = await this.repository.find({
            where: { admin_id: null },
            relations: ['user'],
        })

        return list
    }

    async findBySocketID(socket_id: string) {
        const connection = await this.repository.findOne({
            socket_id
        })

        return connection
    }

    async updateAdminID(user_id: string, admin_id: string) {
        await this.repository.createQueryBuilder().
            update(Connection).
            set({ admin_id }).
            where('user_id = :user_id', { user_id }).
            execute()
    }

    async disconnectAdmin(admin_id: string) {
        await this.repository.createQueryBuilder().
            update(Connection).
            set({ admin_id: null }).
            where('admin_id = :admin_id', { admin_id }).
            execute()
    }
}

export { ConnectionsService }