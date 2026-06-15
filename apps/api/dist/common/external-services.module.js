"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalServicesModule = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_service_1 = require("./services/cloudinary.service");
const gemini_service_1 = require("./services/gemini.service");
let ExternalServicesModule = class ExternalServicesModule {
};
exports.ExternalServicesModule = ExternalServicesModule;
exports.ExternalServicesModule = ExternalServicesModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [cloudinary_service_1.CloudinaryService, gemini_service_1.GeminiService],
        exports: [cloudinary_service_1.CloudinaryService, gemini_service_1.GeminiService],
    })
], ExternalServicesModule);
