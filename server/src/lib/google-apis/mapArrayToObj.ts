export function mapArraytoObj(data:any){
    const keys = data[0];
    const values = data.slice(1); //gets all the rows except the first one.

    const result = values.map((item:string) => {
        const obj:any = {};
        keys.forEach((key:string, index:number) => {
            obj[key] = item[index] || ''; // Assign default empty string if undefined
        });
        return obj;
    });

    return result;
}