import { Column, CreateDateColumn, Entity, PrimaryColumn, TreeChildren, UpdateDateColumn } from "typeorm"
import { v4 as uuid } from 'uuid'

@Entity('settings')
class Setting {
    @PrimaryColumn() // Se o nome no banco for diferente eu preciso indicar isso aqui
    id: string

    @Column()
    username: string

    @Column()
    chat: boolean

    @UpdateDateColumn()
    created_at: Date

    @CreateDateColumn()
    updated_at: Date

    constructor() {
        if (!this.id) {
            this.id = uuid()
        }
    }
}

export { Setting }