import Button from './Button'
import { BiHeart } from "react-icons/bi";
import data from '../../data/item-nft.json'


export default function Collections() {
  return (
    <>
      <div
        className="container mx-auto py-4 md:py-20 px-3 md:px-0"
        data-aos="fade-up"
        data-aos-duration="2000"
      >
        <div className="flex justify-between items-center">
          <h1 className="font-primary  font-bold text-3xl md:text-5xl text-transparent  bg-clip-text bg-gradient-to-r from-purple-600 to-pink-400 mb-4">
            Hot Drops
          </h1>
          <Button text="View More" variant="secondary" />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {data.map((item, index) => {
            return (
              <div key={index} data-aos="fade-up" data-aos-duration="3000">
                <div className="bg-[#2f302f]  rounded-2xl flex flex-col  hover:scale-105 transition-all cursor-pointer  w-[280px] h-[300px]">
                  <img
                    src={`/img/${item.image}`}
                    alt=""
                    className="h-[220px] rounded-t-xl"
                  />
                  <div className="p-2 flex justify-between">
                    <h6 className="font-primary text-white font-bold text-xl md:text-xl">
                      {item.title}
                    </h6>
                    <p className="text-[#797d7b] flex">
                      <img
                        src="https://cryptologos.cc/logos/avalanche-avax-logo.png"
                        alt="eth"
                        className="h-5 mr-2"
                      />
                      {item.username}
                    </p>
                  </div>
                  <div className="p-2 flex justify-between">
                   
                    <button
                className="flex  items-center  px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={() => buyNFT(nftItem)}
              >
                Buy
              </button>
              <h6 className="font-primary text-[#7f8281] font-bold text-sm md:text-sm flex">
                    <span>12</span>
                    <BiHeart  className='mt-1'/>
                    </h6>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
