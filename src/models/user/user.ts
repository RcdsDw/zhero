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
}

// Méthodes sur l'instance
interface IUserMethods {
    buyItem(n: number): Promise<boolean>;
    sellItem(n: number): Promise<string>;
    equipItem(n: number): Promise<void>;
    getTotalAttributes() : AttributesModule;
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

UserSchema.methods.equipItem = async function (n: number): Promise<void> {
    const inventoryItem = this.inventory.items[n];
    const stuffItem = this.stuff.getItemByType(inventoryItem.type);

    if (stuffItem === null) {
        this.inventory.items.splice(n, 1);
    } else {
        this.inventory.items[n] = stuffItem;
    }

    this.stuff.equipItem(inventoryItem);

    await this.save();
};

UserSchema.methods.getTotalAttributes = function (): AttributesModule {
    return this.stuff.getTotalAttributes();
};

const UserModel = model<IUser, IUserModel>('User', UserSchema);

export { UserModel };
