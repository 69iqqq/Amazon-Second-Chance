"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DispositionModule = void 0;
const common_1 = require("@nestjs/common");
const disposition_service_1 = require("./disposition.service");
const disposition_controller_1 = require("./disposition.controller");
const disposition_repository_1 = require("./disposition.repository");
let DispositionModule = class DispositionModule {
};
exports.DispositionModule = DispositionModule;
exports.DispositionModule = DispositionModule = __decorate([
    (0, common_1.Module)({
        controllers: [disposition_controller_1.DispositionController],
        providers: [disposition_service_1.DispositionService, disposition_repository_1.DispositionRepository],
        exports: [disposition_service_1.DispositionService],
    })
], DispositionModule);
