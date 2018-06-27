import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { Observable } from "rxjs/Rx";
import { NotificacaoDTO } from "../../models/notificacao.dto";
import { StorageService } from "../storage.service";
import { ImageUtilService } from "./image-util.service";

@Injectable()
export class NotificacaoService {

    constructor(public http: HttpClient,
        public storage: StorageService,
        public imageUtilService: ImageUtilService ) {

    }

    findAll(): Observable<NotificacaoDTO[]> {
        return this.http.get<NotificacaoDTO[]>(`${API_CONFIG.baseUrl}/notificacoes`);
    }

    findByNotificacao(notificacao_id: string) {
        return this.http.get(`${API_CONFIG.baseUrl}/notificacoes/${notificacao_id}`);
    }

    findByNotificacaoUser(user_id: string): Observable<NotificacaoDTO[]> {
        return this.http.get<NotificacaoDTO[]>(`${API_CONFIG.baseUrl}/notificacoes/user/${user_id}`);
    }

    criarNotificacao(latitude: string, longitude: string, endereco: string, categoria: string, descricao: string){
        let body = {
            "usuario": this.storage.getUsuarioDTO(),
            "latitude": latitude,
            "longitude": longitude,
            "endereco": endereco,
            "categoria": categoria,
            "descricao": descricao,
            "ativo": true
        };
        return this.http.post(`${API_CONFIG.baseUrl}/notificacoes`,
            body,
            {
                observe: 'response',
                responseType: 'text'
            });
    }

   extractId(location: string): string {
        let position = location.lastIndexOf('/');
        return location.substring(position + 1, location.length);
    }

    uploadPicture(picture, cod){
        let pictureBlob = this.imageUtilService.dataUriToBlob(picture);
        let formData: FormData = new FormData();
        formData.set('file', pictureBlob, 'file.png');
        return this.http.post(`${API_CONFIG.baseUrl}/notificacoes/picture/${cod}`,
           formData,
            {
                observe: 'response',
                responseType: 'text'
            })
    }

}