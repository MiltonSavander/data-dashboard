import Image from "next/image";
import WeatherDashboard from "@/components/WeatherDashboard";

export default function Home() {
  return (
    <main className="min-h-screen w-screen flex justify-center items-center">
      <WeatherDashboard />
    </main>
  );
}
