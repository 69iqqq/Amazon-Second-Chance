import { PrismaService } from '../../modules/database/prisma.service';
export declare abstract class BaseRepository<T, CreateDTO, UpdateDTO> {
    protected readonly prisma: PrismaService;
    protected readonly modelName: string;
    constructor(prisma: PrismaService, modelName: string);
    protected get model(): any;
    findById(id: string): Promise<T | null>;
    findAll(params: {
        skip?: number;
        take?: number;
        where?: any;
        orderBy?: any;
    }): Promise<T[]>;
    create(data: CreateDTO): Promise<T>;
    update(id: string, data: UpdateDTO): Promise<T>;
    delete(id: string): Promise<T>;
    softDelete(id: string): Promise<T>;
}
