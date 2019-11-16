import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class TemplateEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  pageHeight: number;

  @Column()
  pageWidth: number;

  // @Column()
  // maxRows: number;

  @Column({ type: 'text' })
  jsonFabric: string;

  @Column({ type: 'text' })
  jsonColumns: string;
}
