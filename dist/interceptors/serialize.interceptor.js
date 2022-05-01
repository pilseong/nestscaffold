"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Serialize = void 0;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const rxjs_1 = require("rxjs");
function Serialize(dto) {
    return (0, common_1.UseInterceptors)(new SerializeInterceptor(dto));
}
exports.Serialize = Serialize;
class SerializeInterceptor {
    constructor(dto) {
        this.dto = dto;
    }
    intercept(context, next) {
        return next.handle().pipe((0, rxjs_1.map)((data) => {
            console.log('Serialize interceptor performed');
            return (0, class_transformer_1.plainToInstance)(this.dto, data, {
                excludeExtraneousValues: true
            });
        }));
    }
}
exports.default = SerializeInterceptor;
//# sourceMappingURL=serialize.interceptor.js.map