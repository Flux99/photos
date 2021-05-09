import mongoose from "mongoose";

interface PhotoAttrs{
    owner:string;
    isPublic:boolean;
}

interface PhotoDoc extends mongoose.Document{
    owner:string;
    photos:[Object];
    isPublic:boolean;
}



interface PhotoModel extends mongoose.Model<PhotoDoc>{
    build(attrs:PhotoAttrs):PhotoDoc;
}

const roomSchema = new mongoose.Schema({
    owner:{
        type: String,
        require:true
    },
    
    photos:[
        {   
                     type: Object,
                     require:true
                     
           
        },
    ],
    isPublic:{
        type: Boolean,
        require:true
    }
    
}
,{
    toJSON:{
        transform(doc,ret){
            ret.id=ret._id;
            delete ret._id;
        },
    },
}
);

roomSchema.statics.build=(attrs:PhotoAttrs)=>{
    return new Photo(attrs);
}

const Photo = mongoose.model<PhotoDoc,PhotoModel>("Photo",roomSchema);

export {Photo}