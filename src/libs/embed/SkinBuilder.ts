import { BaseMessageOptions } from "discord.js";
import { SkinModule } from "../../models/user/skin";

export default class SkinBuilder {
    public static getForm(skin : SkinModule) : BaseMessageOptions {
        return {
            content : "Test"
        }
    }
}