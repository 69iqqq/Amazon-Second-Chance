"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    prisma;
    modelName;
    constructor(prisma, modelName) {
        this.prisma = prisma;
        this.modelName = modelName;
    }
    get model() {
        return this.prisma[this.modelName];
    }
    async findById(id) {
        return this.model.findUnique({ where: { id } });
    }
    async findAll(params) {
        return this.model.findMany(params);
    }
    async create(data) {
        return this.model.create({ data });
    }
    async update(id, data) {
        return this.model.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return this.model.delete({
            where: { id },
        });
    }
    async softDelete(id) {
        return this.model.update({
            where: { id },
            data: { deletedAt: new Date(), status: 'INACTIVE' },
        });
    }
}
exports.BaseRepository = BaseRepository;
