import { User as DiscordUser } from 'discord.js';
import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { ExperienceModule, ExperienceSchema } from './experience';
import { AttributesModule, AttributesSchema } from './attributes';
import { SkinModule, SkinSchema } from './skin';
import PartManager from '../../libs/montage/PartManager';
import { Missions, MissionsSchema } from './missions';
import { InventoryModule, InventorySchema } from './inventory';
import { StuffModule, StuffSchema } from './stuff';
import { ShopModule, ShopSchema } from '../item/shop';
import { ItemModel } from '../item/item';
import { TowerModule, TowerSchema } from './tower';
import StuffMontage from '../../libs/montage/StuffMontage';

// Données du document
interface IUser {
    id: string;
    gold: number;
    experience: ExperienceModule;
    attributes: AttributesModule;
    skin: SkinModule;
    mission: Missions;
    shop: ShopModule;
    inventory: InventoryModule;
    stuff: StuffModule;
    tower: TowerModule;
}

// Méthodes sur l'instance
interface IUserMethods {
    buyItem(n: number): Promise<boolean>;
    sellItem(n: number): Promise<string>;
    equipItem(n: number): Promise<void>;
    getTotalAttributes(): AttributesModule;
    getImage(): Promise<string>;
}

// Méthodes statiques
interface IUserModel extends Model<IUser, object, IUserMethods> {
    findByDiscordUser(user: DiscordUser): Promise<User | null>;
}

export type User = HydratedDocument<IUser, IUserMethods>;

const UserSchema: Schema = new Schema<IUser, object, IUserMethods>(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        gold: {
            type: Number,
            required: true,
            default: 0,
        },
        experience: {
            type: ExperienceSchema,
            required: true,
            default: () => ({}),
        },
        attributes: {
            type: AttributesSchema,
            required: true,
            default: () => ({}), // On doit mettre ça pour que ça prenne les valeurs par défaut du schéma enfant
        },
        skin: {
            type: SkinSchema,
            required: true,
            default: PartManager.getRandomSkin(),
        },
        mission: {
            type: MissionsSchema,
            required: true,
            default: () => ({}),
        },
        shop: {
            type: ShopSchema,
            required: true,
            default: () => ({}),
        },
        inventory: {
            type: InventorySchema,
            required: true,
            default: () => ({}),
        },
        stuff: {
            type: StuffSchema,
            required: true,
            default: () => ({}),
        },
        tower: {
            type: TowerSchema,
            required: true,
            default: () => ({}),
        }
    },
    {
        timestamps: true,
    },
);

UserSchema.statics.findByDiscordUser = async (user: DiscordUser): Promise<User | null> => {
    return await UserModel.findOne({
        id: user.id,
    });
};

/**
 * Achète l'item numéro N de la boutique et la place dans l'inventaire
 * @param n
 * @returns
 */
UserSchema.methods.buyItem = async function (n: number): Promise<boolean> {
    if (this.inventory.items.length >= 5) {
        throw new Error('Votre inventaire est déja plein, vous pouvez vendre un item via `/inventory`');
    }

    const item: ItemModel = this.shop.items[n];

    if (!item) {
        throw new Error("Impossible de trouver l'équipement dans la boutique");
    }

    if (item.price > this.gold) {
        throw new Error("Vous n'avez pas assez de pièce pour acheter cette équipement");
    }

    this.inventory.items.push(item);

    this.shop.items.splice(n, 1);

    this.gold -= item.price;

    await this.save();

    return item.level <= this.experience.level;
};

/**
 * Vend l'item numéro N de l'inventaire
 * @param n
 * @returns
 */
UserSchema.methods.sellItem = async function (n: number): Promise<string> {
    const item: ItemModel = this.inventory.items[n];

    if (!item) {
        return "Impossible de trouver l'équipement dans votre inventaire";
    }

    this.inventory.items.splice(n, 1);

    this.gold += item.getSellPrice();

    await this.save();

    return 'Vente réussie';
};

/**
 * Equipe l'item numéro N de l'inventaire, si un équipement est déja équipé il va dans l'inventaire
 * @param n
 */
UserSchema.methods.equipItem = async function (n: number): Promise<void> {
    const inventoryItem = this.inventory.items[n];
    const stuffItem = this.stuff.getItemByType(inventoryItem.type);

    if (inventoryItem.level > this.experience.level) {
        return;
    }

    if (stuffItem === null) {
        this.inventory.items.splice(n, 1);
    } else {
        this.inventory.items[n] = stuffItem;
    }

    this.stuff.equipItem(inventoryItem);

    StuffMontage.generateImage(this as User);

    await this.save();
};

/**
 * Compte toutes les caractéristiques en prenant en compte le stuff et les points de carac du joueur
 * @returns
 */
UserSchema.methods.getTotalAttributes = function (): AttributesModule {
    return this.attributes.add(this.stuff.getTotalAttributes());
};

UserSchema.methods.getImage = async function (): Promise<string> {
    const skin = await StuffMontage.getImage(this as User);

    return skin;
};

const UserModel = model<IUser, IUserModel>('User', UserSchema);

export { UserModel };
