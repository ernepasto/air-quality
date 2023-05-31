<template>

    <n-grid v-if="!mounted" cols="1" style="padding: 100px;">
        <n-grid-item span="1">
            <n-space justify="center">
                <n-spin size="small" />
            </n-space>
        </n-grid-item>
    </n-grid>
    
    <n-h2>Report più recente <n-badge value="Last"></n-badge></n-h2>
        <n-table v-if="lastReport" :bordered="true" :single-line="false">
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
                    <td>{{ formatData(lastReport.data) }}</td>
                    <td>{{ lastReport.descrizione }}</td>
                    <td>{{ lastReport.previsione }}</td>
                    <td>{{ lastReport.tendenza }}</td>
                </tr>
            </tbody>
        </n-table>


        <n-button @click="toggleReportDetails(lastReport.data)" v-if="lastReport" style="margin: 8px 0;">{{ btnMessage }}</n-button>


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
                <tr v-for="details in lastReportsDetails" :key="details._id">
                    <td>{{ formatData(details.data) }}</td>
                    <td>{{ details.stazione_id }}</td>
                    <td>{{ details.inquinante }}</td>
                    <td>{{ details.valore }}</td>
                </tr>
            </tbody>
        </n-table>

</template>

<script lang="ts" setup>
import { useLoadingBar, NTable, NH2, NButton, NSpin, NSpace, NBadge } from 'naive-ui';
import { getLastReport, getReportDetailsByDate } from '../api';

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
const mounted: Ref<boolean> = ref(false);

const lastReport: Ref<ReportData> = ref(null);
const lastReportsDetails: Ref<ReportDetails[]> = ref(null);

const showDetails: Ref<boolean> = ref(false);
const btnMessage: Ref<string> = ref('Mostra dettagli');

const formatData = (date: string) => new Date(date).toLocaleDateString('it-IT');

const toggleReportDetails = async (date: string) => {
    if (!lastReportsDetails.value && !showDetails.value) {
        loadingBar.start();
        lastReportsDetails.value = await getReportDetailsByDate(date);
        showDetails.value = true;
        btnMessage.value = 'Nascondi dettagli';
        if (lastReportsDetails.value) loadingBar.finish();
        else loadingBar.error();
    } else if (lastReportsDetails.value && !showDetails.value) {
        showDetails.value = true;
        btnMessage.value = 'Nascondi dettagli';
    } else {
        showDetails.value = false;
        btnMessage.value = 'Mostra dettagli';
    }
};

onMounted(async () => {
    loadingBar.start();
    lastReport.value = await getLastReport();

    if (lastReport.value) {
        loadingBar.finish();
        mounted.value = true;
    } else loadingBar.error(); 

});

</script>