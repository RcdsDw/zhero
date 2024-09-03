import {
    Table,
    Column,
    Model,
    DataType,
    HasMany,
} from 'sequelize-typescript'
import { ZheroItem } from './item';

@Table
export class ZheroUser extends Model {
    @Column({
        type: DataType.STRING,
        primaryKey: true,
    })
    id?: string;

    @Column(DataType.STRING)
    name?: string

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
    level?: number

    @Column(DataType.FLOAT)
    gold?: number

    @HasMany(() => ZheroItem)
    items?: ZheroItem[]
}