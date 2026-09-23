import {
  IQueryConfig,
  IQueryParams,
  PrismaCountArgs,
  PrismaFindManyArgs,
  prismaModelDelegate,
  PrismaNumberFilter,
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

  private selectedFields: Record<string, boolean | undefined> = {};

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


      // handle nesting part
      // /doctors?user.name=john => {user : {name : "john"}}
      if(key.includes(".")) {
        const parts = key.split(".");

        if(filterableFields &&  !filterableFields.includes(key)) {
          return;
        }

        // if the query has 2 layers nested
        if(parts.length === 2) {
          const [relation, nestedField] = parts;  // relation = user, nestedField = name

          if(!queryWhere[relation]) {
            queryWhere[relation] = {};
            countQueryWhere[relation] = {};
          }

          queryWhere[relation] = {  // user = name : "john" 
            [nestedField] : this.parseFilterValue(value)
          }

          countQueryWhere[relation] = {
            [nestedField] : this.parseFilterValue(value)
          };

          return;
        } 
        
        // if the query has 3 layers nested
        else if (parts.length === 3) {
          const [relation, nestedRelation, nestedField] = parts;

          if(!queryWhere[relation]) {
            queryWhere[relation] = {};
            countQueryWhere[relation] = {};
          }

          queryWhere[relation] = {
            [nestedRelation] : {
              [nestedField] : this.parseFilterValue(value)
            }
          };

          countQueryWhere[relation] = {
            [nestedRelation] : {
              [nestedField] : this.parseFilterValue(value)
            }
          };

          return;

        };

      }

      // without nesting
      else {
        queryWhere[key] = value;
        countQueryWhere[key] = value;
        return;
      }


      // RANGE filter parsing
      // value jodi object hoy, null na hoy, array na hoy
      if(typeof value === 'object' && value != null && !Array.isArray(value)) {

        queryWhere[key] = this.parseRangeFilter(value as Record<string, string | number>);

        countQueryWhere[key] = this.parseRangeFilter(value as Record<string, string | number>);
        return;
      }

      // no nesting, direct value parsing
      queryWhere[key] = this.parseFilterValue(value);
      countQueryWhere[key] = this.parseFilterValue(value);

    })

    return this;

  } 


  paginate() : this {

    const page = Number(this.queryParams.page) || 1;
    const limit = Number(this.queryParams.limit) || 10;  // 1 ta page e koyta kore data dekhabo

    this.page = page;
    this.limit = limit;
    this.skip = (page - 1) * limit; // page 2 te prothom 10 ta skip kore porer 10 ta dekhabe, page 3 e prothom 20 ta skip kore baki 10 ta dekhabe

    this.query.skip = this.skip;
    this.query.take = this.limit;


    return this;
  };


  sort() : this {

    const sortBy = this.queryParams.sortBy || "createdAt";
    const sortOrder = this.queryParams.sortOrder === 'asc' ? 'asc' : 'desc';

    this.sortBy = sortBy;
    this.sortOrder = sortOrder;

    // /doctors?sortBy=user.name&sortOrder=asc ==> orderBy: {user : {name : 'asc'}} - nested sorting

    if(sortBy.includes(".")) {
      const parts = sortBy.split(".");

      if(parts.length === 2) {
        const [relation, nestedField] = parts;

        this.query.orderBy = { 
          [relation] : {     // {user : {name : 'asc'}}
            [nestedField] : sortOrder
          }
        }
      } else if(parts.length === 3) {
        const [relation, nestedRelation, nestedField] = parts;

        this.query.orderBy = {
          [relation] : {          // {user : {name : {firstName : "asc"}}}
            [nestedRelation] : {
              [nestedField] : sortOrder
            }
          }
        }

      } else {
        this.query.orderBy = {
          [sortBy] : sortOrder   // value of sortBy : sortOrder (name : "asc")
        }
      }
    };

    return this;
  };


  fields() : this {

    const fieldsParams = this.queryParams.fields;

    if(fieldsParams && typeof fieldsParams === 'string') {

    const fieldsArray = fieldsParams?.split(",").map((field) => field.trim());

    this.selectedFields = {};

    fieldsArray?.forEach((field) => {
      if(this.selectedFields) {
        this.selectedFields[field] = true;
      }
    });

    this.query.select = this.selectedFields as Record<string, boolean | Record<string, unknown>>;

    delete this.query.include;    
  }
  
  return this;
  }


  private parseFilterValue(value : unknown) : unknown {
    if(value === 'true') {

      return true;
    };

    if(value === 'false') {
      return false;
    }

    if(typeof value === 'string' && !isNaN(Number(value)) && value != "") {
      return Number(value);
    }

    if(Array.isArray(value)) {
      return {
        in : value.map((item) => this.parseFilterValue(item))  // recursive way to parse
      }
    }

    return value;
  }



  private parseRangeFilter(value : Record<string, string | number>) : PrismaNumberFilter | PrismaStringFilter | Record<string, unknown> {

    const rangeQuery : Record<string, string | number | (string | number)[]> = {};

    Object.keys(value).forEach((operator) => {
      const operatorValue = value[operator];

      const parsedValue : string | number = typeof operatorValue === 'string' && !isNaN(Number(operatorValue)) ? Number(operatorValue) : operatorValue;

      switch(operator) {
        case "lt": 
        case "lte": 
        case "gt": 
        case "gte": 
        case "equals": 
        case "not": 
        case "contains": 
        case "startsWith": 
        case "endsWith":
          rangeQuery[operator] = parsedValue;
          break;
        

        case "in":
        case "notIn":
          if(Array.isArray(operatorValue)) {
            rangeQuery[operator] = operatorValue;
          } else {
            rangeQuery[operator] = [parsedValue];
          }
          break;

          default:
            break; 


      }
    });

    return Object.keys(rangeQuery).length > 0 ? rangeQuery : value;
  }

}
