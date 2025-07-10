import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface IUserCreationAttr {
  full_name: string;
  email: string;
  password: string;
  phone_number: string;
  role: 'super_admin' | 'admin' | 'manager' | 'client';
  is_verified?: boolean;
  is_active?: boolean;
  activation_link?: string;
  refresh_token?: string;
}

@Table({ tableName: 'users', timestamps: true })
export class User extends Model<User, IUserCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare full_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    unique: true,
  })
  declare phone_number: string;

  @Column({
    type: DataType.ENUM('super_admin','admin', 'manager', 'client'),
    allowNull: false,
  })
  declare role: 'super_admin' | 'admin' | 'manager' | 'client';

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare is_verified: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare is_active: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare activation_link: string | null;

  @Column({
    type: DataType.STRING(2000),
    allowNull: true,
  })
  declare refresh_token: string | null;
}
