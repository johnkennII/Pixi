


export default function Steps() {
  return (
    <>
 
      <div
        className="container mx-auto py-10 md:py-20 px-3 md:px-0"
        data-aos="fade-up"
        data-aos-duration="2000"
      >
           
        <h1 className="font-primary text-transparent  bg-clip-text bg-gradient-to-r from-purple-600 to-pink-400 font-bold text-3xl md:text-6xl text-center mb-0 md:mg-8">
          Create and sell your NFTs
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-14 py-8">
          <div className="bg-[#2f302f] text-center rounded-2xl border-tertiary w-full p-2 md:p-4 flex flex-col items-center gap-3 cursor-pointer hover:scale-105 transition-all col-span-2 md:col-span-1">
            <img src="/img/7.avif" alt="" className="w-full" />
            <h1 className="text-2xl md:text-4xl text-white  font-bold">
              Create Artwork
            </h1>
            <p className="text-sm md:text-lg text-[#7f8281]">
              Create your collection, Add social links, a description, profile &
              banner images, and set a secondary sales fee
            </p>
          </div>
          <div className="bg-[#2f302f] text-center rounded-2xl border-tertiary w-full p-2 md:p-4 flex flex-col items-center gap-3 cursor-pointer hover:scale-105 transition-all col-span-2 md:col-span-1">
            <img src="/img/8.avif" alt="" className="w-full" />
            <h1 className="text-2xl md:text-4xl  font-bold text-white">
              Add your NFTs
            </h1>
            <p className="text-sm md:text-lg text-[#7f8281]">
              Upload your work, add a title and description, and customize your
              NFTs with properties, stats, and unlockable content.
            </p>
          </div>
          <div className="bg-[#2f302f] text-center rounded-2xl border-tertiary w-full p-2 md:p-4 flex flex-col items-center gap-3 cursor-pointer hover:scale-105 transition-all col-span-2 md:col-span-1">
            <img src="/img/6.avif" alt="" className="w-full" />
            <h1 className="text-2xl md:text-4xl text-white font-bold">
              List them for sale
            </h1>
            <p className="text-sm md:text-lg text-[#7f8281]">
              Choose between auctions and declining-price listings. You choose
              how you want to sell your NFTs, and we help you sell them!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
