import Button from './Button'
import { FaEthereum } from 'react-icons/fa'
import { GrView } from 'react-icons/gr'
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
              <div
                key={index}
                data-aos="fade-up"
                data-aos-duration="3000"
              >
                <div className="bg-[#2f302f]  rounded-2xl flex flex-col  hover:scale-105 transition-all cursor-pointer  w-[280px] h-[300px]">
                  <div className="flex  absolute p-2">
                    <button className="bg-[#2f302f] h-8 p-1 rounded-lg text-white text-xs">
                      {item.price} ETH
                    </button>
                    <div className="bg-[#2f302f] p-2 rounded-full ml-44">
                      <FaEthereum color="#ECDBBA" size="1rem" />
                    </div>
                  </div>
                  <img
                    src={`/img/${item.image}`}
                    alt=""
                    className="h-[220px] rounded-t-xl"
                  />
                  <div className="p-2 flex justify-between">
                    <h6 className="font-primary text-white font-bold text-xl md:text-xl">
                      {item.title}
                    </h6>
                    <p className="text-[#797d7b]">@{item.username}</p>
                  </div>
                  <div className="p-2 flex justify-between">
                    <h6 className="font-primary text-[#7f8281] font-bold text-sm md:text-sm">
                      440likes
                    </h6>
                    <div className="flex">
                      <GrView color="#ECDBBA" size=".8rem" />
                      <span
                        style={{
                          color: '#7f8281',
                          marginLeft: '3px',
                          fontSize: 10,
                        }}
                      >
                        420k
                      </span>
                    </div>
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
