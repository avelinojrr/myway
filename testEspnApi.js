import axios from 'axios';

const url = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard';

const fetchNBAData = async () => {
    try {
        const response = await axios.get(url);
        console.log('✅ Respuesta de ESPN API (NBA):', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('❌ Error al obtener datos de ESPN API (NBA):', error.message);
    }
};

fetchNBAData();
