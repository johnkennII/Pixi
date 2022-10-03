import { FaDiscord } from "react-icons/fa";
export default function Community() {
  return (
    <div className="h-[45vh]">
    <div
        className="container mx-auto py-4 md:py-16 px-3 md:px-0 
        border-[#4e2f6b] bg-[#2f302f] 
        rounded-3xl flex flex-col items-center gap-6 mb-10 h-[40vh]"
        data-aos="fade-up"
        data-aos-duration="2000"
      >
        <h1 className="text-transparent  bg-clip-text bg-gradient-to-r from-purple-600 to-pink-400 font-bold text-2xl md:text-6xl text-center">
          Join Our Community
        </h1>
        <p className="text-center text-transparent  bg-clip-text bg-gradient-to-r from-purple-600 to-pink-400 text-base md:text-xl">
          Meet the company team, artist and collector for platform updates,
          announcements, and more ...
        </p>
        <button className="border-pink-400 hover:text-purple-600 text-transparent  bg-clip-text bg-gradient-to-r from-purple-600 to-pink-400 hover:bg-transparent  text-base md:text-xl px-6 py-3 border-2 rounded-full font-bold transition-all flex items-center gap-2">
          <FaDiscord size={28} color='purple' /> Launch Discord
        </button>
      </div>
    
    </div>
  );
}
