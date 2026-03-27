import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): {
        id: number;
        name: string;
    }[];
    findOne(id: string): {
        id: number;
        name: string;
    } | undefined;
    create(body: {
        name: string;
    }): {
        name: string;
        id: number;
    };
    update(id: string, body: {
        name: string;
    }): string | {
        id: number;
        name: string;
    };
    remove(id: string): string;
}
