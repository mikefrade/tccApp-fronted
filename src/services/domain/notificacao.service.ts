import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { Observable } from "rxjs/Rx";
import { NotificacaoDTO } from "../../models/notificacao.dto";

@Injectable()
export class NotificacaoService {

    constructor(public http: HttpClient){

    }

    findAll() :  Observable<NotificacaoDTO[]>{
        return this.http.get<NotificacaoDTO[]>(`${API_CONFIG.baseUrl}/notificacoes`);
    }

}