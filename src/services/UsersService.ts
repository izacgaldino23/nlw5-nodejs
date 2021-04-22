import { getCustomRepository, Repository } from "typeorm";
import { User } from "../entities/User";
import { UsersRepository } from "../repositories/UsersRepository";

interface IUserCreate {
    email: string
}

class UsersService {
    private repository: Repository<User>

    constructor() {
        this.repository = getCustomRepository(UsersRepository)
    }

    async create({ email }: IUserCreate) {
        // Verificar se usuário existe
        const userExists = await this.repository.findOne({
            email
        })

        // Se não exister, salvar no DB
        if (userExists) {
            return userExists
        }

        const user = this.repository.create({
            email
        })

        await this.repository.save(user)

        // Se existir retornar usuário
        return user
    }
}

export { UsersService }