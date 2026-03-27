export declare class UsersService {
    private users;
    findAll(): {
        id: number;
        name: string;
    }[];
    findOne(id: number): {
        id: number;
        name: string;
    } | undefined;
    create(user: {
        name: string;
    }): {
        name: string;
        id: number;
    };
    update(id: number, userUpdates: {
        name: string;
    }): string | {
        id: number;
        name: string;
    };
    remove(id: number): string;
}
