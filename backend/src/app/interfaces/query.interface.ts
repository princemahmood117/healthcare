/* eslint-disable @typescript-eslint/no-explicit-any */


export interface PrismaFindManyArgs {
    where ? : Record<string, unknown>;  // Record means Object
    include ? : Record<string, unknown>;
    select ? : Record<string, boolean | Record<string, unknown>>;  // nested object may present
    orderBy ? : Record<string, unknown> | Record<string, unknown[]>
    skip ? : number;
    take ? : number;
    cursor ? : Record<string, unknown>;
    distinct ? : string[] | string;
    [key:string] : unknown;
}


export interface PrismaCountArgs {
    where ? : Record<string, unknown>;
    include ? : Record<string, unknown>;
    select ? : Record<string, boolean | Record<string, unknown>>;  // nested object may present
    orderBy ? : Record<string, unknown> | Record<string, unknown[]>
    skip ? : number;
    take ? : number;
    cursor ? : Record<string, unknown>;
    distinct ? : string[] | string;
    [key:string] : unknown;
}



export interface prismaModelDelegate {
    findMany(args? : any) : Promise<any[]>;  // promise return korbe any type
    count(args? : any) : Promise<number>;      // promise return korbe number type
}

export interface IQueryParams {
    searchTerm ? : string;
    page ? : string;
    limit ? : string;
    sortBy ? : string;
    sortOrder ? : "asc" | "desc"; 
    fields ? : string;
    includes ? : string;
    [key: string] : string | undefined
}


export interface IQueryConfig {
    searchableFields ? : string[];
    filterableFields ? : string[];
}