import { PrismaService } from '../../modules/database/prisma.service';

export abstract class BaseRepository<T, CreateDTO, UpdateDTO> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly modelName: string,
  ) {}

  protected get model(): any {
    return (this.prisma as any)[this.modelName];
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({ where: { id } });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  }): Promise<T[]> {
    return this.model.findMany(params);
  }

  async create(data: CreateDTO): Promise<T> {
    return this.model.create({ data });
  }

  async update(id: string, data: UpdateDTO): Promise<T> {
    return this.model.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<T> {
    return this.model.delete({
      where: { id },
    });
  }

  async softDelete(id: string): Promise<T> {
    return this.model.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'INACTIVE' },
    });
  }
}
