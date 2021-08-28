export const sleep = (ms:number): Promise<void>=>{
    return new Promise((r)=>{
        setTimeout(r, ms);
    });
};

export const onlyUnique = (value, index, self)=> {
    return self.indexOf(value) === index;
  }