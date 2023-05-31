<template>

    <n-h2 style="margin-top: 50px;">Cerca un report tramite data</n-h2>
    <n-space style="margin-bottom: 10px;">
        <n-date-picker
            ref="datePickerRef"
            v-model:formatted-value="dateToSearch"
            value-format="yyyy-MM-dd"
            type="date"
            :is-date-disabled="dateDisabled"
            placeholder="Scegli una data"
            clearable
        />
        <n-button @click="searchReport" type="primary" ghost>Cerca dati</n-button>
    </n-space>

    <n-table v-if="searchedReport" :bordered="true" :single-line="false">
        <thead>
            <tr>
                <th>Data</th>
                <th>Descrizione</th>
                <th>Previsione</th>
                <th>Tendenza</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ formatData(searchedReport.data) }}</td>
                <td>{{ searchedReport.descrizione }}</td>
                <td>{{ searchedReport.previsione }}</td>
                <td>{{ searchedReport.tendenza }}</td>
            </tr>
        </tbody>
    </n-table>
    
    <n-button @click="toggleReportDetails(searchedReport.data)" v-if="searchedReport" style="margin: 8px 0;">{{ btnMessage }}</n-button>

    <n-table v-if="showDetails" :bordered="true" :single-line="false">
        <thead>
            <tr>
                <th>Data</th>
                <th>Stazione</th>
                <th>Inquinante</th>
                <th>Valore</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="details in reportsDetails" :key="details._id">
                <td>{{ formatData(details.data) }}</td>
                <td>{{ details.stazione_id }}</td>
                <td>{{ details.inquinante }}</td>
                <td>{{ details.valore }}</td>
            </tr>
        </tbody>
    </n-table>
    <n-empty v-if="!searchedReport" description="Nessun dato trovato." style="padding: 30px 0;"></n-empty>
    
</template>

<script lang="ts" setup>
import { useLoadingBar, NTable, NH2, NButton, NDatePicker, useMessage, NSpace, NEmpty } from 'naive-ui';
import { getReportByDate, getReportDetailsByDate } from '../api';

import { onMounted, ref, Ref } from 'vue';

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

const loadingBar = useLoadingBar();
const message = useMessage();

const datePickerRef = ref(null);
const dateToSearch = ref(null);
const dateDisabled = (ts: number) => {
    const year = new Date(ts).getFullYear();
    const actualYear = new Date().getFullYear(); 
    return (year !== actualYear);
};

const searchedReport: Ref<ReportData> = ref(null);
const reportsDetails: Ref<ReportDetails[]> = ref(null);

const showDetails: Ref<boolean> = ref(false);
const btnMessage: Ref<string> = ref('Mostra dettagli');

const formatData = (date: string) => new Date(date).toLocaleDateString('it-IT');

const searchReport = async () => {
    if (dateToSearch.value) {
        loadingBar.start();
        searchedReport.value = await getReportByDate(dateToSearch.value);
        if (searchedReport.value) {
            loadingBar.finish();
            reportsDetails.value = null;
        } else loadingBar.error();
    } else {
        message.warning('Nessuna data inserita per la ricerca di un report!'); 
        datePickerRef.value?.focus();
    }   
};

const toggleReportDetails = async (date: string) => {
    if (!reportsDetails.value && !showDetails.value) {
        loadingBar.start();
        reportsDetails.value = await getReportDetailsByDate(date);
        showDetails.value = true;
        btnMessage.value = 'Nascondi dettagli';
        if (reportsDetails.value) loadingBar.finish();
        else loadingBar.error();
    } else if (reportsDetails.value && !showDetails.value) {
        showDetails.value = true;
        btnMessage.value = 'Nascondi dettagli';
    } else {
        showDetails.value = false;
        btnMessage.value = 'Mostra dettagli';
    }
};

</script>