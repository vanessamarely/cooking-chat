import CookingChat from "./components/CookingChat";

export default function Home() {
  return (
    <main className="flex w-screen h-screen flex-col items-center justify-between p-6">
      <div className="flex flex-col items-center justify-center">
       
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Cooking Chat
        </h1>
      </div>

      <div className="relative flex place-items-center">
        <CookingChat />
      </div>

      <div className="mb-32 flex justify-center items-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        2024 © Cooking Chat
      </div>
    </main>
  );
}
