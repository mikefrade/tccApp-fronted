import { Injectable } from "@angular/core";
import { STORAGE_KEYS } from "../config/storage_keys.config";
import { UsuarioDTO } from "../models/usuario.dto";

@Injectable()
export class StorageService{
    getUsuarioDTO(): UsuarioDTO{
        let usr = localStorage.getItem(STORAGE_KEYS.usuarioDTO);
        if (usr == null){
            return null;
        } else {
            return JSON.parse(usr); 
        }

    }
    setUsuarioDTO(obj: UsuarioDTO){
        if ( obj == null){
            localStorage.removeItem(STORAGE_KEYS.usuarioDTO);
        } else{
            localStorage.setItem(STORAGE_KEYS.usuarioDTO, JSON.stringify(obj));
        }

    }
}