import axios from 'axios';

export const getRecentReports = (): Promise<ReportData[]> => {
    const resource = `cb596deb-3a28-45ce-aa78-de71e75550fd`;
    const query = `SELECT * FROM "${resource}" LIMIT 7`;
    return axios.get(`https://dati.comune.milano.it/api/3/action/datastore_search_sql?sql=${query}`)
          .then(response => response.data.result.records).catch(err => null);
};

export const getLastReport = (): Promise<ReportData> => {
    const resource = `cb596deb-3a28-45ce-aa78-de71e75550fd`;
    const query = `SELECT * FROM "${resource}" LIMIT 1`;
    return axios.get(`https://dati.comune.milano.it/api/3/action/datastore_search_sql?sql=${query}`)
          .then(response => response.data.result.records[0]).catch(err => null);
};

export const getReportByDate = (date: string): Promise<ReportData> => {
    const resource = `cb596deb-3a28-45ce-aa78-de71e75550fd`;
    const query = `SELECT * FROM "${resource}" WHERE data = '${date}'`;
    return axios.get(`https://dati.comune.milano.it/api/3/action/datastore_search_sql?sql=${query}`)
          .then(response => response.data.result.records[0]).catch(err => null);
};

export const getReportDetailsByDate = (date: string): Promise<ReportDetails[]> => {
    const resource = `d81b5f7d-20b8-4e3e-95cf-fbe3459dc1d2`;
    const query = `SELECT * FROM "${resource}" WHERE data = '${date}'`;
    return axios.get(`https://dati.comune.milano.it/api/3/action/datastore_search_sql?sql=${query}`)
          .then(response => response.data.result.records).catch(err => null);
};

export const getAllActiveStations = (): Promise<Station[]> => {
    const resource = `b301f327-7504-4efc-8b4a-5f4a29f9d0ff`;
    const date = new Date();
    const today = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();    
    const query = `SELECT * FROM "${resource}" WHERE fine_operativita > '${today}'`;
    return axios.get(`https://dati.comune.milano.it/api/3/action/datastore_search_sql?sql=${query}`)
          .then(response => response.data.result.records).catch(err => null);
};

export const getAllPollutantsByStation = (stationId: number): Promise<string[]> => {
    const resource = `b301f327-7504-4efc-8b4a-5f4a29f9d0ff`;
    const query = `SELECT inquinanti FROM "${resource}" WHERE _id = '${stationId}'`;
    return axios.get(`https://dati.comune.milano.it/api/3/action/datastore_search_sql?sql=${query}`)
          .then(response => response.data.result.records[0].inquinanti.split(', ')).catch(err => null);
};

export const getStationValuesByPollutant = (stationId: number, pollutant: string): Promise<CharValue[]> => {
    const resource = `d81b5f7d-20b8-4e3e-95cf-fbe3459dc1d2`;
    const query = `SELECT stazione_id, inquinante, valore, data FROM "${resource}" 
                   WHERE stazione_id = '${stationId}' AND inquinante = '${pollutant}' ORDER BY data`;
    return axios.get(`https://dati.comune.milano.it/api/3/action/datastore_search_sql?sql=${query}`)
          .then(response => response.data.result.records).catch(err => null);
};