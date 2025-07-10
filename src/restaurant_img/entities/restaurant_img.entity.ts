import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Restaurant } from '../../restaurant/entities/restaurant.entity';

interface RestaurantImgCreationAttrs {
  restaurant_id: number;
  image_url: string;
  is_primary?: boolean;
}

@Table({ tableName: 'restaurant_imgs', timestamps: true })
export class RestaurantImg extends Model<
  RestaurantImg,
  RestaurantImgCreationAttrs
> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ForeignKey(() => Restaurant)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare restaurant_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare image_url: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare is_primary: boolean;

  @BelongsTo(() => Restaurant)
  restaurant: Restaurant;
}
