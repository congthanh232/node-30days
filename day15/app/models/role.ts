import { RoleSchema } from '#database/schema'
import { manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class Role extends RoleSchema {
  @manyToMany(() => User, {
    pivotTable: 'role_user',
  })
  declare users: ManyToMany<typeof User>
}
