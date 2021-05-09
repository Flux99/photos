import {Photo} from "./models/Photo";

export async function createPublicSingles(owner:string,file:any){
    const {originalname,path}= file;
    const photo = Photo.build({
        owner:owner,
        isPublic:true
    }); 
    await photo.save();
    photo.photos.push(file);
    await photo.save();
    console.log("createPublicSingles",photo);
    
    return photo;
}

export async function createPrivateSingles(owner:string,file:any){
    const {originalname,path}= file;

    const photo = Photo.build({
        owner:owner,
        isPublic:false
    });
    await photo.save();
    photo.photos.push(file);
    await photo.save();
    return photo;
}

export async function findByOwnerPublic(){
    const photos = Photo.find();
    await photos.exec();
    if(!photos){
        console.log("photos Does not exist...");
        return false;
    }
        return photos;
    
}

export async function createArrayPublic(owner:string,files:any){
    const photos = Photo.build({
        owner:owner,
        isPublic:true
    });
    await photos.save();
    console.log("before photos[]",photos);
    files.forEach((element:any) => {
    photos.photos.push(element);
    });
    await photos.save();
    console.log("after photos[]",photos);
    return true;
    
}