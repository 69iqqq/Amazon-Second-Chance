"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GradingModule = void 0;
const common_1 = require("@nestjs/common");
const grading_service_1 = require("./grading.service");
const grading_controller_1 = require("./grading.controller");
const grading_repository_1 = require("./grading.repository");
const products_module_1 = require("../products/products.module");
const external_services_module_1 = require("../../common/external-services.module");
let GradingModule = class GradingModule {
};
exports.GradingModule = GradingModule;
exports.GradingModule = GradingModule = __decorate([
    (0, common_1.Module)({
        imports: [products_module_1.ProductsModule, external_services_module_1.ExternalServicesModule],
        controllers: [grading_controller_1.GradingController],
        providers: [grading_service_1.GradingService, grading_repository_1.GradingRepository],
        exports: [grading_service_1.GradingService],
    })
], GradingModule);
