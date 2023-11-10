import { useState, useEffect } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;

export const URL_API = "https://api.aedu.id";
export const URL_API_COMM = "https://communityhubapi.aedu.id";
export const URL_API_ENTER = "https://enterpriseapi.aedu.id";

const useFetch = (endpoint, URL) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const options = {
    method: "GET",
    url: `${URL || URL_API}${endpoint}`,
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios(options);
      setData(response?.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsError(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { isLoading, isError, data, fetchData };
};

export default useFetch;
