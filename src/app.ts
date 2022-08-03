import express, { Express } from "express";
import { Server } from "http";
import { UserController } from "./users/user.controller";
import { LoggerService } from "./logger/logger.service";
import { ExceptionFilter } from "./errors/exception.filter";
import { loggerInterface } from "./logger/logger.interface";

export class App {
    app: Express;
    port: number;
    server: Server;
    logger: loggerInterface;
    userController: UserController;
    exceptionFilter: ExceptionFilter;

    constructor(
        logger: loggerInterface,
        userController: UserController,
        exceptionFilter: ExceptionFilter
    ) {
        this.port = 8000;
        this.app = express();
        this.logger = logger;
        this.userController = userController;
        this.exceptionFilter = exceptionFilter;
    }

    useRoutes() {
        this.app.use("/users", this.userController.router);
    }

    useExceptionFilters() {
        this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
    }

    public async init() {
        this.useRoutes();
        this.useExceptionFilters();
        this.server = this.app.listen(this.port);
        this.logger.log(`server work to port ${this.port}`);
    }
}
