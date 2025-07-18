"use client";
import React, { useState, useEffect } from "react";
import Location from "@/components/Location";
import HoursForcastContainer from "@/components/HoursForcastContainer";
import { getUserCoords } from "@/utils/getUserCoords";
import { WeatherByDay, WeatherByHour } from "@/utils/types";
import { getWeatherByCoords } from "@/utils/getWeatherByCoords";
import TempChart from "@/components/TempChart";

type Coords = {
  latitude: number;
  longitude: number;
};

function WeatherDashboard() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [userCity, setUserCity] = useState<string | null>(null);
  const [weatherHourArray, setWeatherHourArray] = useState<WeatherByHour[]>([]);
  const [weatherDailyArray, setWeatherDailyArray] = useState<WeatherByDay[]>([]);

  const [foundCoords, setFoundCoords] = useState<true | false>(false);

  useEffect(() => {
    const fetchCoords = async () => {
      try {
        const position = await getUserCoords();
        setCoords({
          latitude: position.latitude,
          longitude: position.longitude,
        });
        setFoundCoords(true);
        console.log("position", position);
      } catch (err: any) {
        console.error("Failed to getUserCoords", err.message);
      }
    };

    fetchCoords();
  }, []);

  useEffect(() => {
    const fetchCity = async () => {
      try {
        if (coords !== null) {
          const res = await fetch(
            `/api/reverse-geocode?lat=${coords.latitude}&lon=${coords.longitude}`
          );
          const data = await res.json();

          const properties = data.features?.[0]?.properties?.geocoding;

          const locationName =
            properties.city ||
            properties.town ||
            properties.village ||
            properties.hamlet ||
            properties.state ||
            properties.country ||
            "Unknown location";

          setUserCity(locationName);
          console.log("hello", data);
        }
      } catch (err: any) {
        setUserCity("Could not find location");
        console.error("Failed to get city from coords", err);
      }
    };
    fetchCity();
  }, [foundCoords]);

  useEffect(() => {
    if (coords) {
      const fetchWeather = async () => {
        try {
          const [hourWeather, dailyWeather] = await getWeatherByCoords(
            coords.latitude,
            coords.longitude,
            19
          );
          setWeatherHourArray(hourWeather);
          setWeatherDailyArray(dailyWeather);
          console.log(hourWeather);
        } catch (err: any) {
          console.error("Failed to get weather by coords", err);
        }
      };
      fetchWeather();
    }
  }, [coords]);

  useEffect(() => {
    if (userCity) {
      console.log(userCity);
    }
  }, [userCity]);

  return (
    <main className="w-7xl h-[600px] bg-card rounded-2xl p-8 m-2 flex flex-col items-start gap-2">
      <Location
        setCoords={setCoords}
        userCity={userCity}
        setUserCity={setUserCity}
      />
      <hr className=" bg-amber-500" />
      <div className="flex flex-col gap-4 items-start">
        <HoursForcastContainer
          weatherArray={weatherHourArray}
          weatherDailyArray={weatherDailyArray}
        />
        <TempChart weatherArray={weatherHourArray} />
      </div>
    </main>
  );
}

export default WeatherDashboard;
