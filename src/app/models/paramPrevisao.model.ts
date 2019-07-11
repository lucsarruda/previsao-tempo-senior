export class ParamPrevisao {
    public idEstado : number
    public estado : string
    public cidade : string

    constructor(idEstado: number, estado: string , cidade : string ) {
        this.idEstado = idEstado;
        this.estado = estado;
        this.cidade = cidade;
    }

}