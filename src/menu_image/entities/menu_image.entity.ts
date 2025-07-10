import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  BelongsTo,
} from 'sequelize-typescript';
import { MenuItem } from '../../menu_item/entities/menu_item.entity';

interface MenuImageCreationAttrs {
  menu_item_id: number;
  image_url: string;
}

@Table({ tableName: 'menu_images', timestamps: true })
export class MenuImage extends Model<MenuImage, MenuImageCreationAttrs> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: number;

  @ForeignKey(() => MenuItem)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare menu_item_id: number;

  @BelongsTo(() => MenuItem)
  menu_item: MenuItem;

  @Column({ type: DataType.STRING, allowNull: false })
  declare image_url: string;
}
