import {
    Table,
    Column,
    Model,
    DataType,
    BelongsTo,
} from 'sequelize-typescript'
import { ZheroUser } from './user';

@Table
export class ZheroItem extends Model {
    @Column({
        type: DataType.STRING,
        primaryKey: true,
    })
    id?: string;

    @Column(DataType.STRING)
    name?: string

    @Column(DataType.STRING)
    desc?: string

    @Column(DataType.STRING)
    type?: string
    
    @Column(DataType.DATE)
    created_at?: Date
    
    @Column(DataType.DATE)
    updated_at?: Date

    @Column(DataType.STRING)
    strength?: string

    @Column(DataType.FLOAT)
    magic?: number

    @Column(DataType.FLOAT)
    armor?: number

    @Column(DataType.FLOAT)
    resistance?: number

    @Column(DataType.FLOAT)
    dodge?: number

    @Column(DataType.FLOAT)
    critical?: number

    @Column(DataType.FLOAT)
    luck?: number

    @Column(DataType.FLOAT)
    dexterity?: number

    @Column(DataType.FLOAT)
    speed?: number

    @Column(DataType.FLOAT)
    levelMin?: number

    @Column(DataType.FLOAT)
    levelMax?: number

    @Column(DataType.STRING)
    rarity?: string

    @Column(DataType.FLOAT)
    price?: number

    @BelongsTo(() => ZheroUser)
    user?: ZheroUser
}