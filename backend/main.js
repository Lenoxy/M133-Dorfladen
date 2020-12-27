"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var mod_ts_1 = require("https://deno.land/x/oak@v6.3.1/mod.ts");
var mod_ts_2 = require("https://deno.land/x/bb64/mod.ts");
var angularBuildPath = '/../frontend/dist/M133-Dorfladen';
var app = new mod_ts_1.Application();
var router = new mod_ts_1.Router();
// Session konfigurieren und starten
//const session = new Session({framework: 'oak'});
//await session.init();
//app.use(session.use()(session));
var products;
console.log('Fetching data from products.json');
await getItemsFromJson();
router
    .get('/api/items', function (context) {
    context.response.body = products;
})
    .get('/api/item/:id', function (context) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log(context.params.id);
        context.response.body = products.find(function (product) {
            return product.id === context.params.id;
        });
        return [2 /*return*/];
    });
}); })
    .post('/api/cart/:id', function (context) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log(context.params.id);
        context.response.body = null;
        return [2 /*return*/];
    });
}); })["delete"]('/api/cart/:id', function (context) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log(context.params.id);
        context.response.body = null;
        return [2 /*return*/];
    });
}); });
app.use(router.routes());
app.listen({ port: 8000 });
// Serve static angular build
app.use(function (context) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, context.send({
                    root: Deno.cwd() + angularBuildPath,
                    index: 'index.html'
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
function getItemsFromJson() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, Deno.readTextFile('./products.json')];
                case 1:
                    products = _b.apply(_a, [_c.sent()]);
                    products.forEach(function (product) {
                        product.imageName = mod_ts_2.Base64.fromFile('images/' + product.imageName).toString();
                    });
                    return [2 /*return*/];
            }
        });
    });
}
