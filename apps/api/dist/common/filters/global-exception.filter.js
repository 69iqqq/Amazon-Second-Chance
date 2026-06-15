"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GlobalExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let GlobalExceptionFilter = GlobalExceptionFilter_1 = class GlobalExceptionFilter {
    logger = new common_1.Logger(GlobalExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let code = 'INTERNAL_ERROR';
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            message = typeof res === 'string' ? res : res.message || exception.message;
            code = typeof res === 'string' ? 'HTTP_ERROR' : res.error || 'HTTP_ERROR';
        }
        else if (exception instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            switch (exception.code) {
                case 'P2002':
                    status = common_1.HttpStatus.CONFLICT;
                    message = `Unique constraint failed on the fields: ${exception.meta?.target?.join(', ')}`;
                    code = 'UNIQUE_CONSTRAINT_ERROR';
                    break;
                case 'P2025':
                    status = common_1.HttpStatus.NOT_FOUND;
                    message = 'Record to update or delete does not exist.';
                    code = 'NOT_FOUND_ERROR';
                    break;
                default:
                    status = common_1.HttpStatus.BAD_REQUEST;
                    message = `Database error: ${exception.message}`;
                    code = 'DATABASE_ERROR';
            }
        }
        else if (exception instanceof Error) {
            message = exception.message;
        }
        this.logger.error(`${request.method} ${request.url} [${status}] - ${message}`, exception instanceof Error ? exception.stack : '');
        response.status(status).json({
            success: false,
            error: {
                code,
                message,
                timestamp: new Date().toISOString(),
                path: request.url,
            },
        });
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = GlobalExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
