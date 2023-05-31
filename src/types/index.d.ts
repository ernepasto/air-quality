type ReportData = {
    _id: number;
    data: Date;
    descrizione: string;
    previzione: string;
    tendenza: string;
};

type ReportDetails = {
    _id: number;
    data: Date;
    stazione_id: number;
    inquinante: string;
    valore: number;
};

type Station = {
    _id: number;
    id_amat: number;
    id_arpa: number;
    nome: string;
    inzio_operativita: Date;
    fine_operativita: Date;
    inquinanti: string;
    LONG_X_4326: number;
    LAT_Y_4326: number;
};

type CharValue = {
    stazione_id: number;
    inquinante: string;
    valore: number;
    data: Date;
};