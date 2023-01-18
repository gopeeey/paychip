import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    DataTypes,
    UUIDV4,
    Attributes,
    CreationAttributes,
} from "sequelize";
import db from "..";
import { UserProfileModelInterface } from "../../contracts/interfaces/db_logic";

class UserProfile
    extends Model<InferAttributes<UserProfile>, InferCreationAttributes<UserProfile>>
    implements UserProfileModelInterface
{
    declare id: CreationOptional<string>;
    declare name: string;
    declare email: string;
    declare password: string;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date | null>;
}

UserProfile.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: UUIDV4,
        },
        name: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(300),
            allowNull: false,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
    },
    { sequelize: db, paranoid: true, modelName: "UserProfile" }
);

export default UserProfile;
export type UserProfileAttributes = Attributes<UserProfile>;
export type UserProfileCreationAttributes = CreationAttributes<UserProfile>;
