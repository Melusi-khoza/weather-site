package com.example.weather_backend.WeatherController;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
public class WeatherController {

    String UniqueString = "f3c2d27701b416b32fd6b26943dadfd2";
    
    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "ok");
        status.put("message", "Weather Backend API is running");
        status.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return status;
    }

    @GetMapping("/weather")
    public Map<String, Object> getWeather(@RequestParam String city) {
        Map<String, Object> result = new HashMap<>();

        try {
            String url = String.format(
                "https://api.openweathermap.org/data/2.5/weather?q=%s&appid=%s&units=metric",
                city, UniqueString
            );

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder().uri(URI.create(url)).build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            JSONObject json = new JSONObject(response.body());

            // ✅ Handle API errors properly
            if (json.has("cod") && json.getInt("cod") != 200) {
                result.put("error", json.optString("message", "City not found"));
                return result;
            }

            JSONObject main = json.getJSONObject("main");

            result.put("city", json.getString("name"));
            result.put("temperature", main.getDouble("temp"));
            result.put("humidity", main.getInt("humidity"));
            result.put("description", json.getJSONArray("weather").getJSONObject(0).getString("description"));
            result.put("icon", json.getJSONArray("weather").getJSONObject(0).getString("icon"));
            result.put("lat", json.getJSONObject("coord").getDouble("lat"));
            result.put("lon", json.getJSONObject("coord").getDouble("lon"));
            result.put("timezone", json.getInt("timezone"));
            result.put("wind_speed", json.getJSONObject("wind").getDouble("speed")); // m/s
            result.put("feels_like", main.getDouble("feels_like"));

        } catch (Exception e) {
            result.put("error", "Failed to fetch weather data");
        }

        return result;
    }

    @GetMapping("/weather/location")
    public Map<String, Object> getWeatherByLocation(
        @RequestParam double lat,
        @RequestParam double lon
    ) {
        Map<String, Object> result = new HashMap<>();

        try {
            String url = String.format(
                "https://api.openweathermap.org/data/2.5/weather?lat=%s&lon=%s&appid=%s&units=metric",
                lat, lon, UniqueString
            );

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder().uri(URI.create(url)).build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            JSONObject json = new JSONObject(response.body());

            if (json.has("cod") && json.getInt("cod") != 200) {
                result.put("error", json.optString("message", "Location not found"));
                return result;
            }

            JSONObject main = json.getJSONObject("main");

            result.put("city", json.getString("name"));
            result.put("temperature", main.getDouble("temp"));
            result.put("humidity", main.getInt("humidity"));
            result.put("description", json.getJSONArray("weather").getJSONObject(0).getString("description"));
            result.put("icon", json.getJSONArray("weather").getJSONObject(0).getString("icon"));
            result.put("lat", lat);
            result.put("lon", lon);
            result.put("timezone", json.getInt("timezone"));
            result.put("wind_speed", json.getJSONObject("wind").getDouble("speed")); // m/s
            result.put("feels_like", main.getDouble("feels_like"));

        } catch (Exception e) {
            result.put("error", "Failed to fetch weather data");
        }

        return result;
    }

    @GetMapping("/forecast")
    public Map<String, Object> getForecast(@RequestParam String city) {
        Map<String, Object> result = new HashMap<>();

        try {
            String url = String.format(
                "https://api.openweathermap.org/data/2.5/forecast?q=%s&appid=%s&units=metric",
                city, UniqueString
            );

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder().uri(URI.create(url)).build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            JSONObject json = new JSONObject(response.body());

            if (json.has("cod") && !json.getString("cod").equals("200")) {
                result.put("error", json.optString("message", "Forecast not found"));
                return result;
            }

            JSONArray list = json.getJSONArray("list");

            List<Map<String, Object>> hourly = new ArrayList<>();
            for (int i = 0; i < Math.min(8, list.length()); i++) {
                JSONObject f = list.getJSONObject(i);
                Map<String, Object> map = new HashMap<>();
                map.put("time", f.getString("dt_txt").split(" ")[1].substring(0, 5));
                map.put("temp", f.getJSONObject("main").getDouble("temp"));
                map.put("icon", f.getJSONArray("weather").getJSONObject(0).getString("icon"));
                hourly.add(map);
            }

            List<Map<String, Object>> daily = new ArrayList<>();
            for (int i = 0; i < list.length(); i++) {
                JSONObject f = list.getJSONObject(i);
                String dt = f.getString("dt_txt");

                if (dt.endsWith("12:00:00")) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("date", dt.split(" ")[0]);
                    map.put("temp", f.getJSONObject("main").getDouble("temp"));
                    map.put("icon", f.getJSONArray("weather").getJSONObject(0).getString("icon"));
                    daily.add(map);
                }
            }

            result.put("hourly", hourly);
            result.put("daily", daily);

        } catch (Exception e) {
            result.put("error", "Failed to fetch forecast");
        }

        return result;
    }
}