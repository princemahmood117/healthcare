

import { PrismaCountArgs, PrismaFindManyArgs } from "../interfaces/query.interface"


//  T = model ; 
export class QueryBuilder <
T,
TWhereInput = Record<string, unknown>,   // string = field, unknown = oi field er value
TInclude = Record<string, unknown>


> {

    private query : PrismaFindManyArgs;
    private countQuery : PrismaCountArgs; 
    private page : number = 1 ;
    private limit : number = 10;
    private skip : number = 0;
    private sortBy : string = 'createdAt';
    private sortOrder : "asc" | "desc" = "desc";
    private selectedFields : Record<string, boolean | undefined>;


    constructor() {

        // these are the constructors for the private properties

    }
}