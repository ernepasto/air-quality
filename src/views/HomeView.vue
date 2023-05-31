<template>
    <div class="home">

        <n-grid v-if="isMobile" cols="5" item-responsive style="padding: 100px;">
            <n-grid-item span="0:5 1200:3" offset="1200:1">
                <n-h1 style="line-height: 110%;">Questa applicazione non è disponibile per dispositivi mobili</n-h1>       
            </n-grid-item>
        </n-grid>

        <n-grid v-else cols="5" item-responsive style="padding: 100px;">
            <n-grid-item span="0:5 1200:3" offset="1200:1">

                <n-h1>Report qualità aria della città di Milano</n-h1>
                <n-divider title-placement="left" style="margin-bottom: 70px;">
                    Report qualità aria 2023 fornito dal Comune di Milano
                </n-divider>

                <LastReport />
                <RecentReports />
                <SearchReport />
                <StationsChart />
                <StationsMap />

                <n-divider title-placement="left" style="margin-top: 150px;">
                    Alcune informazioni
                </n-divider>

                <ul style="list-style: point;">
                    <li style="margin-bottom: 10px;">Dati report qualità aria utilizzati: <a href="https://dati.comune.milano.it/" target="_blank">open data città di Milano</a></li>
                    <li>Ti è stata utile o ti piace questa applicazione? Scrivimi <a href="mailto:erne.pasto@gmail.com">erne.pasto@gmail.com</a></li>
                </ul>

            </n-grid-item>
        </n-grid>

    </div>
</template>


<script lang="ts" setup>
import { NGrid, NGridItem, NDivider, NH1 } from 'naive-ui';
import { onMounted, Ref, ref } from 'vue';

import LastReport from '../components/LastReport.vue';
import RecentReports from '../components/RecentReports.vue';
import SearchReport from '../components/SearchReport.vue';
import StationsMap from '../components/StationsMap.vue';
import StationsChart from '../components/StationsChart.vue';

const isMobile: Ref<boolean> = ref(false);

const checkWindow = (windowWidth: number) => {
    if (windowWidth < 768) {
        isMobile.value = true;
    } else {
        isMobile.value = false;
    }
};

onMounted(() => {
    checkWindow(window.innerWidth);
    onresize = (event) => checkWindow(window.innerWidth);
});

</script>