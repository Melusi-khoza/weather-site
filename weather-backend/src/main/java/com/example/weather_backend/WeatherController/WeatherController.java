package com.example.weather_backend.WeatherController;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*")
@RestController
public class WeatherController {

    private static final String API_KEY = "f3c2d27701b416b32fd6b26943dadfd2";

    //Add health check endpoint
    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "ok");
        status.put("message", "Weather Backend API is running");
        status.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return status;
    }

    // Current weather by city
    @GetMapping("/weather")
    public Map<String, Object> getWeather(@RequestParam String city) {
        Map<String, Object> result = new HashMap<>();
        try {
            String url = String.format(
                "https://api.openweathermap.org/data/2.5/weather?q=%s&appid=%s&units=metric",
                city, API_KEY
            );

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder().uri(URI.create(url)).build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            JSONObject json = new JSONObject(response.body());
            JSONObject main = json.getJSONObject("main");

            result.put("city", json.getString("name"));
            result.put("temperature", main.getDouble("temp"));
            result.put("humidity", main.getInt("humidity"));
            result.put("description", json.getJSONArray("weather").getJSONObject(0).getString("description"));
            result.put("icon", json.getJSONArray("weather").getJSONObject(0).getString("icon"));
            result.put("lat", json.getJSONObject("coord").getDouble("lat"));
            result.put("lon", json.getJSONObject("coord").getDouble("lon"));

        } catch (Exception e) {
            result.put("error", e.getMessage());
        }
        return result;
    }

    // Current weather by coordinates
    @GetMapping("/weather/location")
    public Map<String, Object> getWeatherByLocation(@RequestParam double lat, @RequestParam double lon) {
        Map<String, Object> result = new HashMap<>();
        try {
            String url = String.format(
                "https://api.openweathermap.org/data/2.5/weather?lat=%s&lon=%s&appid=%s&units=metric",
                lat, lon, API_KEY
            );

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder().uri(URI.create(url)).build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            JSONObject json = new JSONObject(response.body());
            JSONObject main = json.getJSONObject("main");

            result.put("city", json.getString("name"));
            result.put("temperature", main.getDouble("temp"));
            result.put("humidity", main.getInt("humidity"));
            result.put("description", json.getJSONArray("weather").getJSONObject(0).getString("description"));
            result.put("icon", json.getJSONArray("weather").getJSONObject(0).getString("icon"));
            result.put("lat", lat);
            result.put("lon", lon);

        } catch (Exception e) {
            result.put("error", e.getMessage());
        }
        return result;
    }

    // Forecast: hourly and daily
    @GetMapping("/forecast")
    public Map<String, Object> getForecast(@RequestParam String city) {
        Map<String, Object> result = new HashMap<>();
        try {
            String url = String.format(
                "https://api.openweathermap.org/data/2.5/forecast?q=%s&appid=%s&units=metric",
                city, API_KEY
            );

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder().uri(URI.create(url)).build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            JSONObject json = new JSONObject(response.body());
            JSONArray list = json.getJSONArray("list");

            // Hourly forecast: next 8
            List<Map<String, Object>> hourly = new ArrayList<>();
            for (int i = 0; i < Math.min(8, list.length()); i++) {
                JSONObject f = list.getJSONObject(i);
                Map<String, Object> map = new HashMap<>();
                map.put("time", f.getString("dt_txt").split(" ")[1].substring(0, 5));
                map.put("temp", f.getJSONObject("main").getDouble("temp"));
                map.put("icon", f.getJSONArray("weather").getJSONObject(0).getString("icon"));
                hourly.add(map);
            }

            // Daily forecast: 12:00:00 for each day
            List<Map<String, Object>> daily = new ArrayList<>();
            for (int i = 0; i < list.length(); i++) {
                JSONObject f = list.getJSONObject(i);
                String dt_txt = f.getString("dt_txt");
                if (dt_txt.endsWith("12:00:00")) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("date", dt_txt.split(" ")[0]);
                    map.put("temp", f.getJSONObject("main").getDouble("temp"));
                    map.put("icon", f.getJSONArray("weather").getJSONObject(0).getString("icon"));
                    daily.add(map);
                }
            }

            result.put("hourly", hourly);
            result.put("daily", daily);

        } catch (Exception e) {
            result.put("error", e.getMessage());
        }

        return result;
    }
}