<template>

    <n-h2 style="margin-top: 50px;">Grafico degli inquinanti</n-h2>

    <n-space>
        <n-select 
            v-model:value="stationSelected" 
            :options="stations"
            placeholder="Scegli una stazione"
            style="width: 250px;"
        />
        <n-select 
            ref="pollutantSelectRef"
            v-if="stationSelected"
            v-model:value="pollutantSelected" 
            :options="pollutants"
            placeholder="Scegli un inquinante"
            style="width: 250px;"
        />
    </n-space>
    
    <canvas v-show="pollutantSelected" ref="chart" style="margin-top: 40px;"></canvas>

</template>


<script lang="ts" setup>
import { NH2, NSelect, NSpace, useLoadingBar, useMessage } from 'naive-ui';
import { getAllActiveStations, getAllPollutantsByStation, getStationValuesByPollutant } from '../api';
import Chart from 'chart.js/auto';

import { onMounted, ref, Ref, watch } from 'vue';
import { validateHeaderName } from 'http';
 
type Station = {
    _id: number;
    id_amat: number;
    id_arpa: number;
    nome: string;
    inzio_operativita: Date;
    fine_operativita: Date;
    inquinanti: string;
    LONG_X_4326: string;
    LAT_Y_4326: string;
};

type CharValue = {
    stazione_id: number;
    inquinante: string;
    valore: number;
    data: string;
};

const loadingBar = useLoadingBar();
const message = useMessage();

const chart = ref(null);
const pollutantSelectRef = ref(null);

const stationSelected: Ref<number> = ref(null);
let activeStations: Station[] = null;
const stations = ref([]);

const pollutantSelected: Ref<string> = ref(null);
const pollutants = ref([]);
const findedPollutants: Ref<string[]> = ref(null);

const chartData: Ref<CharValue[]> = ref();
let chartObj = null;

const drawChart = () => {
    if (chartObj) chartObj.destroy();
    let data = [];
    let labels = [];
    chartData.value.forEach((value: CharValue) => {
        data.push(value.valore);
        labels.push(value.data);
    });

    chartObj = new Chart(chart.value, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{ 
                label: `Valore di ${pollutantSelected.value}`, 
                data: data, 
                fill: true,
                borderColor: '#18a058',
                tension: 0.1,
                pointBackgroundColor: '#18a058',
                backgroundColor: '#18a05825',
                showLine: true
            }]
        },
        options: { 
            responsive: true,
            scales: { 
                y: { 
                    beginAtZero: true,
                    type: 'linear',
                    display: true,
                    position: 'left',
                }
            }
        }
    });
};

watch(stationSelected, async () => {    
    loadingBar.start();

    pollutants.value = [];
    pollutantSelected.value = null;

    findedPollutants.value = await getAllPollutantsByStation(stationSelected.value);
    findedPollutants.value.forEach((pollutant: string) => {
        pollutants.value.push({
            label: pollutant,
            value: pollutant
        });
    });

    if (pollutants.value) {
        loadingBar.finish();
        message.info('Seleziona un inquinante');
        pollutantSelectRef.value?.focus();
    }
    else loadingBar.error();
});

watch(pollutantSelected, async () => {
    loadingBar.start();

    if (pollutantSelected.value) {
        chartData.value = await getStationValuesByPollutant(stationSelected.value, pollutantSelected.value);
        chartData.value.forEach((value: CharValue) => {
            value.data = new Date(value.data).toLocaleDateString('it-IT');
        });
    }

    drawChart();

    if (chartData.value) loadingBar.finish()
    else loadingBar.error();
});

onMounted(async () => {
    activeStations = await getAllActiveStations();
    if (activeStations) {
        activeStations.forEach((station: Station) => {
            stations.value.push({ 
                label: 'Stazione: ' + station._id + ' ' + station.nome, 
                value: station._id
            });
        });
    }    
});

</script>