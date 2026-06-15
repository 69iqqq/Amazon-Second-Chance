"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeInsModule = void 0;
const common_1 = require("@nestjs/common");
const trade_ins_service_1 = require("./trade-ins.service");
const trade_ins_controller_1 = require("./trade-ins.controller");
const trade_ins_repository_1 = require("./trade-ins.repository");
let TradeInsModule = class TradeInsModule {
};
exports.TradeInsModule = TradeInsModule;
exports.TradeInsModule = TradeInsModule = __decorate([
    (0, common_1.Module)({
        controllers: [trade_ins_controller_1.TradeInsController],
        providers: [trade_ins_service_1.TradeInsService, trade_ins_repository_1.TradeInsRepository],
        exports: [trade_ins_service_1.TradeInsService],
    })
], TradeInsModule);
