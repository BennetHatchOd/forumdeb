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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const setting_1 = require("../../srs/setting");
const app_1 = require("../../srs/app");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongodb_1 = require("mongodb");
const Authorization = {
    value: "Basic YWRtaW46cXdlcnR5",
    false: "Df fef"
};
let server;
let uri;
let client;
describe('/blogs', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        server = yield mongodb_memory_server_1.MongoMemoryServer.create({
            binary: {
                version: '4.4.0',
            },
        });
        uri = server.getUri();
        client = new mongodb_1.MongoClient(uri);
        yield client.connect();
        yield (0, supertest_1.default)(app_1.app).delete(setting_1.URL_PATH.deleteAll);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield server.stop();
    }));
    it('should return 200 and empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .get(setting_1.URL_PATH.blogs)
            .expect(setting_1.HTTP_STATUSES.OK_200, []);
    }));
    let createdItem1;
    it('should return 201 and created object', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            name: "The first",
            description: "Copolla",
            websiteUrl: "https://google.dcfghgfhgc.com",
        };
        let createdResponse = yield (0, supertest_1.default)(app_1.app)
            .post(setting_1.URL_PATH.blogs)
            .set("Authorization", Authorization.value)
            .send(data)
            .expect(setting_1.HTTP_STATUSES.CREATED_201);
        createdItem1 = createdResponse.body;
        expect(createdItem1).toEqual({
            id: expect.any(String),
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl,
            createdAt: expect.any(String),
            isMembership: false
        });
    }));
    let createdItem2;
    it('should return 201 and created object', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            name: "The second",
            description: "this blog by Tarantino",
            websiteUrl: "https://google.dcfghgfhgc.com"
        };
        let createdResponse2 = yield (0, supertest_1.default)(app_1.app)
            .post(setting_1.URL_PATH.blogs)
            .set("Authorization", Authorization.value)
            .send(data)
            .expect(setting_1.HTTP_STATUSES.CREATED_201);
        createdItem2 = createdResponse2.body;
        expect(createdItem2).toEqual({
            id: expect.any(String),
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl,
            createdAt: expect.any(String),
            isMembership: false
        });
    }));
    let createdItem3;
    it('should return 401', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            name: "The thirt",
            description: "this blog not by Tarantino",
            websiteUrl: "https://google.com"
        };
        yield (0, supertest_1.default)(app_1.app)
            .post(setting_1.URL_PATH.blogs)
            .send(data)
            .expect(setting_1.HTTP_STATUSES.NO_AUTHOR_401);
    }));
    it('should return 401', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            name: "The thirt",
            description: "this blog not by Tarantino",
            websiteUrl: "https://google.com"
        };
        yield (0, supertest_1.default)(app_1.app)
            .post(setting_1.URL_PATH.blogs)
            .set("Authorization", Authorization.false)
            .send(data)
            .expect(setting_1.HTTP_STATUSES.NO_AUTHOR_401);
    }));
    it('should return 201 and created object', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            name: "The thirt",
            description: "this blog not by Tarantino",
            websiteUrl: "https://google.com"
        };
        let createdResponse2 = yield (0, supertest_1.default)(app_1.app)
            .post(setting_1.URL_PATH.blogs)
            .set("Authorization", Authorization.value)
            .send(data)
            .expect(setting_1.HTTP_STATUSES.CREATED_201);
        createdItem3 = createdResponse2.body;
        expect(createdItem3).toEqual({
            id: expect.any(String),
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl,
            createdAt: expect.any(String),
            isMembership: false
        });
    }));
    it('shouldn\'t delete blog and return 401', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .delete(`${setting_1.URL_PATH.blogs}/${createdItem3.id}`)
            .set("Authorization", Authorization.false)
            .expect(setting_1.HTTP_STATUSES.NO_AUTHOR_401);
    }));
    it('should delete blog and return 204', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .delete(`${setting_1.URL_PATH.blogs}/${createdItem3.id}`)
            .set("Authorization", Authorization.value)
            .expect(setting_1.HTTP_STATUSES.NO_CONTENT_204);
    }));
    it("shouldn't delete not exist blog and return 404", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .delete(`${setting_1.URL_PATH.blogs}/55`)
            .set("Authorization", Authorization.value)
            .expect(setting_1.HTTP_STATUSES.NOT_FOUND_404);
    }));
    it('should watch not exist blog and return 404', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .get(`${setting_1.URL_PATH.blogs}/mjjhjn`)
            .expect(setting_1.HTTP_STATUSES.NOT_FOUND_404);
    }));
    it('should watch not exist blog and return 404', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .get(`${setting_1.URL_PATH.blogs}/123456789012345678901234`)
            .expect(setting_1.HTTP_STATUSES.NOT_FOUND_404);
    }));
    it('should watch the blog return 200 and object', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .get(`${setting_1.URL_PATH.blogs}/${createdItem1.id}`)
            .expect(setting_1.HTTP_STATUSES.OK_200);
        expect(res.body).toEqual(createdItem1);
    }));
    it('should return 200 and array of all object', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .get(setting_1.URL_PATH.blogs)
            .expect(setting_1.HTTP_STATUSES.OK_200, [createdItem1, createdItem2]);
    }));
    it("shouldn't create a blog with incorrect datas and  return 400 and return object of errors", () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            name: "",
            description: "0123",
            websiteUrl: "https://googlecom"
        };
        let res = yield (0, supertest_1.default)(app_1.app)
            .post(setting_1.URL_PATH.blogs)
            .set("Authorization", Authorization.value)
            .send(data)
            .expect(setting_1.HTTP_STATUSES.BAD_REQUEST_400);
        expect(res.body).toEqual({
            "errorsMessages": [
                {
                    "message": expect.any(String),
                    "field": "name"
                },
                {
                    "message": expect.any(String),
                    "field": "websiteUrl"
                },
            ]
        });
    }));
    it("shouldn't create a blog with incorrect datas and  return 400 and return object of errors", () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            name: "1234567890123456",
            description: "0123",
            websiteUrl: "ttps://google123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890.com432"
        };
        let res = yield (0, supertest_1.default)(app_1.app)
            .post(setting_1.URL_PATH.blogs)
            .set("Authorization", Authorization.value)
            .send(data)
            .expect(setting_1.HTTP_STATUSES.BAD_REQUEST_400);
        expect(res.body).toEqual({
            "errorsMessages": [
                {
                    "message": expect.any(String),
                    "field": "name"
                },
                {
                    "message": expect.any(String),
                    "field": "websiteUrl"
                },
            ]
        });
    }));
    it('should edit the fisrt blog return 204', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            name: "Correct",
            description: "Gaidai",
            websiteUrl: "https://fig.dedf.cfghgfhgc.net/34"
        };
        yield (0, supertest_1.default)(app_1.app)
            .put(`${setting_1.URL_PATH.blogs}/${createdItem1.id}`)
            .set("Authorization", Authorization.value)
            .send(data)
            .expect(setting_1.HTTP_STATUSES.NO_CONTENT_204);
        createdItem1.name = data.name;
        createdItem1.description = data.description;
        createdItem1.websiteUrl = data.websiteUrl;
    }));
    it('should edit the not exist blog and return 404', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            name: "The mistake",
            description: "Gaidai",
            websiteUrl: "https://fig.dedf.cfghgfhgc.net/34"
        };
        yield (0, supertest_1.default)(app_1.app)
            .put(`${setting_1.URL_PATH.blogs}/454`)
            .set("Authorization", Authorization.value)
            .send(data)
            .expect(setting_1.HTTP_STATUSES.NOT_FOUND_404);
    }));
    it('should return 200 and array of all object', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .get(setting_1.URL_PATH.blogs)
            .expect(setting_1.HTTP_STATUSES.OK_200, [createdItem1, createdItem2]);
    }));
});
