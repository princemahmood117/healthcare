import {
  IQueryConfig,
  IQueryParams,
  PrismaCountArgs,
  PrismaFindManyArgs,
  prismaModelDelegate,
  PrismaStringFilter,
  PrismaWhereConditions,
} from "../interfaces/query.interface";

//  T = model ;
export class QueryBuilder<
  T,
  TWhereInput = Record<string, unknown>, // string = object nanme, unknown = object's value
  TInclude = Record<string, unknown>,
> {
  private query: PrismaFindManyArgs;
  private countQuery: PrismaCountArgs;

  private page: number = 1;
  private limit: number = 10;
  private skip: number = 0;
  private sortBy: string = "createdAt";
  private sortOrder: "asc" | "desc" = "desc";

  private selectedFields: Record<string, boolean | undefined>;

  constructor(
    private model: prismaModelDelegate,
    private queryParams: IQueryParams,
    private config: IQueryConfig,
  ) {
    this.query = {
      where: {},
      include: {},
      orderBy: {},
      skip: 0,
      take: 10,
    };

    this.countQuery = {
      where: {},
    };
  }

  // Searching
  search(): this {
    const { searchTerm } = this.queryParams;
    const { searchableFields } = this.config;

    // handle nesting
    if (searchTerm && searchableFields && searchableFields.length > 0) {
      const searchConditions: Record<string, unknown>[] = searchableFields.map((field) => {

          if (field.includes(".")) {
            const parts = field.split(".");

            // [user.name.] => 2 layer
            if (parts.length === 2) {

              const [relation, nestedField] = parts;

              const stringFilter: PrismaStringFilter = {

                contains: searchTerm,
                mode: "insensitive" as const,
              };

              return {
                [relation]: {
                  [nestedField]: stringFilter,
                },
              };
            }


            // [user.name.firstName] => 3 layer
            else if (parts.length === 3) {

              const [relation, nestedRelation, nestedField] = parts;

              const stringFilter: PrismaStringFilter = {
                contains: searchTerm,
                mode: "insensitive" as const,
              };

              return {
                [relation]: {
                  [nestedRelation]: {
                    [nestedField]: stringFilter,
                  },
                },
              };
            }
          }

          // if any '.' dot is not found, then go for direct field
          const stringFilter: PrismaStringFilter = {
            contains: searchTerm,
            mode: "insensitive" as const,
          };

          return {
            [field]: stringFilter,
          };
        },
      );

      const whereConditions = this.query.where as PrismaWhereConditions;
      whereConditions.OR = searchConditions;

      const countWhereConditions = this.countQuery.where as PrismaWhereConditions
      countWhereConditions.OR = searchConditions;
  
    }

    return this;
  }

  

  // Filtering

  filter() : this {

    const {filterableFields} = this.config;

    //  Ei jinish gula thakbe na filter object e
    const excludedFields = ["searchTerm", "page", "limit", "sortBy", "sortOrder", "fields", "includes"];

    const filterParams : Record<string, unknown> = {};
    
    // Object.keys = Object er shob keys gular array
    Object.keys(this.queryParams).forEach((key) => {
      if(!excludedFields.includes(key)) {
        filterParams[key] = this.queryParams[key]
      }
    })

    const queryWhere = this.query.where as Record<string, unknown>;

    const countQueryWhere = this.countQuery.where as Record<string, unknown>;


    Object.keys(filterParams).forEach((key) => {
      const value = filterParams[key];

      if(value === undefined || value === "") {
        return;
      }

      const isAllowedFields = !filterableFields || filterableFields.length === 0 || filterableFields.includes(key)

      if(!isAllowedFields) {
        return;
      }


      
    })

    return this;

  } 


}
