<template>
    
    <n-h2 style="margin-top: 50px;">Ultimi sette report</n-h2>
    <p>Clicca per vedere i report degli ultimi sette giorni.</p>
    <n-button @click="toggleReports" type="primary" ghost style="margin: 8px 0;">{{ btnMessage }}</n-button>
    <n-table v-if="showReports" :bordered="true" :single-line="false">
        <thead>
            <tr>
                <th>Data</th>
                <th>Descrizione</th>
                <th>Previsione</th>
                <th>Tendenza</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="report in recentReports" :key="report._id">
                <td>{{ formatData(report.data) }}</td>
                <td>{{ report.descrizione }}</td>
                <td>{{ report.previsione }}</td>
                <td>{{ report.tendenza }}</td>
            </tr>
        </tbody>
    </n-table>

</template>

<script lang="ts" setup>
import { useLoadingBar, NTable, NH2, NButton } from 'naive-ui';
import { getRecentReports } from '../api';

import { onMounted, ref, Ref } from 'vue';

type ReportData = {
    _id: number;
    data: Date;
    descrizione: string;
    previzione: string;
    tendenza: string;
};

const loadingBar = useLoadingBar();

const recentReports: Ref<ReportData[]> = ref(null);
const showReports: Ref<boolean> = ref(false);
const btnMessage: Ref<string> = ref('Mostra dati');

const formatData = (date: string) => new Date(date).toLocaleDateString('it-IT');

const toggleReports = async () => {
     if (!recentReports.value && !showReports.value) {
        loadingBar.start();
        recentReports.value = await getRecentReports();
        showReports.value = true;
        btnMessage.value = 'Nascondi dati';
        if (recentReports.value) loadingBar.finish();
        else loadingBar.error();
    } else if (recentReports.value && !showReports.value) {
        showReports.value = true;
        btnMessage.value = 'Nascondi dati';
    } else {
        showReports.value = false;
        btnMessage.value = 'Mostra dati';
    }
};

</script>