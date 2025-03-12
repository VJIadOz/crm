import {Contact} from "./contact.type";

export type User = {
    name: string;
    surname: string;
    lastName?: string;
    contacts: Contact[];
    id?: string;
    updatedAt?: Date;
    createdAt?: Date;
}