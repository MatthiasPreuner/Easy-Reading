class DatabaseRequest{
    constructor(tableName){

        this.selectors = [];
        this.conditions = [];
        this.orders = [];
        this.op = operation.SELECT;
        this.tableName = tableName;
    }


    select(selectors){



        return this;
    }



    insert(object){

        this.op = operation.INSERT;
        this.object = object;
        return this;
    }

    insertOrUpdate(object){
        this.op = operation.INSERT_OR_UPDATE;
        this.object = object;
        return this;
    }

    update(object){
        this.op = operation.UPDATE;
        this.object = object;
        return this;
    }

    delete(){
        this.op = operation.DELETE;
        return this;
    }

    where(identifier,comparator, value){

        if(typeof identifier !== 'undefined' && typeof comparator !== 'undefined'&& typeof value !== 'undefined'){
            this.conditions.push([identifier,comparator,value]);
        }else{
            if(Array.isArray(identifier)){
                this.conditions = identifier;
            }else{
                throw Error("Invalid where clause!");
            }

        }
        return this;
    }

    orderBy(columnName,direction){

        if(direction !== 'ASC' && direction !== 'DESC'){
            throw Error("direction must be asc or desc");
        }

        this.orders.push({
            columnName: columnName,
            direction:direction
        });

        return this;


    }
}


module.exports  = DatabaseRequest;

let operation  ={
    INSERT:"INSERT",
    INSERT_OR_UPDATE: "INSERT_OR_UPDATE",
    UPDATE:"UPDATE",
    DELETE:"DELETE",
    SELECT:"SELECT",
};