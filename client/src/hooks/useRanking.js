import { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../utils/services';

const useRanking = (data) => {
  const [rankingData, setRankingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRankingData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/users/rating-${data}`);
        console.log('fetchRankingData',response.data)
        setRankingData(response.data);
      } catch (err) {
        setError(err.message || 'Error al obtener los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchRankingData();
  }, [data]);

  return { rankingData, loading, error };
};

export default useRanking;
