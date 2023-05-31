<template>
    
    <n-h2 style="margin-top: 50px;">Posizionamento delle stazioni attive</n-h2>
    <p style="margin-bottom: 20px;">Nella mappa è indicato il posizionamento di ciascuna stazione di rilevamento.</p>
    <div class="stations-map">
        <div id='map' style='width: 100%; height: 400px; border-radius: 15px;margin: 0 auto;'></div>
    </div>

</template>

<script lang="ts" setup>
import { NH2 } from 'naive-ui';
import { getAllActiveStations } from '../api';

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { onMounted, ref, Ref } from 'vue';

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

let map = null;
const activeStations: Ref<Station[]> = ref(null);

const loadMap = (map, stations: Station[]) => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZ2lnaWdub21hbGF2eSIsImEiOiJjbGhuOHNxM2wxanh0M25xcDkyMjNza2xoIn0.cXhauSeh8jr2W3JXgWkN9g';
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: [9.190010, 45.464177], 
        zoom: 11
    });
    map.addControl(new mapboxgl.FullscreenControl(), 'top-left');
    map.addControl(new mapboxgl.GeolocateControl(), 'top-left');
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.addControl(new mapboxgl.ScaleControl({ maxWidth: 80, unit: 'metric' }), 'bottom-left');

    
    stations.forEach((station) => {
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`<h1 style="color: green; font-size: 14px;font-weight: 600;">Stazione ${station._id}</h1><p>Nome: ${station.nome}</p><p> Inquinanti: ${station.inquinanti}</p>`);
        new mapboxgl.Marker({ color: '#18a058' })
                    .setLngLat([parseFloat(station.LONG_X_4326).toFixed(5), parseFloat(station.LAT_Y_4326).toFixed(5)])
                    .setPopup(popup)
                    .addTo(map);
    });
};

onMounted(async () => {
    activeStations.value = await getAllActiveStations();
    await loadMap(map, activeStations.value)
});

</script>